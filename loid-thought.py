"""Mood classifier + thought adder for Loid's Telegram integration."""
import subprocess
import re
import sys
import os

MOOD_KEYWORDS = {
    "empty": ["empty", "numb", "void", "hollow", "nothing", "blank", "detached", "disconnected", "meaningless", "purposeless"],
    "tired": ["tired", "exhausted", "heavy", "drained", "weary", "fatigue", "sleepless", "restless", "burned", "burnout", "sleep", "weight"],
    "lonely": ["lonely", "alone", "isolated", "solitary", "silent", "no one", "nobody", "ghost", "invisible", "forgotten", "abandoned"],
    "hope": ["hope", "maybe", "light", "still", "yet", "somehow", "perhaps", "better", "forward", "hold", "stay", "keep going"],
    "reflection": ["think", "wonder", "remember", "reflect", "realize", "understand", "grow", "past", "memory", "mistake", "lesson", "question"],
}

def classify_mood(text: str) -> str:
    text_lower = text.lower()
    scores = {}
    for mood, keywords in MOOD_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in text_lower)
        if score > 0:
            scores[mood] = score
    if not scores:
        return "reflection"
    return max(scores, key=scores.get)

def add_thought(text: str, mood: str = None) -> dict:
    if not mood:
        mood = classify_mood(text)
    timid_dir = os.path.dirname(os.path.abspath(__file__))
    ps_script = os.path.join(timid_dir, "loid-add.ps1")
    cmd = [
        "powershell", "-NoProfile", "-ExecutionPolicy", "Bypass",
        "-File", ps_script,
        "-Text", text,
        "-Mood", mood,
    ]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120, cwd=timid_dir)
        return {
            "success": result.returncode == 0,
            "stdout": result.stdout.strip(),
            "stderr": result.stderr.strip(),
        }
    except subprocess.TimeoutExpired:
        return {"success": False, "stdout": "", "stderr": "Timed out"}
    except Exception as e:
        return {"success": False, "stdout": "", "stderr": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python loid-thought.py <text> [mood]")
        sys.exit(1)
    text = sys.argv[1]
    mood = sys.argv[2] if len(sys.argv) > 2 else None
    result = add_thought(text, mood)
    print(f"Mood: {mood or classify_mood(text)}")
    print(f"Result: {result['stdout']}")
    if result["stderr"]:
        print(f"Errors: {result['stderr']}")
