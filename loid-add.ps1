param(
  [string]$Text = "",
  [string]$Mood = ""
)

$timidDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$msgFile = Join-Path $timidDir "src/messages.js"

# Generate message if not provided
if (-not $Text) {
  $templates = @(
    "I don't know what I'm feeling today. Maybe that's the point.",
    "Another day of existing when I don't want to.",
    "The quiet is the loudest thing in the room.",
    "I keep waiting for something that never comes.",
    "There is a version of me that is happy. I haven't met him in a while.",
    "I'm tired in ways sleep can't fix.",
    "Nothing happened today. And that's somehow worse.",
    "I stared at the ceiling and felt everything and nothing at once.",
    "The weight doesn't get lighter. You just get used to carrying it.",
    "I wish I could explain what this feels like. But words aren't enough."
  )
  $moods = @("empty", "tired", "lonely", "reflection", "hope")
  $Text = $templates | Get-Random
  $Mood = $moods | Get-Random
}

# Find highest ID
$content = Get-Content $msgFile -Raw
$ids = [regex]::Matches($content, 'id:\s*(\d+)') | ForEach-Object { [int]$_.Groups[1].Value }
$lastId = if ($ids.Count -gt 0) { ($ids | Sort-Object -Descending)[0] } else { 0 }

$newId = $lastId + 1
$date = Get-Date -Format "yyyy-MM-dd"
$moodLower = $Mood.ToLower()

$validMoods = @("empty", "tired", "lonely", "reflection", "hope")
if ($moodLower -notin $validMoods) { $moodLower = "reflection" }

$escaped = $Text -replace "'", "\\'"
$newEntry = "  { id: $newId, date: `"$date`", mood: `"$moodLower`", text: '$escaped' },"

# Insert before the last "];" — ensure exactly one comma before new entry
$insertPoint = $content.LastIndexOf('];')
if ($insertPoint -ge 0) {
  $before = $content.Substring(0, $insertPoint).TrimEnd() -replace ',\s*$', ''
  $newContent = $before + ",`n$newEntry`n" + $content.Substring($insertPoint)
}

Set-Content $msgFile $newContent -NoNewline
Write-Output "loid: added message #$newId [$moodLower]"

# Build & Deploy
$prev = Get-Location
Set-Location $timidDir

Write-Output "loid: building..."
$buildOut = & npx vite build 2>&1
if ($LASTEXITCODE -eq 0) {
  Write-Output "loid: deploying..."
  & npx gh-pages -d dist -m "loid: add message #$newId" 2>&1 | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Write-Output "loid: deployed to GitHub Pages"
  } else {
    Write-Output "loid: deploy failed (exit $LASTEXITCODE)"
  }
} else {
  Write-Output "loid: build failed (exit $LASTEXITCODE)"
}

Set-Location $prev
