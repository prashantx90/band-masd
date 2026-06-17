#!/usr/bin/env python3
import os
import re
import sys
import subprocess
from datetime import datetime

def run_git_command(args):
    try:
        result = subprocess.run(
            ["git"] + args,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
        return result.stdout.strip().splitlines()
    except subprocess.CalledProcessError as e:
        print(f"Git command failed: {' '.join(args)}", file=sys.stderr)
        print(e.stderr, file=sys.stderr)
        return []

def main():
    # 1. Get list of staged files
    staged_files = run_git_command(["diff", "--cached", "--name-only"])
    if not staged_files:
        # Nothing staged, nothing to do
        return

    # Normalize paths to use forward slashes
    staged_files = [f.replace("\\", "/") for f in staged_files]

    # Check if a task file is already staged
    task_file_pattern = re.compile(r"^docs/tasks/TASK-(\d{3,})\.md$", re.IGNORECASE)
    staged_tasks = [f for f in staged_files if task_file_pattern.match(f)]
    
    # Exclude task files and the template from the changed files list
    changed_files = [
        f for f in staged_files 
        if not task_file_pattern.match(f) and f != "docs/tasks/tasks-template.md"
    ]

    # If there are no other changed files, we don't need to create/update anything
    if not changed_files:
        return

    tasks_dir = "docs/tasks"
    template_path = os.path.join(tasks_dir, "tasks-template.md")
    
    if not os.path.exists(template_path):
        print(f"Error: Template not found at {template_path}", file=sys.stderr)
        return

    today = datetime.now().strftime("%Y-%m-%d")

    # Helper to generate the markdown list of changed files
    def make_files_list(files):
        if not files:
            return "- None"
        return "\n".join(f"- [{f}](../../{f})" for f in files)

    # Helper to update content of a task markdown file
    def update_task_content(content, task_id, files):
        # Update metadata table rows
        content = re.sub(
            r"(\|\s*Task ID\s*\|)[^|]*(\|)",
            f"\\1 {task_id} \\2",
            content,
            flags=re.IGNORECASE
        )
        content = re.sub(
            r"(\|\s*Last Updated\s*\|)[^|]*(\|)",
            f"\\1 {today} \\2",
            content,
            flags=re.IGNORECASE
        )
        
        # Replace FILES_CHANGED block
        files_list_md = make_files_list(files)
        pattern = r"<!-- FILES_CHANGED_START -->.*?<!-- FILES_CHANGED_END -->"
        replacement = f"<!-- FILES_CHANGED_START -->\n{files_list_md}\n<!-- FILES_CHANGED_END -->"
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        
        # Replace template placeholders for task ID in titles
        content = content.replace("TASK-XXX", task_id)
        
        return content

    if staged_tasks:
        # Case A: A task file is already staged. We update its changed files and last updated date.
        for task_file in staged_tasks:
            full_path = os.path.join(".", task_file)
            if not os.path.exists(full_path):
                continue
            
            match = task_file_pattern.match(task_file)
            task_id = f"TASK-{match.group(1)}"
            
            with open(full_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            updated_content = update_task_content(content, task_id, changed_files)
            
            with open(full_path, "w", encoding="utf-8") as f:
                f.write(updated_content)
            
            # Re-stage the updated task file
            run_git_command(["add", task_file])
            print(f"[Engineering Memory] Updated staged journal entry: {task_file}")
    else:
        # Case B: No task file is staged. Create the next one.
        # Find next sequential task ID
        os.makedirs(tasks_dir, exist_ok=True)
        existing_files = os.listdir(tasks_dir)
        task_numbers = []
        for f in existing_files:
            m = task_file_pattern.match(os.path.join(tasks_dir, f).replace("\\", "/"))
            if m:
                task_numbers.append(int(m.group(1)))
        
        next_num = max(task_numbers) + 1 if task_numbers else 1
        next_task_id = f"TASK-{next_num:03d}"
        next_task_filename = f"{next_task_id}.md"
        next_task_path = os.path.join(tasks_dir, next_task_filename)
        
        # Read template
        with open(template_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Initialize dates and metadata
        content = re.sub(
            r"(\|\s*Date Started\s*\|)[^|]*(\|)",
            f"\\1 {today} \\2",
            content,
            flags=re.IGNORECASE
        )
        updated_content = update_task_content(content, next_task_id, changed_files)
        
        # Write new file
        with open(next_task_path, "w", encoding="utf-8") as f:
            f.write(updated_content)
        
        # Stage the new file
        run_git_command(["add", next_task_path])
        print(f"[Engineering Memory] Created and staged new journal entry: {next_task_path}")

if __name__ == "__main__":
    main()
