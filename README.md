# ENVJS

A simple low level control JS library made to ease low level development.
To install:

```npm install envjsc```  
### OR
```yarn add envjsc```

All modules and documentation can be found on the [EnvJS Site](www.envjs.vercel.app) -> ## NOT MADE YET! It will come in Version 1.1.5!

## Maintained by [Ebaad](https://www.github.com/mebaadwaheed)

## To start a new file:
```import envjs() from "envjs";```  
``` const app = envjs();``` 

``` const module = app.use("whatever module you want to use");```  
```module.someFunction()```  
### The first two lines are needed and heavily recommended, the second are just made up examples on how to use modules.  

# Available Modules
## For every function you have to put () at the end!
## You can access the following modules using env.use('moduleName'):
# Node.js Modules Documentation

You can access the following modules using `env.use('moduleName')`:

- file
- http
- os
- path
- process
- child_process
- crypto
- dns
- net
- stream
- util
- zlib
- url
- querystring
- events

## Module: file
File system operations.

### readFile(filename, encoding)
Reads a file.

- **filename**: The path to the file. (string)
- **encoding**: The file encoding. Defaults to "utf8". (string)
- **Returns**: The file content or null on error. (string|null)

### writeFile(filename, data, encoding)
Writes data to a file.

- **filename**: The path to the file. (string)
- **data**: The data to write. (string|Buffer)
- **encoding**: The file encoding. Defaults to "utf8". (string)

### exists(filename)
Checks if a file exists.

- **filename**: The path to the file. (string)
- **Returns**: True if the file exists, false otherwise. (boolean)

### readDir(dirPath, options)
Reads the content of a directory.

- **dirPath**: The path to the directory. (string)
- **options**: Options for reading the directory. Defaults to `{ encoding: "utf8", withFileTypes: false }`. (object)
- **Returns**: An array of filenames or Dirent objects, or null on error. (string[]|fs.Dirent[]|null)

### makeDir(dirPath, options)
Creates a directory.

- **dirPath**: The path to the directory to create. (string)
- **options**: Options for creating the directory. Defaults to `{ recursive: false }`. (object)
- **Returns**: The first directory path created if recursive, undefined otherwise, or null on error. (string|undefined|null)

### deleteFile(filePath)
Deletes a file.

- **filePath**: The path to the file. (string)

### removeDir(dirPath, options)
Removes a directory.

- **dirPath**: The path to the directory. (string)
- **options**: Options for removing the directory. Defaults to `{ recursive: false }`. (object)

### rename(oldPath, newPath)
Renames a file or directory.

- **oldPath**: The current path. (string)
- **newPath**: The new path. (string)

### stat(filePath)
Gets file status.

- **filePath**: The path to the file. (string)
- **Returns**: File status object or null on error. (fs.Stats|null)

## Module: http
HTTP server and client functionality.

### createServer(callback)
Creates an HTTP server. Listens on `process.env.PORT` or 3000 by default.

- **callback**: Request listener. (function)
- **Returns**: The HTTP server instance. (http.Server)

### get(url, options, callback)
Makes an HTTP GET request.

- **url**: The URL to request. (string|URL)
- **options**: Request options. Defaults to {}. (object)
- **callback**: Callback with the response (res, data, err). (function)
- **Returns**: The client request object. (http.ClientRequest)

## Module: os
Operating system related utility functions.

### currentUserData()
Gets current user information.

- **Returns**: User information. (os.UserInfo<string>)

### freeMem()
Gets free system memory in bytes.

- **Returns**: Free memory. (number)

### totalMem()
Gets total system memory in bytes.

- **Returns**: Total memory. (number)

### arch()
Gets the operating system CPU architecture.

- **Returns**: CPU architecture (e.g., 'x64', 'arm'). (string)

### cpus()
Gets an array of objects containing information about each logical CPU core.

- **Returns**: CPU information. (os.CpuInfo[])

### hostname()
Gets the system hostname.

- **Returns**: The hostname. (string)

### platform()
Gets the operating system platform.

- **Returns**: Platform (e.g., 'darwin', 'win32', 'linux'). (string)

### release()
Gets the operating system release.

- **Returns**: OS release. (string)

### uptime()
Gets the system uptime in seconds.

- **Returns**: Uptime. (number)

## Module: path
Path manipulation utilities.

### join(...paths)
Joins all given path segments together using the platform-specific separator.

- **...paths**: Path segments. (string)
- **Returns**: The joined path. (string)

### resolve(...paths)
Resolves a sequence of paths or path segments into an absolute path.

- **...paths**: Path segments. (string)
- **Returns**: The resolved absolute path. (string)

### dirname(p)
Returns the directory name of a path.

- **p**: The path. (string)
- **Returns**: The directory name. (string)

### basename(p, ext)
Returns the last portion of a path.

- **p**: The path. (string)
- **ext**: An optional extension to remove from the result. (string)
- **Returns**: The basename. (string)

### extname(p)
Returns the extension of the path.

- **p**: The path. (string)
- **Returns**: The extension. (string)

### normalize(p)
Normalizes the given path, resolving '..' and '.' segments.

- **p**: The path. (string)
- **Returns**: The normalized path. (string)

### sep
The platform-specific path segment separator.

- **Type**: string

## Module: process
Information about the current Node.js process.

### cwd()
Gets the current working directory.

- **Returns**: The current working directory. (string)

### env()
Gets environment variables.

- **Returns**: Environment variables. (object)

### argv()
Gets command line arguments.

- **Returns**: Command line arguments. (string[])

### version()
Gets the Node.js version.

- **Returns**: Node.js version. (string)

### memoryUsage()
Gets memory usage information.

- **Returns**: Memory usage details. (object)

### exit(code)
Exits the process.

- **code**: Exit code. Defaults to 0. (number)

### pid()
Gets the process ID (PID).

- **Returns**: The PID. (number)

### title()
Gets the process title.

- **Returns**: The process title. (string)

## Module: child_process
Functionality for spawning child processes.

### spawn(command, args, options)
Spawns a new process using the given command.

- **command**: The command to run. (string)
- **args**: List of string arguments. Defaults to []. (string[])
- **options**: Options for spawning the process. Defaults to {}. (object)
- **Returns**: The spawned child process or null on error. (child_process.ChildProcess|null)

### exec(command, options, callback)
Spawns a shell and executes a command within that shell.

- **command**: The command to run. (string)
- **options**: Options for exec. Defaults to {}. (object)
- **callback**: Callback with error, stdout, and stderr. (function)
- **Returns**: The spawned child process. (child_process.ChildProcess)

### execSync(command, options)
Synchronously spawns a shell and executes a command.

- **command**: The command to run. (string)
- **options**: Options for execSync. Defaults to {}. (object)
- **Returns**: The stdout from the command, or null on error. (Buffer|string|null)

## Module: crypto
Cryptographic functionality.

### createHash(algorithm)
Creates and returns a Hash object.

- **algorithm**: e.g., 'sha256', 'md5'. (string)
- **Returns**: The Hash object. (crypto.Hash)

### randomBytes(size)
Generates cryptographically strong pseudo-random data.

- **size**: The number of bytes to generate. (number)
- **Returns**: The random bytes. (Buffer)

### createHmac(algorithm, key)
Creates and returns an Hmac object.

- **algorithm**: The algorithm to use. (string)
- **key**: The HMAC key. (string|Buffer|crypto.KeyObject)
- **Returns**: The Hmac object. (crypto.Hmac)

## Module: dns
DNS lookup functionality.

### lookup(hostname, callback)
Resolves a hostname (e.g., 'google.com') into the first found A (IPv4) or AAAA (IPv6) record.

- **hostname**: The hostname to resolve. (string)
- **callback**: Callback with (err, address, family). (function)

### resolve(hostname, rrtype, callback)
Resolves a hostname into an array of record types specified by rrtype.

- **hostname**: The hostname to resolve. (string)
- **rrtype**: Resource record type (e.g., 'A', 'AAAA', 'MX', 'TXT'). Defaults to "A". (string)
- **callback**: Callback with (err, records). (function)

## Module: net
Networking functionality (TCP, IPC).

### createServer(options, connectionListener)
Creates a new TCP or IPC server.

- **options**: Options for the server. (object)
- **connectionListener**: Listener for 'connection' event. (function)
- **Returns**: The server instance. (net.Server)

### createConnection(options, connectListener)
Creates a new TCP or IPC connection.

- **options**: Port, path, or options object. ((number|string|object))
- **connectListener**: Listener for 'connect' event. (function)
- **Returns**: The socket instance. (net.Socket)

## Module: stream
API for working with streaming data.

### Readable
The Readable stream class.

- **Type**: stream.Readable

### Writable
The Writable stream class.

- **Type**: stream.Writable

### Duplex
The Duplex stream class.

- **Type**: stream.Duplex

### Transform
The Transform stream class.

- **Type**: stream.Transform

### pipeline
A promisified version of stream.pipeline. A utility function for piping streams together and passing errors.

- **Type**: (...streams: (NodeJS.ReadableStream | NodeJS.WritableStream | NodeJS.ReadWriteStream)[], callback?: (err: NodeJS.ErrnoException | null) => void) => Promise<void> (Promisified version)

### finished
A promisified version of stream.finished. A utility function to get a promise which is fulfilled when a stream is finished or errors.

- **Type**: (stream: NodeJS.ReadableStream | NodeJS.WritableStream | NodeJS.ReadWriteStream, options?: stream.FinishedOptions) => Promise<void> (Promisified version)

### pipe(source, destination, callback)
A utility function for piping streams and handling errors.

- **source**: The source readable stream. (stream.Readable)
- **destination**: The destination writable stream. (stream.Writable)
- **callback**: Called when piping is complete or an error occurs. (function)

## Module: util
Utility functions.

### promisify(original)
Promisifies a function that follows the error-first callback style.

- **original**: The function to promisify. (function)
- **Returns**: The promisified function. (function(...any): Promise<any>)

### inherits(constructor, superConstructor)
Inherits the prototype methods from one constructor into another.

- **constructor**: The child constructor. (function)
- **superConstructor**: The parent constructor. (function)
- **Deprecated**: Node.js recommends using ES6 classes and extends instead.

### inspect(objectToInspect, optionsOrShowHidden, depth, colors)
Returns a string representation of an object, useful for debugging.

- **objectToInspect**: The object to inspect. (any)
- **optionsOrShowHidden**: Inspection options or boolean for showHidden. Defaults to false. (object|boolean)
- **depth**: Inspection depth. (number)
- **colors**: Whether to use colors. (boolean)
- **Returns**: The formatted string. (string)

### format(format, ...params)
Formats a string using printf-like placeholders.

- **format**: The format string. (string)
- **...params**: Values to insert. (...any)
- **Returns**: The formatted string. (string)

## Module: zlib
Compression and decompression functionality.

### gzip(input, callback)
Compresses data using gzip.

- **input**: The data to compress. (Buffer|string)
- **callback**: Callback with (error, result). (function)

### gunzip(input, callback)
Decompresses gzip data.

- **input**: The data to decompress. (Buffer|string)
- **callback**: Callback with (error, result). (function)

### deflate(input, callback)
Compresses data using deflate.

- **input**: The data to compress. (Buffer|string)
- **callback**: Callback with (error, result). (function)

### inflate(input, callback)
Decompresses deflate data.

- **input**: The data to decompress. (Buffer|string)
- **callback**: Callback with (error, result). (function)

## Module: url
URL parsing and resolution.

### parse(urlString, parseQueryString, slashesDenoteHost)
Parses a URL string into an object (legacy API).

- **urlString**: The URL string to parse. (string)
- **parseQueryString**: If true, the query property will always be set to an object. Defaults to false. (boolean)
- **slashesDenoteHost**: If true, //foo/bar will be parsed as { host: 'foo', pathname: '/bar' }. Defaults to false. (boolean)
- **Returns**: The parsed URL object. (object)

### format(urlObject)
Takes a parsed URL object and returns a formatted URL string (legacy API).

- **urlObject**: The URL object to format. (object|URL)
- **Returns**: The formatted URL string. (string)

### resolve(from, to)
Resolves a target URL relative to a base URL (legacy API).

- **from**: The base URL. (string)
- **to**: The target URL. (string)
- **Returns**: The resolved URL. (string)
- **Deprecated**: Use `new URL(to, from).href` with the WHATWG URL API.

### URL
The WHATWG URL class constructor from Node's 'url' module.

- **Type**: typeof NodeURL

## Module: querystring
Utilities for parsing and formatting URL query strings.

- **Deprecated**: Node.js recommends using URLSearchParams from the WHATWG URL API.

### parse(str, sep, eq, options)
Parses a URL query string into an object.

- **str**: The query string to parse. (string)
- **sep**: The substring used to delimit key and value pairs. Defaults to '&'. (string)
- **eq**: The substring used to delimit keys and values. Defaults to '='. (string)
- **options**: Options for decoding. (object)
- **Returns**: The parsed query string object. (object)

### stringify(obj, sep, eq, options)
Serializes an object into a URL query string.

- **obj**: The object to serialize. (object)
- **sep**: The substring used to delimit key and value pairs. Defaults to '&'. (string)
- **eq**: The substring used to delimit keys and values. Defaults to '='. (string)
- **options**: Options for encoding. (object)
- **Returns**: The formatted query string. (string)

## Module: events
Event emitter functionality.

### EventEmitter
The EventEmitter class.

- **Type**: events.EventEmitter

### createEmitter()
Creates a new EventEmitter instance.

- **Returns**: A new EventEmitter. (events.EventEmitter)

## envjs Instance Methods
The object returned by calling `envjs()` has the following methods:

### use(name)
Accesses a specific module from the envjs collection.

- **name**: The name of the module to use (e.g., "file", "os", "http"). (string)
- **Returns**: The requested module. (object)
- **Throws**: Error if the module does not exist.

### availableModules()
Lists all available modules in envjs.

- **Returns**: An array of available module names. (string[])