(function () {
    window.CLI_KB = window.CLI_KB || {};

    /* ── CORE UTILITIES ──────────────────────────────────────────────── */

    window.CLI_KB['ls'] = {
        desc: 'List directory contents',
        flags: {
            '-l': { desc: 'Long listing with permissions and sizes', val: false },
            '-a': { desc: 'Include hidden (dot) files', val: false },
            '-h': { desc: 'Human-readable file sizes (KB, MB)', val: false },
            '-r': { desc: 'Reverse sort order', val: false },
            '-t': { desc: 'Sort by modification time', val: false },
            '-R': { desc: 'List subdirectories recursively', val: false },
            '-S': { desc: 'Sort by file size, largest first', val: false },
            '-d': { desc: 'List directory entry itself, not contents', val: false },
            '-1': { desc: 'One filename per line', val: false },
            '-lah': { desc: 'Long format, all files, human-readable', val: false },
            '-la': { desc: 'Long format including hidden files', val: false },
            '--color': { desc: 'Colorize output by file type', val: false },
        },
    };

    window.CLI_KB['grep'] = {
        desc: 'Search for text patterns in files',
        flags: {
            '-r': { desc: 'Search recursively through directories', val: false },
            '-n': { desc: 'Show line numbers with output', val: false },
            '-i': { desc: 'Case-insensitive matching', val: false },
            '-v': { desc: 'Invert match — show non-matching lines', val: false },
            '-l': { desc: 'Print only filenames with matches', val: false },
            '-c': { desc: 'Count matching lines per file', val: false },
            '-E': { desc: 'Use extended regular expressions', val: false },
            '-P': { desc: 'Perl-compatible regular expressions', val: false },
            '-A': { desc: 'Print N lines after each match', val: true },
            '-B': { desc: 'Print N lines before each match', val: true },
            '-C': { desc: 'Print N lines around each match', val: true },
            '-w': { desc: 'Match whole words only', val: false },
            '-o': { desc: 'Print only the matched part of line', val: false },
            '-q': { desc: 'Quiet mode — exit code only', val: false },
            '-F': { desc: 'Fixed string match (not regex)', val: false },
            '-m': { desc: 'Stop after N matches', val: true },
            '-H': { desc: 'Print filename with each match', val: false },
            '--include': { desc: 'Search only files matching glob', val: true },
            '--exclude': { desc: 'Skip files matching glob pattern', val: true },
            '-rn': { desc: 'Recursive search with line numbers', val: false },
        },
    };

    window.CLI_KB['find'] = {
        desc: 'Search for files and directories recursively',
        flags: {
            '-name': { desc: 'Match by filename pattern', val: true },
            '-type': { desc: 'Filter by type: f=file, d=dir, l=link', val: true },
            '-size': { desc: 'Match by file size (+10M, -1k)', val: true },
            '-mtime': { desc: 'Modified N days ago', val: true },
            '-newer': { desc: 'Newer than a reference file', val: true },
            '-exec': { desc: 'Execute command on each result', val: true },
            '-delete': { desc: 'Delete each matched file', val: false },
            '-maxdepth': { desc: 'Maximum directory depth to search', val: true },
            '-mindepth': { desc: 'Minimum depth to start matching', val: true },
            '-user': { desc: 'Files owned by specified user', val: true },
            '-perm': { desc: 'Files with specific permissions', val: true },
            '-not': { desc: 'Negate the following expression', val: false },
            '-o': { desc: 'OR boolean operator', val: false },
            '-print0': { desc: 'Null-delimited output (for xargs -0)', val: false },
        },
    };

    window.CLI_KB['tar'] = {
        desc: 'Archive and compress files',
        flags: {
            '-c': { desc: 'Create a new archive', val: false },
            '-x': { desc: 'Extract from an archive', val: false },
            '-z': { desc: 'Compress/decompress with gzip (.tar.gz)', val: false },
            '-j': { desc: 'Compress/decompress with bzip2 (.tar.bz2)', val: false },
            '-J': { desc: 'Compress/decompress with xz (.tar.xz)', val: false },
            '-v': { desc: 'Verbose — list files being processed', val: false },
            '-f': { desc: 'Specify archive filename', val: true },
            '-t': { desc: 'List archive contents without extracting', val: false },
            '-C': { desc: 'Change to directory before extracting', val: true },
            '--exclude': { desc: 'Exclude files matching pattern', val: true },
            '-p': { desc: 'Preserve file permissions', val: false },
            '-czvf': { desc: 'Create gzip-compressed archive, verbose', val: false },
            '-xzvf': { desc: 'Extract gzip-compressed archive, verbose', val: false },
        },
    };

    window.CLI_KB['chmod'] = {
        desc: 'Change file or directory permissions',
        flags: {
            '-R': { desc: 'Apply permissions recursively', val: false },
            '-v': { desc: 'Verbose — show each change', val: false },
            '+x': { desc: 'Add execute permission', val: false },
            '+r': { desc: 'Add read permission', val: false },
            '+w': { desc: 'Add write permission', val: false },
            'u+x': { desc: 'Add execute for owner', val: false },
            'g+x': { desc: 'Add execute for group', val: false },
            'o-r': { desc: 'Remove read from others', val: false },
            'a+x': { desc: 'Add execute for all users', val: false },
        },
    };

    window.CLI_KB['chown'] = {
        desc: 'Change file owner and group',
        flags: {
            '-R': { desc: 'Apply ownership recursively', val: false },
            '-v': { desc: 'Verbose — show each change', val: false },
            '--reference': { desc: 'Copy ownership from reference file', val: true },
        },
    };

    /* ── FILE OPERATIONS ─────────────────────────────────────────────── */

    window.CLI_KB['cp'] = {
        desc: 'Copy files and directories',
        flags: {
            '-r': { desc: 'Copy directories recursively', val: false },
            '-v': { desc: 'Verbose — show files being copied', val: false },
            '-i': { desc: 'Prompt before overwriting', val: false },
            '-n': { desc: 'Do not overwrite existing files', val: false },
            '-p': { desc: 'Preserve timestamps and permissions', val: false },
            '-a': { desc: 'Archive mode (preserve all attributes)', val: false },
        },
    };

    window.CLI_KB['mv'] = {
        desc: 'Move or rename files and directories',
        flags: {
            '-v': { desc: 'Verbose — show each file moved', val: false },
            '-i': { desc: 'Prompt before overwriting', val: false },
            '-n': { desc: 'Do not overwrite existing files', val: false },
            '-f': { desc: 'Force overwrite without prompting', val: false },
            '-b': { desc: 'Make backup of existing files', val: false },
        },
    };

    window.CLI_KB['rm'] = {
        desc: 'Remove files or directories',
        flags: {
            '-r': { desc: 'Remove directories and contents recursively', val: false },
            '-f': { desc: 'Force — no prompts, ignore missing files', val: false },
            '-i': { desc: 'Prompt before every removal', val: false },
            '-v': { desc: 'Verbose — show each file removed', val: false },
            '-rf': { desc: 'Force recursive delete (use with caution)', val: false },
        },
    };

    window.CLI_KB['mkdir'] = {
        desc: 'Create new directories',
        flags: {
            '-p': { desc: 'Create parent directories as needed', val: false },
            '-v': { desc: 'Verbose — show each directory created', val: false },
            '-m': { desc: 'Set permission mode on creation', val: true },
        },
    };

    window.CLI_KB['touch'] = {
        desc: 'Create a file or update its timestamp',
        flags: {
            '-a': { desc: 'Change only access time', val: false },
            '-m': { desc: 'Change only modification time', val: false },
            '-t': { desc: 'Set a specific timestamp', val: true },
        },
    };

    window.CLI_KB['ln'] = {
        desc: 'Create hard or symbolic links',
        flags: {
            '-s': { desc: 'Create a symbolic (soft) link', val: false },
            '-f': { desc: 'Remove existing destination file', val: false },
            '-v': { desc: 'Verbose output', val: false },
        },
    };

    /* ── TEXT PROCESSING ─────────────────────────────────────────────── */

    window.CLI_KB['cat'] = {
        desc: 'Concatenate and display file contents',
        flags: {
            '-n': { desc: 'Number all output lines', val: false },
            '-b': { desc: 'Number non-empty lines only', val: false },
            '-A': { desc: 'Show hidden/control characters', val: false },
            '-s': { desc: 'Squeeze repeated blank lines', val: false },
        },
    };

    window.CLI_KB['head'] = {
        desc: 'Display the first lines of a file',
        flags: {
            '-n': { desc: 'Number of lines to show (default 10)', val: true },
            '-c': { desc: 'Number of bytes to show', val: true },
        },
    };

    window.CLI_KB['tail'] = {
        desc: 'Display the last lines of a file',
        flags: {
            '-n': { desc: 'Number of lines to show (default 10)', val: true },
            '-f': { desc: 'Follow file for new output in real time', val: false },
            '-F': { desc: 'Follow by name (handles log rotation)', val: false },
            '-c': { desc: 'Number of bytes to show', val: true },
            '--retry': { desc: 'Retry if file is not accessible', val: false },
        },
    };

    window.CLI_KB['sed'] = {
        desc: 'Stream editor for text transformations',
        flags: {
            '-i': { desc: 'Edit file in place', val: false },
            '-n': { desc: 'Suppress automatic printing', val: false },
            '-e': { desc: 'Add a script/expression to run', val: true },
            '-E': { desc: 'Use extended regular expressions', val: false },
            '-r': { desc: 'Extended regex (GNU alias for -E)', val: false },
        },
    };

    window.CLI_KB['awk'] = {
        desc: 'Pattern scanning and text processing language',
        flags: {
            '-F': { desc: 'Set field separator character', val: true },
            '-v': { desc: 'Assign a variable value', val: true },
            '-f': { desc: 'Read AWK program from file', val: true },
        },
    };

    window.CLI_KB['sort'] = {
        desc: 'Sort lines of text alphabetically or numerically',
        flags: {
            '-n': { desc: 'Numeric sort', val: false },
            '-r': { desc: 'Reverse sort order', val: false },
            '-k': { desc: 'Sort by specific key/column', val: true },
            '-t': { desc: 'Set field delimiter character', val: true },
            '-u': { desc: 'Output unique lines only', val: false },
            '-h': { desc: 'Human-numeric sort (2K < 1M)', val: false },
            '-f': { desc: 'Case-insensitive sorting', val: false },
            '-rh': { desc: 'Reverse human-numeric sort', val: false },
        },
    };

    window.CLI_KB['uniq'] = {
        desc: 'Filter out repeated adjacent lines',
        flags: {
            '-c': { desc: 'Prefix lines with occurrence count', val: false },
            '-d': { desc: 'Show only duplicate lines', val: false },
            '-u': { desc: 'Show only unique lines', val: false },
            '-i': { desc: 'Case-insensitive comparison', val: false },
        },
    };

    window.CLI_KB['wc'] = {
        desc: 'Count lines, words, and bytes in files',
        flags: {
            '-l': { desc: 'Count lines only', val: false },
            '-w': { desc: 'Count words only', val: false },
            '-c': { desc: 'Count bytes only', val: false },
            '-m': { desc: 'Count characters only', val: false },
        },
    };

    window.CLI_KB['cut'] = {
        desc: 'Extract columns or fields from each line',
        flags: {
            '-d': { desc: 'Set field delimiter', val: true },
            '-f': { desc: 'Select specific fields', val: true },
            '-c': { desc: 'Select character positions', val: true },
            '-b': { desc: 'Select byte positions', val: true },
        },
    };

    window.CLI_KB['tr'] = {
        desc: 'Translate or delete characters',
        flags: {
            '-d': { desc: 'Delete specified characters', val: false },
            '-s': { desc: 'Squeeze repeated characters to one', val: false },
            '-c': { desc: 'Complement the character set', val: false },
        },
    };

    window.CLI_KB['diff'] = {
        desc: 'Compare files line by line',
        flags: {
            '-u': { desc: 'Unified diff format', val: false },
            '-r': { desc: 'Recursively compare directories', val: false },
            '-i': { desc: 'Ignore case differences', val: false },
            '-w': { desc: 'Ignore all whitespace differences', val: false },
            '-q': { desc: 'Report only whether files differ', val: false },
            '--color': { desc: 'Colorize the diff output', val: false },
        },
    };

    window.CLI_KB['echo'] = {
        desc: 'Print text to standard output',
        flags: {
            '-n': { desc: 'Omit trailing newline', val: false },
            '-e': { desc: 'Enable backslash escape sequences', val: false },
            '-E': { desc: 'Disable escape interpretation (default)', val: false },
        },
    };

    window.CLI_KB['xargs'] = {
        desc: 'Build and execute commands from standard input',
        flags: {
            '-I': { desc: 'Replace string placeholder in command', val: true },
            '-n': { desc: 'Max arguments per command execution', val: true },
            '-P': { desc: 'Run N processes in parallel', val: true },
            '-0': { desc: 'Null-delimited input (use with find -print0)', val: false },
            '-d': { desc: 'Custom input delimiter', val: true },
            '-t': { desc: 'Print each command before executing', val: false },
            '-r': { desc: 'Do not run if stdin is empty', val: false },
        },
    };

    window.CLI_KB['tee'] = {
        desc: 'Read stdin, write to stdout and files simultaneously',
        flags: {
            '-a': { desc: 'Append to files instead of overwriting', val: false },
            '-i': { desc: 'Ignore interrupt signals', val: false },
        },
    };

    /* ── NETWORK ─────────────────────────────────────────────────────── */

    window.CLI_KB['curl'] = {
        desc: 'Transfer data using URL protocols (HTTP, FTP)',
        flags: {
            '-X': { desc: 'HTTP method (GET, POST, PUT, DELETE)', val: true },
            '-H': { desc: 'Add a custom request header', val: true },
            '-d': { desc: 'Send data in the request body', val: true },
            '-o': { desc: 'Write output to a file', val: true },
            '-O': { desc: 'Save file with its remote name', val: false },
            '-L': { desc: 'Follow HTTP redirects', val: false },
            '-s': { desc: 'Silent mode — no progress bar', val: false },
            '-v': { desc: 'Verbose — show request/response headers', val: false },
            '-u': { desc: 'Username:password for authentication', val: true },
            '-k': { desc: 'Allow insecure SSL connections', val: false },
            '-F': { desc: 'Upload file via multipart form', val: true },
            '-I': { desc: 'Fetch HTTP headers only (HEAD request)', val: false },
            '-b': { desc: 'Send cookies with the request', val: true },
            '-A': { desc: 'Set the User-Agent header string', val: true },
            '--max-time': { desc: 'Request timeout in seconds', val: true },
            '--retry': { desc: 'Retry on failure N times', val: true },
            '--compressed': { desc: 'Request compressed response', val: false },
        },
    };

    window.CLI_KB['wget'] = {
        desc: 'Download files from the web',
        flags: {
            '-O': { desc: 'Save to specified filename', val: true },
            '-q': { desc: 'Quiet — no output', val: false },
            '-r': { desc: 'Download recursively', val: false },
            '-P': { desc: 'Save to directory prefix', val: true },
            '--no-check-certificate': { desc: 'Skip SSL certificate verification', val: false },
            '-c': { desc: 'Continue a partial download', val: false },
            '--limit-rate': { desc: 'Limit download speed', val: true },
            '-i': { desc: 'Read URLs from a file', val: true },
        },
    };

    window.CLI_KB['ssh'] = {
        desc: 'Open a secure remote shell connection',
        flags: {
            '-i': { desc: 'Path to SSH private key file', val: true },
            '-p': { desc: 'Remote SSH port number', val: true },
            '-L': { desc: 'Local port forwarding (local:host:remote)', val: true },
            '-R': { desc: 'Remote port forwarding', val: true },
            '-D': { desc: 'Dynamic SOCKS proxy port', val: true },
            '-N': { desc: 'No remote command — tunnels only', val: false },
            '-v': { desc: 'Verbose debug output', val: false },
            '-X': { desc: 'Enable X11 display forwarding', val: false },
            '-A': { desc: 'Forward SSH agent credentials', val: false },
            '-o': { desc: 'Set an SSH configuration option', val: true },
            '-J': { desc: 'Jump through a proxy host', val: true },
            '-t': { desc: 'Force pseudo-terminal allocation', val: false },
        },
    };

    window.CLI_KB['scp'] = {
        desc: 'Copy files securely between hosts via SSH',
        flags: {
            '-r': { desc: 'Copy directories recursively', val: false },
            '-i': { desc: 'SSH private key file', val: true },
            '-P': { desc: 'SSH port on remote host', val: true },
            '-v': { desc: 'Verbose debug output', val: false },
            '-C': { desc: 'Enable compression during transfer', val: false },
        },
    };

    window.CLI_KB['rsync'] = {
        desc: 'Synchronize files between locations efficiently',
        flags: {
            '-a': { desc: 'Archive mode — preserve all attributes', val: false },
            '-v': { desc: 'Verbose output', val: false },
            '-z': { desc: 'Compress data during transfer', val: false },
            '-r': { desc: 'Recursive directory sync', val: false },
            '-n': { desc: 'Dry run — show what would change', val: false },
            '--delete': { desc: 'Delete files not in source', val: false },
            '--exclude': { desc: 'Exclude files matching pattern', val: true },
            '--include': { desc: 'Force include matching pattern', val: true },
            '-e': { desc: 'Specify remote shell (e.g. ssh)', val: true },
            '-h': { desc: 'Human-readable file sizes', val: false },
            '--progress': { desc: 'Show transfer progress per file', val: false },
            '-u': { desc: 'Skip files newer on destination', val: false },
        },
    };

    window.CLI_KB['ping'] = {
        desc: 'Test network connectivity to a host',
        flags: {
            '-c': { desc: 'Number of packets to send', val: true },
            '-i': { desc: 'Interval between packets', val: true },
            '-t': { desc: 'TTL value for packets', val: true },
            '-s': { desc: 'Packet payload size in bytes', val: true },
            '-W': { desc: 'Timeout per packet in seconds', val: true },
            '-q': { desc: 'Quiet — show only summary', val: false },
        },
    };

    window.CLI_KB['netstat'] = {
        desc: 'Display network connections and statistics',
        flags: {
            '-t': { desc: 'Show TCP connections', val: false },
            '-u': { desc: 'Show UDP connections', val: false },
            '-l': { desc: 'Show listening sockets only', val: false },
            '-n': { desc: 'Show numeric addresses and ports', val: false },
            '-p': { desc: 'Show process ID and name', val: false },
            '-a': { desc: 'Show all connections', val: false },
            '-r': { desc: 'Display routing table', val: false },
            '-s': { desc: 'Show statistics by protocol', val: false },
            '-tulnp': { desc: 'TCP/UDP listening sockets with PIDs', val: false },
        },
    };

    window.CLI_KB['ss'] = {
        desc: 'Show socket statistics (modern netstat)',
        flags: {
            '-t': { desc: 'TCP sockets', val: false },
            '-u': { desc: 'UDP sockets', val: false },
            '-l': { desc: 'Listening sockets only', val: false },
            '-n': { desc: 'Numeric addresses', val: false },
            '-p': { desc: 'Show owning process', val: false },
            '-a': { desc: 'All socket states', val: false },
        },
    };

    window.CLI_KB['nmap'] = {
        desc: 'Network port scanner and host discovery tool',
        flags: {
            '-sV': { desc: 'Detect service versions on open ports', val: false },
            '-sC': { desc: 'Run default NSE scripts', val: false },
            '-O': { desc: 'Detect the operating system', val: false },
            '-p': { desc: 'Port range to scan', val: true },
            '-A': { desc: 'Aggressive scan (OS + versions + scripts)', val: false },
            '-T4': { desc: 'Fast timing template', val: false },
            '-Pn': { desc: 'Skip host discovery (assume host is up)', val: false },
            '-sn': { desc: 'Ping scan only, no port scan', val: false },
            '-oN': { desc: 'Output to normal text file', val: true },
            '-oX': { desc: 'Output to XML file', val: true },
            '--open': { desc: 'Show only open ports', val: false },
            '--script': { desc: 'Run specific NSE script', val: true },
        },
    };

    /* ── SYSTEM / PROCESS ────────────────────────────────────────────── */

    window.CLI_KB['ps'] = {
        desc: 'Show currently running processes',
        sub: { 'aux': 'All processes for all users (BSD style)' },
        flags: {
            '-e': { desc: 'Show every process', val: false },
            '-f': { desc: 'Full format listing', val: false },
            '-u': { desc: 'Filter by user name', val: true },
            '-p': { desc: 'Select by process ID', val: true },
            '-o': { desc: 'Custom output format columns', val: true },
            '--sort': { desc: 'Sort by column (e.g. -%cpu)', val: true },
            'aux': { desc: 'All processes, all users (BSD format)', val: false },
        },
    };

    window.CLI_KB['kill'] = {
        desc: 'Send a signal to a process by PID',
        flags: {
            '-9': { desc: 'SIGKILL — force terminate immediately', val: false },
            '-15': { desc: 'SIGTERM — graceful termination', val: false },
            '-1': { desc: 'SIGHUP — reload configuration', val: false },
            '-l': { desc: 'List all available signal names', val: false },
        },
    };

    window.CLI_KB['sudo'] = {
        desc: 'Execute a command as superuser or another user',
        flags: {
            '-u': { desc: 'Run as specified user', val: true },
            '-i': { desc: 'Start a login shell', val: false },
            '-s': { desc: 'Run a shell as root', val: false },
            '-l': { desc: 'List allowed sudo commands', val: false },
            '-k': { desc: 'Invalidate cached credentials', val: false },
            '-E': { desc: 'Preserve current environment variables', val: false },
        },
    };

    window.CLI_KB['su'] = {
        desc: 'Switch to another user account',
        flags: {
            '-': { desc: 'Start a full login shell', val: false },
            '-c': { desc: 'Execute a single command as the user', val: true },
            '-s': { desc: 'Specify shell to use', val: true },
        },
    };

    window.CLI_KB['df'] = {
        desc: 'Report filesystem disk space usage',
        flags: {
            '-h': { desc: 'Human-readable sizes (KB, MB, GB)', val: false },
            '-T': { desc: 'Show filesystem type', val: false },
            '-i': { desc: 'Show inode usage instead of blocks', val: false },
            '--total': { desc: 'Print a grand total row', val: false },
        },
    };

    window.CLI_KB['du'] = {
        desc: 'Estimate disk usage of files and directories',
        flags: {
            '-h': { desc: 'Human-readable sizes', val: false },
            '-s': { desc: 'Summary — total for each argument', val: false },
            '-a': { desc: 'Show size of individual files too', val: false },
            '-d': { desc: 'Limit output depth', val: true },
            '-c': { desc: 'Print grand total at end', val: false },
            '--exclude': { desc: 'Exclude files matching pattern', val: true },
            '--max-depth': { desc: 'Max directory depth to report', val: true },
            '-sh': { desc: 'Summary with human-readable sizes', val: false },
        },
    };

    window.CLI_KB['htop'] = {
        desc: 'Interactive process viewer (enhanced top)',
        flags: {
            '-d': { desc: 'Refresh interval (tenths of a second)', val: true },
            '-u': { desc: 'Show only processes for user', val: true },
            '-p': { desc: 'Monitor specific PIDs', val: true },
            '-s': { desc: 'Sort by column', val: true },
        },
    };

    window.CLI_KB['watch'] = {
        desc: 'Run a command repeatedly and show output',
        flags: {
            '-n': { desc: 'Refresh interval in seconds (default 2)', val: true },
            '-d': { desc: 'Highlight differences between runs', val: false },
            '-e': { desc: 'Exit on non-zero return code', val: false },
            '-t': { desc: 'Hide the header line', val: false },
            '-c': { desc: 'Interpret ANSI color sequences', val: false },
            '-x': { desc: 'Pass command to exec instead of shell', val: false },
        },
    };

    window.CLI_KB['lsof'] = {
        desc: 'List open files and the processes using them',
        flags: {
            '-i': { desc: 'Show network connections (or :port)', val: false },
            '-p': { desc: 'Filter by process ID', val: true },
            '-u': { desc: 'Filter by user', val: true },
            '-n': { desc: 'Show numeric addresses', val: false },
            '-P': { desc: 'Show numeric port numbers', val: false },
            '+D': { desc: 'All open files under a directory', val: true },
            '-c': { desc: 'Filter by command name pattern', val: true },
        },
    };

    /* ── SERVICE MANAGEMENT ──────────────────────────────────────────── */

    window.CLI_KB['systemctl'] = {
        desc: 'Manage systemd services and units',
        sub: {
            'start': 'Start a stopped service',
            'stop': 'Stop a running service',
            'restart': 'Stop then start a service',
            'reload': 'Reload config without full restart',
            'status': 'Show current service status',
            'enable': 'Enable service to start at boot',
            'disable': 'Disable automatic start at boot',
            'is-active': 'Check if a service is running',
            'is-enabled': 'Check if service starts at boot',
            'list-units': 'List all loaded units',
            'daemon-reload': 'Reload all systemd unit files',
            'mask': 'Prevent a service from starting',
            'unmask': 'Remove mask from a service',
        },
        flags: {
            '--now': { desc: 'Also start/stop when enabling/disabling', val: false },
            '--user': { desc: 'User-level service manager', val: false },
            '-l': { desc: 'Do not truncate output', val: false },
            '--no-pager': { desc: 'Do not pipe to a pager', val: false },
            '--all': { desc: 'Include inactive units', val: false },
        },
    };

    window.CLI_KB['journalctl'] = {
        desc: 'Query and view systemd journal logs',
        flags: {
            '-u': { desc: 'Show logs for a specific service unit', val: true },
            '-f': { desc: 'Follow log output in real time', val: false },
            '-n': { desc: 'Show last N log entries', val: true },
            '-e': { desc: 'Jump to the end of the log', val: false },
            '--since': { desc: 'Show entries since date/time', val: true },
            '--until': { desc: 'Show entries until date/time', val: true },
            '-p': { desc: 'Filter by priority (err, warning, info)', val: true },
            '-r': { desc: 'Reverse chronological order', val: false },
            '-o': { desc: 'Output format (json, short, cat)', val: true },
            '-b': { desc: 'Entries from current boot only', val: false },
            '-k': { desc: 'Kernel messages only (dmesg)', val: false },
            '--no-pager': { desc: 'Do not pipe to a pager', val: false },
        },
    };

    window.CLI_KB['crontab'] = {
        desc: 'Manage scheduled cron jobs',
        flags: {
            '-e': { desc: 'Edit current user crontab', val: false },
            '-l': { desc: 'List crontab entries', val: false },
            '-r': { desc: 'Remove the crontab entirely', val: false },
            '-u': { desc: 'Operate on another user crontab', val: true },
        },
    };

    /* ── PACKAGE MANAGERS ────────────────────────────────────────────── */

    window.CLI_KB['apt'] = {
        desc: 'Debian/Ubuntu package manager',
        sub: {
            'install': 'Install one or more packages',
            'remove': 'Remove packages (keep config)',
            'purge': 'Remove packages and all config files',
            'update': 'Refresh package index from sources',
            'upgrade': 'Upgrade all installed packages',
            'dist-upgrade': 'Full upgrade with dependency resolution',
            'autoremove': 'Remove orphaned/unused packages',
            'search': 'Search available packages by name',
            'show': 'Show detailed package information',
            'list': 'List packages by criteria',
            'fix-broken': 'Attempt to fix broken dependencies',
        },
        flags: {
            '-y': { desc: 'Automatic yes to confirmation prompts', val: false },
            '--no-install-recommends': { desc: 'Skip recommended packages', val: false },
            '-q': { desc: 'Quiet — minimal output', val: false },
            '--dry-run': { desc: 'Simulate without making changes', val: false },
        },
    };

    window.CLI_KB['yum'] = {
        desc: 'RPM package manager (RHEL/CentOS)',
        sub: {
            'install': 'Install packages',
            'remove': 'Remove packages',
            'update': 'Update installed packages',
            'search': 'Search for packages',
            'info': 'Show package details',
            'list': 'List available packages',
        },
        flags: {
            '-y': { desc: 'Automatic yes', val: false },
            '-q': { desc: 'Quiet output', val: false },
        },
    };

    window.CLI_KB['dnf'] = {
        desc: 'Modern RPM package manager (Fedora/RHEL 8+)',
        sub: {
            'install': 'Install packages',
            'remove': 'Remove packages',
            'update': 'Update packages',
            'search': 'Search packages',
            'upgrade': 'Upgrade packages',
        },
        flags: {
            '-y': { desc: 'Automatic yes', val: false },
            '-q': { desc: 'Quiet output', val: false },
        },
    };

    /* ── ARCHIVE / COMPRESSION ──────────────────────────────────────── */

    window.CLI_KB['zip'] = {
        desc: 'Create ZIP archives',
        flags: {
            '-r': { desc: 'Recurse into directories', val: false },
            '-v': { desc: 'Verbose output', val: false },
            '-q': { desc: 'Quiet mode', val: false },
            '-9': { desc: 'Maximum compression', val: false },
            '-e': { desc: 'Encrypt with password', val: false },
            '-x': { desc: 'Exclude files matching pattern', val: true },
        },
    };

    window.CLI_KB['unzip'] = {
        desc: 'Extract ZIP archives',
        flags: {
            '-d': { desc: 'Extract into specified directory', val: true },
            '-l': { desc: 'List contents without extracting', val: false },
            '-o': { desc: 'Overwrite files without prompting', val: false },
            '-q': { desc: 'Quiet extraction', val: false },
        },
    };

    window.CLI_KB['gzip'] = {
        desc: 'Compress or decompress files with gzip',
        flags: {
            '-d': { desc: 'Decompress instead of compress', val: false },
            '-k': { desc: 'Keep the original file', val: false },
            '-v': { desc: 'Verbose — show compression ratio', val: false },
            '-9': { desc: 'Best (slowest) compression', val: false },
            '-1': { desc: 'Fastest (least) compression', val: false },
            '-l': { desc: 'List compression info', val: false },
        },
    };

    /* ── OTHER TOOLS ─────────────────────────────────────────────────── */

    window.CLI_KB['man'] = {
        desc: 'Display manual page for a command',
        flags: {
            '-k': { desc: 'Search manual page descriptions', val: false },
        },
    };

    window.CLI_KB['which'] = { desc: 'Show the full path of a command executable', flags: {} };
    window.CLI_KB['env'] = { desc: 'Display or modify environment variables', flags: {} };
    window.CLI_KB['export'] = { desc: 'Set environment variable for child processes', flags: {} };
    window.CLI_KB['history'] = { desc: 'Show shell command history', flags: { '-c': { desc: 'Clear history', val: false } } };

    window.CLI_KB['less'] = {
        desc: 'View file contents one page at a time',
        flags: {
            '-N': { desc: 'Show line numbers', val: false },
            '-S': { desc: 'Chop long lines (no wrapping)', val: false },
            '-i': { desc: 'Case-insensitive search', val: false },
        },
    };

    window.CLI_KB['jq'] = {
        desc: 'Command-line JSON processor and query tool',
        flags: {
            '-r': { desc: 'Raw output without quotes', val: false },
            '-c': { desc: 'Compact output (single line)', val: false },
            '-s': { desc: 'Read all input as one array', val: false },
            '-e': { desc: 'Non-zero exit on false/null', val: false },
            '--arg': { desc: 'Set a string variable for the filter', val: true },
            '--argjson': { desc: 'Set a JSON variable', val: true },
        },
    };

    window.CLI_KB['make'] = {
        desc: 'Build automation tool using Makefiles',
        flags: {
            '-f': { desc: 'Use specified Makefile', val: true },
            '-j': { desc: 'Number of parallel build jobs', val: true },
            '-n': { desc: 'Dry run — print without executing', val: false },
            '-B': { desc: 'Unconditionally rebuild all targets', val: false },
            '-C': { desc: 'Change to directory before building', val: true },
            '-s': { desc: 'Silent — suppress command echoing', val: false },
        },
    };

    window.CLI_KB['openssl'] = {
        desc: 'Cryptography and SSL/TLS toolkit',
        sub: {
            'genrsa': 'Generate an RSA private key',
            'req': 'Create CSR or self-signed certificate',
            'x509': 'Display or sign X.509 certificates',
            'pkcs12': 'Create or parse PKCS#12 bundles',
            's_client': 'Test TLS/SSL connections',
            'enc': 'Encrypt or decrypt data',
            'rand': 'Generate cryptographic random bytes',
            'verify': 'Verify certificate chain',
        },
        flags: {
            '-in': { desc: 'Input file path', val: true },
            '-out': { desc: 'Output file path', val: true },
            '-key': { desc: 'Private key file', val: true },
            '-new': { desc: 'Generate a new CSR', val: false },
            '-x509': { desc: 'Output self-signed certificate', val: false },
            '-days': { desc: 'Certificate validity in days', val: true },
            '-nodes': { desc: 'No DES encryption on the key', val: false },
            '-subj': { desc: 'Certificate subject distinguished name', val: true },
            '-sha256': { desc: 'Use SHA-256 message digest', val: false },
            '-connect': { desc: 'Host:port for TLS connection test', val: true },
            '-newkey': { desc: 'Generate new key (rsa:2048)', val: true },
        },
    };

    window.CLI_KB['base64'] = {
        desc: 'Encode or decode base64 data',
        flags: {
            '-d': { desc: 'Decode base64 input', val: false },
            '-w': { desc: 'Wrap lines at N characters (0=none)', val: true },
        },
    };

    window.CLI_KB['tmux'] = {
        desc: 'Terminal multiplexer with panes and sessions',
        sub: {
            'new': 'Create a new tmux session',
            'new-session': 'Create a new named session',
            'ls': 'List active sessions',
            'attach': 'Attach to a running session',
            'kill-session': 'Terminate a session',
            'kill-server': 'Stop the tmux server entirely',
        },
        flags: {
            '-s': { desc: 'Session name', val: true },
            '-d': { desc: 'Detach other clients on attach', val: false },
            '-t': { desc: 'Target session or window', val: true },
        },
    };

    window.CLI_KB['screen'] = {
        desc: 'Terminal multiplexer for persistent sessions',
        flags: {
            '-S': { desc: 'Name the session', val: true },
            '-r': { desc: 'Reattach to a detached session', val: false },
            '-list': { desc: 'List all active sessions', val: false },
            '-d': { desc: 'Detach a running session', val: false },
        },
    };

    window.CLI_KB['ip'] = {
        desc: 'Manage network interfaces, addresses, and routing',
        sub: {
            'addr': 'Show or manage IP addresses',
            'link': 'Show or manage network interfaces',
            'route': 'Show or manage the routing table',
            'neigh': 'Show the ARP/neighbor table',
        },
        flags: {
            '-4': { desc: 'IPv4 only', val: false },
            '-6': { desc: 'IPv6 only', val: false },
            '-br': { desc: 'Brief output format', val: false },
            '-s': { desc: 'Show statistics', val: false },
            '-c': { desc: 'Colorize output', val: false },
            'add': { desc: 'Add entry', val: false },
            'del': { desc: 'Delete entry', val: false },
            'show': { desc: 'Display entries', val: false },
        },
    };

    window.CLI_KB['strace'] = {
        desc: 'Trace system calls and signals of a process',
        flags: {
            '-p': { desc: 'Attach to a running process by PID', val: true },
            '-e': { desc: 'Filter specific system calls', val: true },
            '-o': { desc: 'Write output to file', val: true },
            '-f': { desc: 'Follow forked child processes', val: false },
            '-c': { desc: 'Summarize syscall counts and times', val: false },
        },
    };

})();
