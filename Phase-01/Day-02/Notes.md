## Practical Tasks (60 - 90 Minutes)

### Bash Mastery & Filesystems
Execute these in your Zorin OS terminal:
1. **Find all `.log` files in `/var/log`** modified in the last 24 hours and copy them to your `notes/` folder for this day.
2. **Create a "secret" file** and set permissions so *only you* can read and write to it (`chmod 600`).
3. **Chain commands:** List all running processes, find "python", and output the result to `src/processes.txt`.

## Exercise 1:
The command: `find /var/log -type f -name "*.log" -mtime -1`

### Explanation
- `find /var/log` - Directs the terminal to search inside the `/var/log` directory and all of its subdirectories.
- `-type f` - Restricts the search specifically to files, filtering out folders or symlinks.
- `-name "*.log"` - Matches only files that end with the `.log` extension.
- `-mtime -1` - Selects files whose data was last modified less than 24 hours ago.

### Results
/var/log/auth.log
/var/log/kern.log

## Exercise 2:
The command: `nano secretf.txt`, then `chmod 600 secretf.txt`

### Explanation
- `nano` is a text editor.
- `chmod` is short for Change Mode. Core utility used to change access permissions of files and directories.
- `600` is the numerical permission mask that tells the system exactly who gets what access.
- `secretf.txt` is the created and the targeted file. This is where the security changes are applied.

### The Binary Scores
- 4 = Read (r)
- 2 = Write (w)
- 1 = Execute (x)
- 0 = No permission (-)
These numbers are added together for Linux to calculate the exact number for each tier.

## Exercise 3:
The command: `ps aux | grep -i "python" > src/processes.txt

### Explanation
To chain commands together, you use a `pipe` (|). Then to redirect the final output you use a `greater than` sign (>).
- `ps aux` - Captures a live snapshot of every single process running on the system.
- `| (Pipe)` - Intercepts the massive text output from `ps aux` and feeds it directly into the next command instead of printing it on your screen.
- `grep -i "python"` - Searches through the incoming text line-by-line to find matches.
- `>` - Filters text and saves it into a file, completely overwriting anything previously stored in that file.
- `src/processes.txt` - Final destination file.
