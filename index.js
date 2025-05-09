import fs from "fs";
import path from "path";
import http from "http";
import os from "os";
import { fileURLToPath } from "url";
import child_process from "child_process";
import crypto from "crypto";
import dns from "dns";
import net from "net";
import stream from "stream";
import util from "util";
import zlib from "zlib";
import { parse as urlParse, format as urlFormat, URL as NodeURL } from "url"; // Renamed to avoid conflict if example uses global URL
import querystring from "querystring";
import events from "events";

// Emulate __dirname in ESM for the module itself
const __filenameInternal = fileURLToPath(import.meta.url);
const __dirnameInternal = path.dirname(__filenameInternal);

/**
 * @module envjs
 * @description Provides a simplified interface to various Node.js core modules.
 */
export default function envjs() {
  const modules = {
    /**
     * @memberof envjs
     * @namespace file
     * @description File system operations.
     */
    file: {
      /**
       * Reads a file.
       * @param {string} filename - The path to the file.
       * @param {string} [encoding="utf8"] - The file encoding.
       * @returns {string|null} The file content or null on error.
       */
      readFile(filename, encoding = "utf8") {
        try {
          const content = fs.readFileSync(path.resolve(filename), encoding);
          console.log("File content read successfully.");
          return content;
        } catch (err) {
          console.error("Read error:", err.message);
          return null;
        }
      },
      /**
       * Writes data to a file.
       * @param {string} filename - The path to the file.
       * @param {string|Buffer} data - The data to write.
       * @param {string} [encoding="utf8"] - The file encoding.
       */
      writeFile(filename, data, encoding = "utf8") {
        try {
          fs.writeFileSync(path.resolve(filename), data, encoding);
          console.log("File written successfully.");
        } catch (err) {
          console.error("Write error:", err.message);
        }
      },
      /**
       * Checks if a file exists.
       * @param {string} filename - The path to the file.
       * @returns {boolean} True if the file exists, false otherwise.
       */
      exists(filename) {
        return fs.existsSync(path.resolve(filename));
      },
      /**
       * Reads the content of a directory.
       * @param {string} dirPath - The path to the directory.
       * @param {object} [options={ encoding: "utf8", withFileTypes: false }] - Options for reading the directory.
       * @returns {string[]|fs.Dirent[]|null} An array of filenames or Dirent objects, or null on error.
       */
      readDir(dirPath, options = { encoding: "utf8", withFileTypes: false }) {
        try {
          const files = fs.readdirSync(path.resolve(dirPath), options);
          console.log("Directory read successfully.");
          return files;
        } catch (err) {
          console.error("Read directory error:", err.message);
          return null;
        }
      },
      /**
       * Creates a directory.
       * @param {string} dirPath - The path to the directory to create.
       * @param {object} [options={ recursive: false }] - Options for creating the directory.
       * @returns {string|undefined|null} The first directory path created if recursive, undefined otherwise, or null on error.
       */
      makeDir(dirPath, options = { recursive: false }) {
        try {
          const result = fs.mkdirSync(path.resolve(dirPath), options);
          console.log("Directory created successfully.");
          return result;
        } catch (err) {
          console.error("Make directory error:", err.message);
          return null;
        }
      },
       /**
       * Deletes a file.
       * @param {string} filePath - The path to the file.
       */
      deleteFile(filePath) {
        try {
          fs.unlinkSync(path.resolve(filePath));
          console.log("File deleted successfully.");
        } catch (err) {
          console.error("Delete file error:", err.message);
        }
      },
      /**
       * Removes a directory.
       * @param {string} dirPath - The path to the directory.
       * @param {object} [options={ recursive: false }] - Options for removing the directory.
       */
      removeDir(dirPath, options = { recursive: false }) {
        try {
          fs.rmdirSync(path.resolve(dirPath), options);
          console.log("Directory removed successfully.");
        } catch (err) {
          console.error("Remove directory error:", err.message);
        }
      },
      /**
       * Renames a file or directory.
       * @param {string} oldPath - The current path.
       * @param {string} newPath - The new path.
       */
      rename(oldPath, newPath) {
        try {
          fs.renameSync(path.resolve(oldPath), path.resolve(newPath));
          console.log("Renamed successfully.");
        } catch (err) {
          console.error("Rename error:", err.message);
        }
      },
      /**
       * Gets file status.
       * @param {string} filePath - The path to the file.
       * @returns {fs.Stats|null} File status object or null on error.
       */
      stat(filePath) {
        try {
          const stats = fs.statSync(path.resolve(filePath));
          return stats;
        } catch (err) {
          console.error("Stat error:", err.message);
          return null;
        }
      }
    },

    /**
     * @memberof envjs
     * @namespace http
     * @description HTTP server and client functionality.
     */
    http: {
      /**
       * Creates an HTTP server.
       * @param {function} callback - Request listener.
       * @returns {http.Server} The HTTP server instance.
       */
      createServer(callback) {
        const server = http.createServer(callback);
        // Listen on a default port or make it configurable
        const port = process.env.PORT || 3000;
        server.listen(port, () => {
          console.log(`HTTP server running on http://localhost:${port}`);
        });
        return server;
      },
      /**
       * Makes an HTTP GET request.
       * @param {string|URL} url - The URL to request.
       * @param {object} [options={}] - Request options.
       * @param {function} [callback] - Callback with the response (res, data, err).
       * @returns {http.ClientRequest} The client request object.
       */
      get(url, options, callback) {
        if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        console.log(`Making GET request to: ${url}`);
        return http.get(url, options, (res) => {
          let data = '';
          res.setEncoding('utf8'); // Ensure string data
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            console.log('GET request completed.');
            if (callback) callback(res, data, null);
          });
        }).on('error', (err) => {
          console.error("HTTP GET error:", err.message);
          if (callback) callback(null, null, err); // Pass error to callback
        });
      }
    },

    /**
     * @memberof envjs
     * @namespace os
     * @description Operating system related utility functions.
     */
    os: {
      /**
       * Gets current user information.
       * @returns {os.UserInfo<string>} User information.
       */
      currentUserData() {
        return os.userInfo();
      },
      /**
       * Gets free system memory in bytes.
       * @returns {number} Free memory.
       */
      freeMem() {
        return os.freemem();
      },
      /**
       * Gets total system memory in bytes.
       * @returns {number} Total memory.
       */
      totalMem() {
        return os.totalmem();
      },
      /**
       * Gets the operating system CPU architecture.
       * @returns {string} CPU architecture (e.g., 'x64', 'arm').
       */
      arch() {
        return os.arch();
      },
      /**
       * Gets an array of objects containing information about each logical CPU core.
       * @returns {os.CpuInfo[]} CPU information.
       */
      cpus() {
        return os.cpus();
      },
      /**
       * Gets the system hostname.
       * @returns {string} The hostname.
       */
      hostname() {
        return os.hostname();
      },
      /**
       * Gets the operating system platform.
       * @returns {string} Platform (e.g., 'darwin', 'win32', 'linux').
       */
      platform() {
        return os.platform();
      },
      /**
       * Gets the operating system release.
       * @returns {string} OS release.
       */
      release() {
        return os.release();
      },
      /**
       * Gets the system uptime in seconds.
       * @returns {number} Uptime.
       */
      uptime() {
        return os.uptime();
      }
    },

    /**
     * @memberof envjs
     * @namespace path
     * @description Path manipulation utilities.
     */
    path: {
      /**
       * Joins all given path segments together using the platform-specific separator.
       * @param {...string} paths - Path segments.
       * @returns {string} The joined path.
       */
      join(...paths) {
        return path.join(...paths);
      },
      /**
       * Resolves a sequence of paths or path segments into an absolute path.
       * @param {...string} paths - Path segments.
       * @returns {string} The resolved absolute path.
       */
      resolve(...paths) {
        return path.resolve(...paths);
      },
      /**
       * Returns the directory name of a path.
       * @param {string} p - The path.
       * @returns {string} The directory name.
       */
      dirname(p) {
        return path.dirname(p);
      },
      /**
       * Returns the last portion of a path.
       * @param {string} p - The path.
       * @param {string} [ext] - An optional extension to remove from the result.
       * @returns {string} The basename.
       */
      basename(p, ext) {
        return path.basename(p, ext);
      },
      /**
       * Returns the extension of the path.
       * @param {string} p - The path.
       * @returns {string} The extension.
       */
      extname(p) {
        return path.extname(p);
      },
      /**
       * Normalizes the given path, resolving '..' and '.' segments.
       * @param {string} p - The path.
       * @returns {string} The normalized path.
       */
      normalize(p) {
        return path.normalize(p);
      },
      /**
       * The platform-specific path segment separator.
       * @type {string}
       */
      sep: path.sep
    },

    /**
     * @memberof envjs
     * @namespace process
     * @description Information about the current Node.js process.
     */
    process: {
      /**
       * Gets the current working directory.
       * @returns {string} The current working directory.
       */
      cwd() {
        return process.cwd();
      },
      /**
       * Gets environment variables.
       * @returns {object} Environment variables.
       */
      env() {
        return process.env;
      },
      /**
       * Gets command line arguments.
       * @returns {string[]} Command line arguments.
       */
      argv() {
        return process.argv;
      },
      /**
       * Gets the Node.js version.
       * @returns {string} Node.js version.
       */
      version() {
        return process.version;
      },
      /**
       * Gets memory usage information.
       * @returns {object} Memory usage details.
       */
      memoryUsage() {
        return process.memoryUsage();
      },
      /**
       * Exits the process.
       * @param {number} [code=0] - Exit code.
       */
      exit(code = 0) {
        console.log(`Process exiting with code ${code}`);
        process.exit(code);
      },
      /**
       * Gets the process ID (PID).
       * @returns {number} The PID.
       */
      pid() {
        return process.pid;
      },
      /**
       * Gets the process title.
       * @returns {string} The process title.
       */
      title() {
        return process.title;
      }
    },

    /**
     * @memberof envjs
     * @namespace child_process
     * @description Functionality for spawning child processes.
     */
    child_process: {
      /**
       * Spawns a new process using the given command.
       * @param {string} command - The command to run.
       * @param {string[]} [args=[]] - List of string arguments.
       * @param {object} [options={}] - Options for spawning the process.
       * @returns {child_process.ChildProcess|null} The spawned child process or null on error.
       */
      spawn(command, args = [], options = {}) {
        try {
          console.log(`Spawning command: ${command} ${args.join(' ')}`);
          return child_process.spawn(command, args, options);
        } catch (err) {
          console.error("Spawn error:", err.message);
          return null;
        }
      },
      /**
       * Spawns a shell and executes a command within that shell.
       * @param {string} command - The command to run.
       * @param {object} [options={}] - Options for exec.
       * @param {function} [callback] - Callback with error, stdout, and stderr.
       * @returns {child_process.ChildProcess} The spawned child process.
       */
      exec(command, options, callback) {
         if (typeof options === 'function') {
          callback = options;
          options = {};
        }
        console.log(`Executing command: ${command}`);
        return child_process.exec(command, options, (error, stdout, stderr) => {
          if (error) {
            console.error(`Exec error: ${error.message}`);
            // It's good practice to still call the callback with the error
            if (callback) callback(error, stdout, stderr);
            return;
          }
          if (stderr) {
            // stderr doesn't always mean an error in execution, could be warnings
            console.warn(`Exec stderr: ${stderr}`);
          }
          if (stdout) {
            console.log(`Exec stdout: ${stdout}`);
          }
          if (callback) callback(null, stdout, stderr);
        });
      },
      /**
       * Synchronously spawns a shell and executes a command.
       * @param {string} command - The command to run.
       * @param {object} [options={}] - Options for execSync.
       * @returns {Buffer|string|null} The stdout from the command, or null on error.
       */
      execSync(command, options = {}) {
        try {
          console.log(`Executing command synchronously: ${command}`);
          return child_process.execSync(command, options);
        } catch (err) {
          console.error("ExecSync error:", err.message);
          // err.stdout might contain partial output, err.stderr contains error output
          if (err.stderr) console.error("ExecSync stderr:", err.stderr.toString());
          if (err.stdout) console.log("ExecSync stdout (on error):", err.stdout.toString());
          return null; // Indicate failure more clearly
        }
      }
    },

    /**
     * @memberof envjs
     * @namespace crypto
     * @description Cryptographic functionality.
     */
    crypto: {
      /**
       * Creates and returns a Hash object.
       * @param {string} algorithm - e.g., 'sha256', 'md5'.
       * @returns {crypto.Hash} The Hash object.
       */
      createHash(algorithm) {
        return crypto.createHash(algorithm);
      },
      /**
       * Generates cryptographically strong pseudo-random data.
       * @param {number} size - The number of bytes to generate.
       * @returns {Buffer} The random bytes.
       */
      randomBytes(size) {
        return crypto.randomBytes(size);
      },
      /**
       * Creates and returns an Hmac object.
       * @param {string} algorithm - The algorithm to use.
       * @param {string|Buffer|crypto.KeyObject} key - The HMAC key.
       * @returns {crypto.Hmac} The Hmac object.
       */
      createHmac(algorithm, key) {
        return crypto.createHmac(algorithm, key);
      }
    },

    /**
     * @memberof envjs
     * @namespace dns
     * @description DNS lookup functionality.
     */
    dns: {
      /**
       * Resolves a hostname (e.g., 'google.com') into the first found A (IPv4) or AAAA (IPv6) record.
       * @param {string} hostname - The hostname to resolve.
       * @param {function} callback - Callback with (err, address, family).
       */
      lookup(hostname, callback) {
        console.log(`Looking up DNS for: ${hostname}`);
        dns.lookup(hostname, (err, address, family) => {
          if (err) console.error("DNS lookup error:", err.message);
          else console.log(`DNS lookup result: ${address} (Family: IPv${family})`);
          if (callback) callback(err, address, family);
        });
      },
      /**
       * Resolves a hostname into an array of record types specified by rrtype.
       * @param {string} hostname - The hostname to resolve.
       * @param {string} [rrtype="A"] - Resource record type (e.g., 'A', 'AAAA', 'MX', 'TXT').
       * @param {function} callback - Callback with (err, records).
       */
      resolve(hostname, rrtype = "A", callback) {
        if (typeof rrtype === 'function') {
          callback = rrtype;
          rrtype = 'A';
        }
        console.log(`Resolving DNS ${rrtype} records for: ${hostname}`);
        dns.resolve(hostname, rrtype, (err, records) => {
          if (err) console.error(`DNS resolve (${rrtype}) error:`, err.message);
          else console.log(`DNS resolve (${rrtype}) result:`, records);
          if (callback) callback(err, records);
        });
      }
    },

    /**
     * @memberof envjs
     * @namespace net
     * @description Networking functionality (TCP, IPC).
     */
    net: {
      /**
       * Creates a new TCP or IPC server.
       * @param {object} [options] - Options for the server.
       * @param {function} [connectionListener] - Listener for 'connection' event.
       * @returns {net.Server} The server instance.
       */
      createServer(options, connectionListener) {
        if (typeof options === 'function') {
          connectionListener = options;
          options = {};
        }
        console.log("Creating net server...");
        const server = net.createServer(options, connectionListener);
        server.on('listening', () => console.log('Net server listening.'));
        server.on('error', (err) => console.error('Net server error:', err.message));
        return server;
      },
      /**
       * Creates a new TCP or IPC connection.
       * @param {(number|string|object)} options - Port, path, or options object.
       * @param {function} [connectListener] - Listener for 'connect' event.
       * @returns {net.Socket} The socket instance.
       */
      createConnection(options, connectListener) {
        console.log("Creating net connection with options:", options);
        const socket = net.createConnection(options, connectListener);
        socket.on('connect', () => console.log('Net connection established.'));
        socket.on('error', (err) => console.error('Net connection error:', err.message));
        return socket;
      }
    },
    /**
     * @memberof envjs
     * @namespace stream
     * @description API for working with streaming data.
     */
    stream: {
        Readable: stream.Readable,
        Writable: stream.Writable,
        Duplex: stream.Duplex,
        Transform: stream.Transform,
        pipeline: util.promisify(stream.pipeline), // Promisified version
        finished: util.promisify(stream.finished), // Promisified version
         /**
         * A utility function for piping streams and handling errors.
         * @param {stream.Readable} source - The source readable stream.
         * @param {stream.Writable} destination - The destination writable stream.
         * @param {function} callback - Called when piping is complete or an error occurs.
         */
        pipe(source, destination, callback) {
            console.log("Piping streams...");
            stream.pipeline(source, destination, (err) => {
                if (err) {
                    console.error('Pipeline failed.', err);
                    if (callback) callback(err);
                } else {
                    console.log('Pipeline succeeded.');
                    if (callback) callback(null);
                }
            });
        }
    },

    /**
     * @memberof envjs
     * @namespace util
     * @description Utility functions.
     */
    util: {
      /**
       * Promisifies a function that follows the error-first callback style.
       * @param {function} original - The function to promisify.
       * @returns {function(...any): Promise<any>} The promisified function.
       */
      promisify(original) {
        return util.promisify(original);
      },
      /**
       * Inherits the prototype methods from one constructor into another.
       * @param {function} constructor - The child constructor.
       * @param {function} superConstructor - The parent constructor.
       * @deprecated Node.js recommends using ES6 classes and `extends` instead.
       */
      inherits(constructor, superConstructor) {
        util.inherits(constructor, superConstructor);
        console.log(`${constructor.name} now inherits from ${superConstructor.name} (using util.inherits)`);
      },
      /**
       * Returns a string representation of an object, useful for debugging.
       * @param {any} objectToInspect - The object to inspect.
       * @param {object|boolean} [optionsOrShowHidden=false] - Inspection options or boolean for showHidden.
       * @param {number} [depth] - Inspection depth.
       * @param {boolean} [colors] - Whether to use colors.
       * @returns {string} The formatted string.
       */
      inspect(objectToInspect, optionsOrShowHidden = false, depth, colors) {
        let inspectOptions = {};
        if (typeof optionsOrShowHidden === 'boolean') {
            inspectOptions = { showHidden: optionsOrShowHidden, depth, colors };
        } else if (typeof optionsOrShowHidden === 'object' && optionsOrShowHidden !== null) {
            inspectOptions = optionsOrShowHidden;
        }
        return util.inspect(objectToInspect, inspectOptions);
      },
      /**
       * Formats a string using printf-like placeholders.
       * @param {string} format - The format string.
       * @param  {...any} params - Values to insert.
       * @returns {string} The formatted string.
       */
      format(format, ...params) {
          return util.format(format, ...params);
      }
    },

    /**
     * @memberof envjs
     * @namespace zlib
     * @description Compression and decompression functionality.
     */
    zlib: {
      /**
       * Compresses data using gzip.
       * @param {Buffer|string} input - The data to compress.
       * @param {function} callback - Callback with (error, result).
       */
      gzip(input, callback) {
        console.log("Gzipping data...");
        zlib.gzip(input, (err, result) => {
          if (err) console.error("Gzip error:", err.message);
          else console.log("Gzip successful.");
          if (callback) callback(err, result);
        });
      },
      /**
       * Decompresses gzip data.
       * @param {Buffer|string} input - The data to decompress.
       * @param {function} callback - Callback with (error, result).
       */
      gunzip(input, callback) {
        console.log("Gunzipping data...");
        zlib.gunzip(input, (err, result) => {
          if (err) console.error("Gunzip error:", err.message);
          else console.log("Gunzip successful.");
          if (callback) callback(err, result);
        });
      },
      /**
       * Compresses data using deflate.
       * @param {Buffer|string} input - The data to compress.
       * @param {function} callback - Callback with (error, result).
       */
      deflate(input, callback) {
        console.log("Deflating data...");
        zlib.deflate(input, (err, result) => {
          if (err) console.error("Deflate error:", err.message);
          else console.log("Deflate successful.");
          if (callback) callback(err, result);
        });
      },
      /**
       * Decompresses deflate data.
       * @param {Buffer|string} input - The data to decompress.
       * @param {function} callback - Callback with (error, result).
       */
      inflate(input, callback) {
        console.log("Inflating data...");
        zlib.inflate(input, (err, result) => {
          if (err) console.error("Inflate error:", err.message);
          else console.log("Inflate successful.");
          if (callback) callback(err, result);
        });
      }
    },

    /**
     * @memberof envjs
     * @namespace url
     * @description URL parsing and resolution.
     */
    url: {
      /**
       * Parses a URL string into an object (legacy API).
       * @param {string} urlString - The URL string to parse.
       * @param {boolean} [parseQueryString=false] - If true, the query property will always be set to an object.
       * @param {boolean} [slashesDenoteHost=false] - If true, `//foo/bar` will be parsed as `{ host: 'foo', pathname: '/bar' }`.
       * @returns {object} The parsed URL object.
       */
      parse(urlString, parseQueryString = false, slashesDenoteHost = false) {
        return urlParse(urlString, parseQueryString, slashesDenoteHost);
      },
      /**
       * Takes a parsed URL object and returns a formatted URL string (legacy API).
       * @param {object|URL} urlObject - The URL object to format.
       * @returns {string} The formatted URL string.
       */
      format(urlObject) {
        return urlFormat(urlObject);
      },
      /**
       * Resolves a target URL relative to a base URL (legacy API).
       * @param {string} from - The base URL.
       * @param {string} to - The target URL.
       * @returns {string} The resolved URL.
       * @deprecated Use `new URL(to, from).href` with the WHATWG URL API.
       */
      resolve(from, to) {
        return new NodeURL(to, from).href;
      },
      /**
       * The WHATWG URL class constructor from Node's 'url' module.
       * @type {typeof NodeURL}
       */
      URL: NodeURL
    },

    /**
     * @memberof envjs
     * @namespace querystring
     * @description Utilities for parsing and formatting URL query strings.
     * @deprecated Node.js recommends using `URLSearchParams` from the WHATWG URL API.
     */
    querystring: {
      /**
       * Parses a URL query string into an object.
       * @param {string} str - The query string to parse.
       * @param {string} [sep='&'] - The substring used to delimit key and value pairs.
       * @param {string} [eq='='] - The substring used to delimit keys and values.
       * @param {object} [options] - Options for decoding.
       * @returns {object} The parsed query string object.
       */
      parse(str, sep = '&', eq = '=', options) {
        return querystring.parse(str, sep, eq, options);
      },
      /**
       * Serializes an object into a URL query string.
       * @param {object} obj - The object to serialize.
       * @param {string} [sep='&'] - The substring used to delimit key and value pairs.
       * @param {string} [eq='='] - The substring used to delimit keys and values.
       * @param {object} [options] - Options for encoding.
       * @returns {string} The formatted query string.
       */
      stringify(obj, sep = '&', eq = '=', options) {
        return querystring.stringify(obj, sep, eq, options);
      }
    },

    /**
     * @memberof envjs
     * @namespace events
     * @description Event emitter functionality.
     */
    events: {
      /**
       * The EventEmitter class.
       * @type {events.EventEmitter}
       */
      EventEmitter: events.EventEmitter,
      /**
       * Creates a new EventEmitter instance.
       * @returns {events.EventEmitter} A new EventEmitter.
       */
      createEmitter() {
        return new events.EventEmitter();
      }
    }
    // Add more modules here
  };

  return {
    /**
     * Accesses a specific module from the envjs collection.
     * @param {string} name - The name of the module to use (e.g., "file", "os", "http").
     * @returns {object} The requested module.
     * @throws {Error} If the module does not exist.
     * @example
     * const env = envjs();
     * const fs = env.use("file");
     * fs.writeFile("example.txt", "Hello from envjs!");
     * console.log(fs.readFile("example.txt"));
     */
    use(name) {
      const mod = modules[name];
      if (!mod) throw new Error(`Module "${name}" does not exist.`);
      return mod;
    },
    /**
     * Lists all available modules in envjs.
     * @returns {string[]} An array of available module names.
     */
    availableModules() {
      return Object.keys(modules);
    }
  };
}

// Example Usage (optional - for testing or demonstration)
/*
// To run this example, save it as a .js file (e.g., test-envjs.js)
// and ensure your package.json has "type": "module" if you're using ES module syntax.
// Then run: node test-envjs.js

// --- ESM specific setup for __dirname in example script ---
import { fileURLToPath as _fileURLToPath } from 'url';
import _path from 'path'; // Use a different name to avoid conflict with env.use('path')

const __example_filename = _fileURLToPath(import.meta.url);
const __example_dirname = _path.dirname(__example_filename);
// --- End ESM specific setup ---


const env = envjs(); // Initialize envjs

// --- File Module Example ---
const file = env.use("file");
file.writeFile(_path.join(__example_dirname, "test.txt"), "Hello from envjs file module!");
console.log("Does test.txt exist?", file.exists(_path.join(__example_dirname, "test.txt")));
console.log("Content of test.txt:", file.readFile(_path.join(__example_dirname, "test.txt")));
file.makeDir(_path.join(__example_dirname, "my_test_dir"));
console.log("Does my_test_dir exist?", file.exists(_path.join(__example_dirname, "my_test_dir")));
file.removeDir(_path.join(__example_dirname, "my_test_dir"));
console.log("Does my_test_dir exist after removal?", file.exists(_path.join(__example_dirname, "my_test_dir")));
file.deleteFile(_path.join(__example_dirname, "test.txt"));


// --- OS Module Example ---
const osInfo = env.use("os");
console.log("Current User:", osInfo.currentUserData().username);
console.log("Free Memory:", (osInfo.freeMem() / (1024 * 1024)).toFixed(2), "MB");
console.log("Platform:", osInfo.platform());

// --- Path Module Example (using envjs's path) ---
const pathUtil = env.use("path"); // This is envjs's path module
const myPath = pathUtil.join(__example_dirname, "some", "file.txt"); // Use __example_dirname
console.log("Joined Path:", myPath);
console.log("Dirname:", pathUtil.dirname(myPath));
console.log("Basename:", pathUtil.basename(myPath));
console.log("Extname:", pathUtil.extname(myPath));

// --- Process Module Example ---
const proc = env.use("process");
console.log("Current Dir:", proc.cwd());
console.log("Node Version:", proc.version());
// proc.exit(0); // Be careful with this one!

// --- Child Process Example ---
const cp = env.use("child_process");
cp.exec("node -v", (error, stdout, stderr) => {
  if (error) {
      console.error("Error getting Node version via exec:", error);
      return;
  }
  console.log("Node version (via exec):", stdout.trim());
});
try {
    const npmVersion = cp.execSync("npm -v", { encoding: 'utf8' });
    if (npmVersion) {
        console.log("NPM version (via execSync):", npmVersion.trim());
    } else {
        console.log("Could not get NPM version via execSync.");
    }
} catch (e) {
    // execSync throws on error, error handling is in the wrapper now
    console.error("Failed to get NPM version (execSync threw outside wrapper, or wrapper returned null):", e.message);
}


// --- Crypto Module Example ---
const cryptoUtil = env.use("crypto");
const hash = cryptoUtil.createHash("sha256").update("my secret").digest("hex");
console.log("SHA256 Hash:", hash);
const random = cryptoUtil.randomBytes(16).toString('hex');
console.log("Random Bytes (hex):", random);

// --- DNS Module Example ---
const dnsUtil = env.use("dns");
dnsUtil.lookup("google.com", (err, address, family) => {
  if (!err) {
    console.log("Google.com IP:", address, `(IPv${family})`);
  } else {
    console.error("DNS lookup failed for google.com:", err.message);
  }
});
dnsUtil.resolve("google.com", "MX", (err, records) => {
    if (!err) {
        console.log("Google.com MX Records:", records);
    } else {
        console.error("DNS MX resolve failed for google.com:", err.message);
    }
});


// --- HTTP Module Example (Server) ---
// const httpServerInstance = env.use("http").createServer((req, res) => {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   res.end("Hello from envjs HTTP server!\n");
// });
// // To stop the server after some time (e.g., 5 seconds for testing)
// // setTimeout(() => httpServerInstance.close(() => console.log("HTTP server closed.")), 5000);

// --- HTTP Module Example (Client) ---
env.use("http").get('http://worldtimeapi.org/api/timezone/Europe/London', (res, data, err) => {
    if (err) {
        console.error("Error fetching time:", err.message);
        return;
    }
    if (res && res.statusCode === 200 && data) {
        try {
            console.log("Current time in London (from worldtimeapi):");
            const jsonData = JSON.parse(data);
            console.log(jsonData.datetime);
        } catch (parseError) {
            console.error("Error parsing JSON response from time API:", parseError.message);
        }
    } else if (res) {
        console.log("Failed to fetch time, status code:", res.statusCode);
    } else {
        console.log("Failed to fetch time, no response object.");
    }
});


// --- Net Module Example (Server & Client) ---
// const netModule = env.use("net");
// const netServer = netModule.createServer((socket) => {
//   console.log("Client connected to net server");
//   socket.write("Hello from net server!\r\n");
//   socket.pipe(socket); // Echo back
//   socket.on('end', () => console.log('Client disconnected from net server'));
//   socket.on('error', (err) => console.error('Net server socket error:', err.message));
// });
// netServer.listen(8124, () => {
//   console.log("Net server listening on port 8124");

//   const client = netModule.createConnection({ port: 8124 }, () => {
//     console.log("Connected to net server as client");
//     client.write("Hello server from client!\r\n");
//   });
//   client.on("data", (data) => {
//     console.log("Client received:", data.toString());
//     client.end(); // Close connection after receiving data
//   });
//   client.on("end", () => {
//     console.log("Disconnected from net server as client");
//     // Ensure server closes after client is done for cleanup
//     // netServer.close(() => console.log("Net server closed."));
//   });
//   client.on('error', (err) => {
//     console.error('Net client error:', err.message);
//     // netServer.close(() => console.log("Net server closed due to client error."));
//   });
// });
// // setTimeout(() => { // Auto-close server if net examples are uncommented
// //     if (netServer && netServer.listening) {
// //         netServer.close(() => console.log("Net server auto-closed after timeout."));
// //     }
// // }, 10000);


// --- Stream Module Example ---
const streamModule = env.use("stream");
const readable = new streamModule.Readable({
  read() {} // Implement read if necessary, or push data directly
});
const writable = new streamModule.Writable({
  write(chunk, encoding, callback) {
    console.log("Writable stream received:", chunk.toString());
    callback();
  }
});
readable.push("Hello from readable stream!");
readable.push(null); // End of data (signals EOF)

streamModule.pipe(readable, writable, (err) => {
    if (err) console.error("Stream pipe example failed:", err);
    else console.log("Stream pipe example succeeded.");
});


// --- Util Module Example ---
const utilMod = env.use("util");
const myObject = { a: 1, b: { c: 2, d: [3, 4] } };
console.log("Inspected Object:", utilMod.inspect(myObject, { colors: true, depth: null }));
const formattedString = utilMod.format('Hello %s, you have %d messages.', 'User', 5);
console.log("Formatted String:", formattedString);

// --- Zlib Module Example ---
const zlibMod = env.use("zlib");
const originalText = "This is some text to compress and decompress with zlib!";
zlibMod.gzip(originalText, (errGzip, compressed) => {
  if (errGzip) {
      console.error("Gzip example error:", errGzip);
      return;
  }
  console.log("Compressed (gzip):", compressed.toString('base64'));
  zlibMod.gunzip(compressed, (errGunzip, decompressed) => {
    if (errGunzip) {
        console.error("Gunzip example error:", errGunzip);
        return;
    }
    console.log("Decompressed (gunzip):", decompressed.toString());
  });
});

// --- URL Module Example ---
const urlMod = env.use("url");
const parsedUrl = urlMod.parse("https://www.example.com:8080/p/a/t/h?query=string&id=123#hash");
console.log("Parsed URL (legacy):", parsedUrl);
const formattedUrl = urlMod.format({ protocol: 'http', host: 'localhost', pathname: '/test', search: 'val=1' });
console.log("Formatted URL (legacy):", formattedUrl);

// Using WHATWG URL API via envjs.url.URL
const myNewUrl = new urlMod.URL('/foo/bar?baz=1', 'https://example.org/');
console.log("WHATWG URL href:", myNewUrl.href);
console.log("WHATWG URL Search Params (baz):", myNewUrl.searchParams.get('baz'));


// --- Querystring Module Example ---
const qsMod = env.use("querystring"); // Note: querystring is deprecated
const queryObj = qsMod.parse("name=John%20Doe&age=30&city=New%20York");
console.log("Parsed Query String:", queryObj);
const queryStringified = qsMod.stringify({ framework: "envjs", version: "1.0" });
console.log("Stringified Query:", queryStringified);

// --- Events Module Example ---
const eventsMod = env.use("events");
const myEmitter = eventsMod.createEmitter();
myEmitter.on("myevent", (arg1, arg2) => {
  console.log("MyEvent triggered with:", arg1, arg2);
});
myEmitter.emit("myevent", "Hello", "World");

console.log("Available envjs modules:", env.availableModules());

// Add a small delay to allow async operations in examples to complete
// setTimeout(() => {
//     console.log("Example script finished.");
//     // If http/net servers were started and not closed, you might need to manually exit
//     // proc.exit(0);
// }, 15000); // Adjust timeout as needed
*/
