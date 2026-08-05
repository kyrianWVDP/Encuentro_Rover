from pathlib import Path
import subprocess
import sys

repo = Path(sys.argv[1])
base = sys.argv[2]
n = sys.argv[3]
head = subprocess.check_output(
    ["git", "rev-parse", "HEAD"], cwd=repo, text=True, encoding="utf-8"
).strip()
env = {**dict(**{k: v for k, v in __import__("os").environ.items()}), "PYTHONIOENCODING": "utf-8"}
def run(args):
    return subprocess.check_output(
        args, cwd=repo, env={**__import__("os").environ, "PYTHONIOENCODING": "utf-8"},
        encoding="utf-8", errors="replace"
    )
log = run(["git", "log", "--oneline", f"{base}..{head}"])
stat = run(["git", "diff", "--stat", f"{base}..{head}"])
diff = run(["git", "diff", "-U10", f"{base}..{head}"])
out = repo / f".superpowers/sdd/task-{n}-review-package.md"
out.write_text(
    f"# Review package Task {n}\nBASE: {base}\nHEAD: {head}\n\n## Commits\n{log}\n## Stat\n{stat}\n## Diff\n```diff\n{diff}\n```\n",
    encoding="utf-8",
)
print(out, head[:7], out.stat().st_size)
