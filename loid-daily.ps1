$timidDir = Split-Path -Parent $MyInvocation.MyCommand.Path
& "$timidDir\loid-add.ps1" -Deploy $true
