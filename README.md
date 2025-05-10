# ENVJS

A simple low level control JS library made to ease low level development.
To install:

```bash
npm install envjs
```

All modules and documentation can be found on the [EnvJS Site](www.envjs.vercel.app) -> ## NOT MADE YET! It will come in Version 1.1.5!

## Maintained by [Ebaad](https://www.github.com/mebaadwaheed) 

# Available Modules
## For every function you have to put () at the end!
## You can access the following modules using env.use('moduleName'):

You can access the following modules using `env.use('moduleName')`:

# envjs

A lightweight Node.js environment wrapper providing simplified access to core modules and additional utilities.

## Getting Started

```javascript
import envjs from "envjs";
const app = envjs();

// Access a module
const file = app.use("file");

// Use module methods
file.writeFileSync("example.txt", "Hello from envjs!");
console.log(file.readFileSync("example.txt")); // Outputs: Hello from envjs!
```

## Key Features

- Simplified access to Node.js core modules (fs, http, os, etc.)
- Synchronous and asynchronous methods for file operations, HTTP requests, and more
- Persistent JSON-based storage with store module
- Task scheduling with scheduler module
- System monitoring with monitor module
- Mocking support for testing with mock module
- Plugin system for extending functionality with plugin module
- Auto-loading multiple modules with loader module

## Available Modules

Access modules using `app.use('moduleName')`. All methods require parentheses `()` unless specified as properties.

| Module | Description |
|--------|-------------|
| file | File system operations (synchronous and asynchronous) |
| http | HTTP server and client functionality |
| os | Operating system utilities |
| path | Path manipulation utilities |
| process | Node.js process information |
| child_process | Spawning child processes |
| crypto | Cryptographic functions |
| dns | DNS lookup functionality |
| net | TCP and IPC networking |
| stream | Stream handling utilities |
| util | General utility functions |
| zlib | Compression and decompression |
| url | URL parsing and formatting |
| querystring | Query string parsing and serialization |
| events | Event emitter functionality |
| store | Persistent JSON-based storage |
| scheduler | Task scheduling with intervals and timeouts |
| monitor | System resource monitoring |
| mock | Mocking functions for testing |
| plugin | Registering custom modules |
| loader | Loading multiple modules at once |

## Module Documentation

### Module: file

File system operations, wrapping Node.js fs module. Provides both synchronous and asynchronous methods.

#### Methods

- **readFileSync(filename, encoding = "utf8")**
  - Reads a file synchronously
  - Returns: File content (string)
  - Throws: Error if the file cannot be read

- **readFile(filename, encoding = "utf8")**
  - Reads a file asynchronously
  - Returns: Promise resolving to file content

- **writeFileSync(filename, data, encoding = "utf8")**
  - Writes data to a file synchronously
  - Throws: Error if the file cannot be written

- **writeFile(filename, data, encoding = "utf8")**
  - Writes data to a file asynchronously
  - Returns: Promise that resolves when the file is written

- **existsSync(filename)**
  - Checks if a file exists synchronously
  - Returns: True if the file exists, false otherwise

- **exists(filename, mode = fs.constants.F_OK)**
  - Checks if a file exists asynchronously
  - Returns: Promise resolving to true if accessible, false otherwise

- **readDirSync(dirPath, options = { encoding: "utf8", withFileTypes: false })**
  - Reads directory contents synchronously
  - Returns: Array of filenames or Dirent objects

- **readDir(dirPath, options = { encoding: "utf8", withFileTypes: false })**
  - Reads directory contents asynchronously
  - Returns: Promise resolving to array of filenames or Dirent objects

- **makeDirSync(dirPath, options = { recursive: false })**
  - Creates a directory synchronously
  - Returns: First directory path created if recursive, undefined otherwise

- **makeDir(dirPath, options = { recursive: false })**
  - Creates a directory asynchronously
  - Returns: Promise resolving to first directory path created if recursive

- **deleteFileSync(filePath)**
  - Deletes a file synchronously
  - Throws: Error if the file cannot be deleted

- **deleteFile(filePath)**
  - Deletes a file asynchronously
  - Returns: Promise that resolves when the file is deleted

- **removeDirSync(dirPath, options = { recursive: false })**
  - Removes a directory synchronously
  - Throws: Error if the directory cannot be removed

- **removeDir(dirPath, options = { recursive: false })**
  - Removes a directory asynchronously
  - Returns: Promise that resolves when the directory is removed

- **renameSync(oldPath, newPath)**
  - Renames a file or directory synchronously
  - Throws: Error if the file or directory cannot be renamed

- **rename(oldPath, newPath)**
  - Renames a file or directory asynchronously
  - Returns: Promise that resolves when renamed

- **statSync(filePath)**
  - Gets file status synchronously
  - Returns: File status object (fs.Stats)

- **stat(filePath)**
  - Gets file status asynchronously
  - Returns: Promise resolving to file status object

#### Example

```javascript
const file = app.use("file");
await file.writeFile("test.txt", "Hello, World!");
console.log(await file.readFile("test.txt")); // Outputs: Hello, World!
console.log(file.existsSync("test.txt")); // Outputs: true
```

### Module: http

HTTP server and client functionality, wrapping Node.js http and https modules.

#### Methods

- **enableCORS()**
  - Enables CORS headers for the HTTP server

- **createServer(callback)**
  - Creates an HTTP server, listening on process.env.PORT or 3000 by default
  - Returns: HTTP server instance (http.Server)

- **get(url, options = {}, callback)**
  - Makes an HTTP GET request (Node.js style)
  - Returns: Client request object (http.ClientRequest)

- **fetch(url, options = {})**
  - Makes an HTTP request with a fetch-like interface
  - Returns: Promise resolving to Response object

#### Example

```javascript
const http = app.use("http");
http.enableCORS();
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello, World!");
});

const response = await http.fetch("http://localhost:3000");
console.log(await response.text()); // Outputs: Hello, World!
```

### Module: os

Operating system utilities, wrapping Node.js os module.

#### Methods

- **userInfo()** - Gets current user information
- **freemem()** - Gets free system memory in bytes
- **totalmem()** - Gets total system memory in bytes
- **arch()** - Gets the operating system CPU architecture
- **cpus()** - Gets information about each logical CPU core
- **hostname()** - Gets the system hostname
- **platform()** - Gets the operating system platform
- **release()** - Gets the operating system release
- **uptime()** - Gets the system uptime in seconds
- **loadavg()** - Gets the average system load over the last 1, 5, and 15 minutes

#### Example

```javascript
const os = app.use("os");
console.log(os.platform()); // Outputs: e.g., "linux"
console.log(os.freemem()); // Outputs: Free memory in bytes
```

### Module: path

Path manipulation utilities, wrapping Node.js path module.

#### Methods

- **join(...paths)** - Joins path segments using the platform-specific separator
- **resolve(...paths)** - Resolves path segments into an absolute path
- **dirname(p)** - Returns the directory name of a path
- **basename(p, ext)** - Returns the last portion of a path
- **extname(p)** - Returns the extension of the path
- **normalize(p)** - Normalizes a path, resolving ".." and "." segments
- **sep** - Platform-specific path segment separator (property)

#### Example

```javascript
const path = app.use("path");
console.log(path.join("dir", "file.txt")); // Outputs: dir/file.txt (on Unix)
console.log(path.extname("file.txt")); // Outputs: .txt
```

### Module: process

Information about the current Node.js process.

#### Methods

- **cwd()** - Gets the current working directory
- **env()** - Gets environment variables
- **argv()** - Gets command line arguments
- **version()** - Gets the Node.js version
- **memoryUsage()** - Gets memory usage information
- **exit(code = 0)** - Exits the process
- **pid()** - Gets the process ID (PID)
- **title()** - Gets the process title

#### Example

```javascript
const process = app.use("process");
console.log(process.cwd()); // Outputs: Current directory
console.log(process.env().NODE_ENV); // Outputs: e.g., "development"
```

### Module: child_process

Spawning child processes, wrapping Node.js child_process module.

#### Methods

- **spawn(command, args = [], options = {})** - Spawns a new process
- **exec(command, options = {}, callback)** - Executes a command in a shell (callback-based)
- **execAsync(command, options = {})** - Executes a command in a shell (Promise-based)
- **execSync(command, options = {})** - Executes a command in a shell synchronously

#### Example

```javascript
const cp = app.use("child_process");
const { stdout } = await cp.execAsync("echo Hello");
console.log(stdout); // Outputs: Hello
```

### Module: crypto

Cryptographic functions, wrapping Node.js crypto module.

#### Methods

- **createHash(algorithm)** - Creates a Hash object
- **randomBytes(size)** - Generates random bytes
- **createHmac(algorithm, key)** - Creates an HMAC object

#### Example

```javascript
const crypto = app.use("crypto");
const hash = crypto.createHash("sha256").update("data").digest("hex");
console.log(hash); // Outputs: SHA-256 hash
```

### Module: dns

DNS lookup functionality, wrapping Node.js dns module.

#### Methods

- **lookup(hostname, callback)** - Resolves a hostname to an IP address (callback-based)
- **lookupAsync(hostname)** - Resolves a hostname to an IP address (Promise-based)
- **resolve(hostname, rrtype = "A", callback)** - Resolves a hostname to DNS records (callback)
- **resolveAsync(hostname, rrtype = "A")** - Resolves a hostname to DNS records (Promise)

#### Example

```javascript
const dns = app.use("dns");
const { address } = await dns.lookupAsync("google.com");
console.log(address); // Outputs: IP address
```

### Module: store

Persistent JSON-based storage, saved to .envjs-store.json.

#### Methods

- **get(keyPath, defaultValue)** - Gets a value using dot notation
- **set(keyPath, value)** - Sets a value using dot notation, creating nested objects as needed
- **delete(keyPath)** - Deletes a value using dot notation
- **all()** - Gets the entire store data

#### Example

```javascript
const store = app.use("store");
store.set("user.name", "Alice");
console.log(store.get("user.name")); // Outputs: Alice
store.delete("user.name");
console.log(store.get("user.name", "Unknown")); // Outputs: Unknown
```

### Module: scheduler

Task scheduling with setInterval and setTimeout.

#### Methods

- **every(interval, callback, id)** - Schedules a repeating task
- **once(delay, callback, id)** - Schedules a one-time task
- **stop(id)** - Stops a scheduled task
- **list()** - Lists all scheduled task IDs

#### Example

```javascript
const scheduler = app.use("scheduler");
const id = scheduler.every("5s", () => console.log("Tick!"));
setTimeout(() => scheduler.stop(id), 15000); // Stops after 15 seconds
```

### Module: monitor

System resource monitoring via an EventEmitter. Emits events every 5 seconds.

#### Events

- **memory** - Process memory usage (object)
- **freemem** - Free system memory (number)
- **totalmem** - Total system memory (number)
- **memusage** - Memory usage details ({ free, total, percent })
- **cpus** - CPU information (os.CpuInfo[])
- **loadavg** - Load averages (number[])
- **uptime** - System uptime (number)
- **error** - Monitoring errors (Error)

#### Example

```javascript
const monitor = app.use("monitor");
monitor.on("memory", (usage) => console.log("Memory:", usage));
```

### Module: mock

Mocking functions for testing.

#### Methods

- **mock(keyPath, mockFn)** - Mocks a function
- **restore(keyPath?)** - Restores a mocked function or all mocks
- **isMocked(keyPath)** - Checks if a function is mocked
- **listMocks()** - Lists all mocked functions

#### Example

```javascript
const mock = app.use("mock");
mock.mock("file.readFile", () => Promise.resolve("Mocked!"));
console.log(await app.use("file").readFile("test.txt")); // Outputs: Mocked!
mock.restore("file.readFile");
```

### Module: plugin

Registering custom modules.

#### Methods

- **register(name, moduleContent)** - Registers a custom module

#### Example

```javascript
const plugin = app.use("plugin");
plugin.register("math", {
  square: (n) => n * n,
});

const math = app.use("math");
console.log(math.square(5)); // Outputs: 25
```

### Module: loader

Loading multiple modules at once.

#### Methods

- **load(moduleNames)** - Loads multiple modules

#### Example

```javascript
const loader = app.use("loader");
const { file, os } = loader.load(["file", "os"]);
console.log(os.platform()); // Outputs: e.g., "linux"
```

## Instance Methods

These methods are available directly on the envjs instance:

- **use(name)** - Accesses a module
- **availableModules()** - Lists all available modules
- **load(moduleNames)** - Loads multiple modules (alias for loader.load)
- **mock(keyPath, mockFn)** - Mocks a function (alias for mock.mock)
- **restore(keyPath?)** - Restores mocked functions (alias for mock.restore)
- **register(name, moduleContent)** - Registers a custom module (alias for plugin.register)

## Notes

- Asynchronous methods (e.g., readFile, fetch) return Promises and should be used with await or .then()
- Synchronous methods (e.g., readFileSync, execSync) may block the event loop and should be used cautiously
- The store module persists data to .envjs-store.json in the current working directory
- The scheduler module supports interval strings like "5s" (seconds), "1m" (minutes), "1h" (hours), and "1d" (days)
- The monitor module runs automatically and emits events every 5 seconds
- Mocking is intended for testing and should be restored after tests to avoid side effects

## License

MIT License. See LICENSE for details.