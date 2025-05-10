import fs from "fs";
import path from "path";
import http from "http";
import https from "https"; // Import https for fetch support
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

// Promisify core Node.js async functions
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const readdirAsync = util.promisify(fs.readdir);
const mkdirAsync = util.promisify(fs.mkdir);
const unlinkAsync = util.promisify(fs.unlink);
const rmdirAsync = util.promisify(fs.rmdir);
const renameAsync = util.promisify(fs.rename);
const statAsync = util.promisify(fs.stat);
const execAsync = util.promisify(child_process.exec);
const gzipAsync = util.promisify(zlib.gzip);
const gunzipAsync = util.promisify(zlib.gunzip);
const deflateAsync = util.promisify(zlib.deflate);
const inflateAsync = util.promisify(zlib.inflate);
const dnsLookupAsync = util.promisify(dns.lookup);
const dnsResolveAsync = util.promisify(dns.resolve);


// Emulate __dirname in ESM for the module itself
const __filenameInternal = fileURLToPath(import.meta.url);
const __dirnameInternal = path.dirname(__filenameInternal);

// Internal state for mocking
const originalModules = {};
const mockedFunctions = {};

// Internal state for store
const storeFilePath = path.join(process.cwd(), '.envjs-store.json');
let storeData = {};

// Load store data on initialization
try {
  if (fs.existsSync(storeFilePath)) {
    const rawData = fs.readFileSync(storeFilePath, 'utf8');
    storeData = JSON.parse(rawData);
    // console.log("envjs store loaded successfully."); // Removed default success log
  } else {
    // Initialize with empty object if file doesn't exist
    fs.writeFileSync(storeFilePath, JSON.stringify({}), 'utf8');
    // console.log("envjs store file created."); // Removed default success log
  }
} catch (err) {
  console.error("Error loading envjs store:", err.message); // Keep error log
  storeData = {}; // Reset to empty on error
}

// Helper to save store data
function saveStore() {
  try {
    fs.writeFileSync(storeFilePath, JSON.stringify(storeData, null, 2), 'utf8');
    // console.log("envjs store saved."); // Removed default success log
  } catch (err) {
    console.error("Error saving envjs store:", err.message); // Keep error log
  }
}

/**
 * @module envjs
 * @description Provides a simplified interface to various Node.js core modules with added utilities.
 */
export default function envjs() {
  const modules = {
    /**
     * @memberof envjs
     * @namespace file
     * @description File system operations (synchronous and asynchronous).
     */
    file: {
      /**
       * Reads a file synchronously.
       * @param {string} filename - The path to the file.
       * @param {string} [encoding="utf8"] - The file encoding.
       * @returns {string} The file content.
       * @throws {Error} If the file cannot be read.
       */
      readFileSync(filename, encoding = "utf8") {
        // Check for mock first
        if (mockedFunctions['file.readFileSync']) {
            console.log(`Using mock for file.readFileSync('${filename}')`);
            return mockedFunctions['file.readFileSync'](filename, encoding);
        }
        // No try/catch here, let it throw naturally so the caller can handle it.
        const content = fs.readFileSync(path.resolve(filename), encoding);
        return content;
      },
      /**
       * Reads a file asynchronously.
       * @param {string} filename - The path to the file.
       * @param {string} [encoding="utf8"] - The file encoding.
       * @returns {Promise<string>} A promise that resolves with the file content.
       */
      readFile(filename, encoding = "utf8") {
         // Check for mock first
        if (mockedFunctions['file.readFile']) {
            console.log(`Using mock for file.readFile('${filename}')`);
            return Promise.resolve(mockedFunctions['file.readFile'](filename, encoding));
        }
        return readFileAsync(path.resolve(filename), encoding);
      },
      /**
       * Writes data to a file synchronously.
       * @param {string} filename - The path to the file.
       * @param {string|Buffer} data - The data to write.
       * @param {string} [encoding="utf8"] - The file encoding.
       * @throws {Error} If the file cannot be written.
       */
      writeFileSync(filename, data, encoding = "utf8") {
         // Check for mock first
        if (mockedFunctions['file.writeFileSync']) {
            console.log(`Using mock for file.writeFileSync('${filename}')`);
            return mockedFunctions['file.writeFileSync'](filename, data, encoding);
        }
        // No try/catch here, let it throw naturally.
        fs.writeFileSync(path.resolve(filename), data, encoding);
      },
      /**
       * Writes data to a file asynchronously.
       * @param {string} filename - The path to the file.
       * @param {string|Buffer} data - The data to write.
       * @param {string} [encoding="utf8"] - The file encoding.
       * @returns {Promise<void>} A promise that resolves when the file is written.
       */
      writeFile(filename, data, encoding = "utf8") {
         // Check for mock first
        if (mockedFunctions['file.writeFile']) {
            console.log(`Using mock for file.writeFile('${filename}')`);
            return Promise.resolve(mockedFunctions['file.writeFile'](filename, data, encoding));
        }
        return writeFileAsync(path.resolve(filename), data, encoding);
      },
      /**
       * Checks if a file exists synchronously.
       * @param {string} filename - The path to the file.
       * @returns {boolean} True if the file exists, false otherwise.
       */
      existsSync(filename) {
         // Check for mock first
        if (mockedFunctions['file.existsSync']) {
            console.log(`Using mock for file.existsSync('${filename}')`);
            return mockedFunctions['file.existsSync'](filename);
        }
        return fs.existsSync(path.resolve(filename));
      },
       /**
       * Checks if a file exists asynchronously.
       * Note: Using `fs.access` is generally preferred over `fs.exists` as it avoids race conditions.
       * This function resolves with true if the file exists and is accessible, false otherwise.
       * @param {string} filename - The path to the file.
       * @param {number} [mode=fs.constants.F_OK] - The mode to check (e.g., fs.constants.R_OK for readable).
       * @returns {Promise<boolean>} A promise that resolves with true if the file exists and is accessible, false otherwise.
       */
      exists(filename, mode = fs.constants.F_OK) {
         // Check for mock first
        if (mockedFunctions['file.exists']) {
            console.log(`Using mock for file.exists('${filename}')`);
            return Promise.resolve(mockedFunctions['file.exists'](filename, mode));
        }
        return new Promise((resolve) => {
            fs.access(path.resolve(filename), mode, (err) => {
                resolve(!err);
            });
        });
      },
      /**
       * Reads the content of a directory synchronously.
       * @param {string} dirPath - The path to the directory.
       * @param {object} [options={ encoding: "utf8", withFileTypes: false }] - Options for reading the directory.
       * @returns {string[]|fs.Dirent[]} An array of filenames or Dirent objects.
       * @throws {Error} If the directory cannot be read.
       */
      readDirSync(dirPath, options = { encoding: "utf8", withFileTypes: false }) {
         // Check for mock first
        if (mockedFunctions['file.readDirSync']) {
            console.log(`Using mock for file.readDirSync('${dirPath}')`);
            return mockedFunctions['file.readDirSync'](dirPath, options);
        }
        // No try/catch here, let it throw naturally.
        const files = fs.readdirSync(path.resolve(dirPath), options);
        return files;
      },
      /**
       * Reads the content of a directory asynchronously.
       * @param {string} dirPath - The path to the directory.
       * @param {object} [options={ encoding: "utf8", withFileTypes: false }] - Options for reading the directory.
       * @returns {Promise<string[]|fs.Dirent[]>} A promise that resolves with an array of filenames or Dirent objects.
       */
      readDir(dirPath, options = { encoding: "utf8", withFileTypes: false }) {
         // Check for mock first
        if (mockedFunctions['file.readDir']) {
            console.log(`Using mock for file.readDir('${dirPath}')`);
            return Promise.resolve(mockedFunctions['file.readDir'](dirPath, options));
        }
        return readdirAsync(path.resolve(dirPath), options);
      },
      /**
       * Creates a directory synchronously.
       * @param {string} dirPath - The path to the directory to create.
       * @param {object} [options={ recursive: false }] - Options for creating the directory.
       * @returns {string|undefined} The first directory path created if recursive, undefined otherwise.
       * @throws {Error} If the directory cannot be created.
       */
      makeDirSync(dirPath, options = { recursive: false }) {
         // Check for mock first
        if (mockedFunctions['file.makeDirSync']) {
            console.log(`Using mock for file.makeDirSync('${dirPath}')`);
            return mockedFunctions['file.makeDirSync'](dirPath, options);
        }
        // No try/catch here, let it throw naturally.
        const result = fs.mkdirSync(path.resolve(dirPath), options);
        return result;
      },
      /**
       * Creates a directory asynchronously.
       * @param {string} dirPath - The path to the directory to create.
       * @param {object} [options={ recursive: false }] - Options for creating the directory.
       * @returns {Promise<string|undefined>} A promise that resolves with the first directory path created if recursive, undefined otherwise.
       */
      makeDir(dirPath, options = { recursive: false }) {
         // Check for mock first
        if (mockedFunctions['file.makeDir']) {
            console.log(`Using mock for file.makeDir('${dirPath}')`);
            return Promise.resolve(mockedFunctions['file.makeDir'](dirPath, options));
        }
        return mkdirAsync(path.resolve(dirPath), options);
      },
       /**
       * Deletes a file synchronously.
       * @param {string} filePath - The path to the file.
       * @throws {Error} If the file cannot be deleted.
       */
      deleteFileSync(filePath) {
        // Check for mock first
        if (mockedFunctions['file.deleteFileSync']) {
            console.log(`Using mock for file.deleteFileSync('${filePath}')`);
            return mockedFunctions['file.deleteFileSync'](filePath);
        }
        // No try/catch here, let it throw naturally.
        fs.unlinkSync(path.resolve(filePath));
      },
       /**
       * Deletes a file asynchronously.
       * @param {string} filePath - The path to the file.
       * @returns {Promise<void>} A promise that resolves when the file is deleted.
       */
      deleteFile(filePath) {
        // Check for mock first
        if (mockedFunctions['file.deleteFile']) {
            console.log(`Using mock for file.deleteFile('${filePath}')`);
            return Promise.resolve(mockedFunctions['file.deleteFile'](filePath));
        }
        return unlinkAsync(path.resolve(filePath));
      },
      /**
       * Removes a directory synchronously.
       * @param {string} dirPath - The path to the directory.
       * @param {object} [options={ recursive: false }] - Options for removing the directory.
       * @throws {Error} If the directory cannot be removed.
       */
      removeDirSync(dirPath, options = { recursive: false }) {
         // Check for mock first
        if (mockedFunctions['file.removeDirSync']) {
            console.log(`Using mock for file.removeDirSync('${dirPath}')`);
            return mockedFunctions['file.removeDirSync'](dirPath, options);
        }
        // No try/catch here, let it throw naturally.
        fs.rmdirSync(path.resolve(dirPath), options);
      },
       /**
       * Removes a directory asynchronously.
       * @param {string} dirPath - The path to the directory.
       * @param {object} [options={ recursive: false }] - Options for removing the directory.
       * @returns {Promise<void>} A promise that resolves when the directory is removed.
       */
      removeDir(dirPath, options = { recursive: false }) {
         // Check for mock first
        if (mockedFunctions['file.removeDir']) {
            console.log(`Using mock for file.removeDir('${dirPath}')`);
            return Promise.resolve(mockedFunctions['file.removeDir'](dirPath, options));
        }
        return rmdirAsync(path.resolve(dirPath), options);
      },
      /**
       * Renames a file or directory synchronously.
       * @param {string} oldPath - The current path.
       * @param {string} newPath - The new path.
       * @throws {Error} If the file or directory cannot be renamed.
       */
      renameSync(oldPath, newPath) {
        // Check for mock first
        if (mockedFunctions['file.renameSync']) {
            console.log(`Using mock for file.renameSync('${oldPath}', '${newPath}')`);
            return mockedFunctions['file.renameSync'](oldPath, newPath);
        }
        // No try/catch here, let it throw naturally.
        fs.renameSync(path.resolve(oldPath), path.resolve(newPath));
      },
      /**
       * Renames a file or directory asynchronously.
       * @param {string} oldPath - The current path.
       * @param {string} newPath - The new path.
       * @returns {Promise<void>} A promise that resolves when the file or directory is renamed.
       */
      rename(oldPath, newPath) {
        // Check for mock first
        if (mockedFunctions['file.rename']) {
            console.log(`Using mock for file.rename('${oldPath}', '${newPath}')`);
            return Promise.resolve(mockedFunctions['file.rename'](oldPath, newPath));
        }
        return renameAsync(path.resolve(oldPath), path.resolve(newPath));
      },
      /**
       * Gets file status synchronously.
       * @param {string} filePath - The path to the file.
       * @returns {fs.Stats} File status object.
       * @throws {Error} If the file status cannot be retrieved.
       */
      statSync(filePath) {
         // Check for mock first
        if (mockedFunctions['file.statSync']) {
            console.log(`Using mock for file.statSync('${filePath}')`);
            return mockedFunctions['file.statSync'](filePath);
        }
        // No try/catch here, let it throw naturally.
        const stats = fs.statSync(path.resolve(filePath));
        return stats;
      },
      /**
       * Gets file status asynchronously.
       * @param {string} filePath - The path to the file.
       * @returns {Promise<fs.Stats>} A promise that resolves with the file status object.
       */
      stat(filePath) {
         // Check for mock first
        if (mockedFunctions['file.stat']) {
            console.log(`Using mock for file.stat('${filePath}')`);
            return Promise.resolve(mockedFunctions['file.stat'](filePath));
        }
        return statAsync(path.resolve(filePath));
      }
    },

    /**
     * @memberof envjs
     * @namespace http
     * @description HTTP server and client functionality.
     */
    http: {
      // Internal state for CORS
      _corsEnabled: false,

      /**
       * Enables simple CORS headers for the HTTP server.
       */
      enableCORS() {
          this._corsEnabled = true;
          console.log("CORS enabled for HTTP server.");
      },

      /**
       * Creates an HTTP server.
       * @param {function} callback - Request listener.
       * @returns {http.Server} The HTTP server instance.
       */
      createServer(callback) {
        const self = this; // Capture 'this' to access _corsEnabled
        const server = http.createServer((req, res) => {
          if (self._corsEnabled) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            // Handle CORS preflight requests
            if (req.method === 'OPTIONS') {
              res.writeHead(204);
              res.end();
              return; // Stop further processing for OPTIONS
            }
          }
          // Pass the request to the original callback
          callback(req, res);
        });

        // Listen on a default port or make it configurable
        const port = process.env.PORT || 3000;
        server.listen(port, () => {
          console.log(`HTTP server running on http://localhost:${port}`);
        });
        // No try/catch here, let listen errors propagate
        return server;
      },
      /**
       * Makes an HTTP GET request (Node.js native style).
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
        // Error handling is done via the 'error' event on the request object,
        // which is passed to the callback. This is standard Node.js behavior.
        return http.get(url, options, (res) => {
          let data = '';
          res.setEncoding('utf8'); // Ensure string data
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            console.log('GET request completed.');
            if (callback) callback(res, data, null);
          });
        }).on('error', (err) => {
          console.error("HTTP GET error:", err.message); // Keep error log
          if (callback) callback(null, null, err); // Pass error to callback
        });
      },
      /**
       * Makes an HTTP request with a fetch-like interface.
       * @param {string|URL|Request} url - The URL or Request object.
       * @param {object} [options={}] - Request options (method, headers, body, etc.).
       * @returns {Promise<Response>} A promise that resolves with the Response object.
       */
      fetch(url, options = {}) {
         // Check for mock first
        if (mockedFunctions['http.fetch']) {
            console.log(`Using mock for http.fetch('${url}')`);
            return Promise.resolve(mockedFunctions['http.fetch'](url, options));
        }

        return new Promise((resolve, reject) => {
          const parsedUrl = new NodeURL(url);
          const protocol = parsedUrl.protocol === 'https:' ? https : http;

          const reqOptions = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname + parsedUrl.search,
            method: options.method || 'GET',
            headers: options.headers || {},
          };

          const req = protocol.request(reqOptions, (res) => {
            let data = '';
            res.setEncoding('utf8'); // Assume text response for simplicity

            res.on('data', (chunk) => {
              data += chunk;
            });

            res.on('end', () => {
              // Simulate a basic Response object
              const response = {
                ok: res.statusCode >= 200 && res.statusCode < 300,
                status: res.statusCode,
                statusText: res.statusMessage,
                headers: res.headers,
                // Method to get body as text
                text: () => Promise.resolve(data),
                // Method to get body as JSON
                json: () => {
                  try {
                    return Promise.resolve(JSON.parse(data));
                  } catch (e) {
                    // Reject the promise if JSON parsing fails
                    return Promise.reject(new Error('Failed to parse JSON response: ' + e.message));
                  }
                },
                // Add other methods like blob(), arrayBuffer() if needed
              };
              resolve(response);
            });
          });

          req.on('error', (err) => {
            // Reject the promise on request error
            console.error("HTTP fetch request error:", err.message); // Keep error log
            reject(err);
          });

          // Write request body if present
          if (options.body) {
            // Ensure body is a string or Buffer
            const body = typeof options.body !== 'string' && !Buffer.isBuffer(options.body)
                         ? JSON.stringify(options.body) // Assume JSON if not string/buffer
                         : options.body;
            req.write(body);
          }

          req.end();
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
      userInfo() { // Renamed to match Node.js API
        return os.userInfo();
      },
      /**
       * Gets free system memory in bytes.
       * @returns {number} Free memory.
       */
      freemem() { // Renamed to match Node.js API
        return os.freemem();
      },
      /**
       * Gets total system memory in bytes.
       * @returns {number} Total memory.
       */
      totalmem() { // Renamed to match Node.js API
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
      },
      /**
       * Gets the average system load over the last 1, 5, and 15 minutes.
       * @returns {number[]} An array containing the 1, 5, and 15 minute load averages.
       */
      loadavg() {
        return os.loadavg();
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
       * @returns {child_process.ChildProcess} The spawned child process.
       * @throws {Error} If the process cannot be spawned (e.g., command not found).
       */
      spawn(command, args = [], options = {}) {
        // Check for mock first
        if (mockedFunctions['child_process.spawn']) {
            console.log(`Using mock for child_process.spawn('${command}')`);
            return mockedFunctions['child_process.spawn'](command, args, options);
        }
        // No try/catch here, let it throw naturally.
        console.log(`Spawning command: ${command} ${args.join(' ')}`);
        return child_process.spawn(command, args, options);
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
        // Check for mock first
        if (mockedFunctions['child_process.exec']) {
             console.log(`Using mock for child_process.exec('${command}')`);
             // Mocked exec should ideally call the callback
             const mockResult = mockedFunctions['child_process.exec'](command, options);
             if (callback && mockResult) {
                  // Assuming mockResult is { error, stdout, stderr }
                  callback(mockResult.error, mockResult.stdout, mockResult.stderr);
             }
              // Return a dummy object that might resemble ChildProcess if needed by the caller,
              // but for simple mocks, just calling the callback might be enough.
             return { pid: -1, stdout: null, stderr: null, on: () => {} }; // Dummy object
        }
        console.log(`Executing command: ${command}`);
        // Error handling is done via the callback, which is standard Node.js behavior.
        return child_process.exec(command, options, (error, stdout, stderr) => {
          if (error) {
            console.error(`Exec error: ${error.message}`); // Keep error log
            // It's good practice to still call the callback with the error
            if (callback) callback(error, stdout, stderr);
            return;
          }
          if (stderr) {
            // stderr doesn't always mean an error in execution, could be warnings
            console.warn(`Exec stderr: ${stderr}`); // Keep warning log
          }
          if (stdout) {
            // console.log(`Exec stdout: ${stdout}`); // Removed success log
          }
          if (callback) callback(null, stdout, stderr);
        });
      },
       /**
       * Spawns a shell and executes a command within that shell, returning a Promise.
       * @param {string} command - The command to run.
       * @param {object} [options={}] - Options for exec.
       * @returns {Promise<{ stdout: string; stderr: string; }>} A promise that resolves with stdout and stderr.
       */
      execAsync(command, options = {}) {
         // Check for mock first
        if (mockedFunctions['child_process.execAsync']) {
            console.log(`Using mock for child_process.execAsync('${command}')`);
            return Promise.resolve(mockedFunctions['child_process.execAsync'](command, options));
        }
        console.log(`Executing command asynchronously: ${command}`);
        // Promisified exec will reject on error, which is good.
        return execAsync(command, options);
      },
      /**
       * Synchronously spawns a shell and executes a command.
       * @param {string} command - The command to run.
       * @param {object} [options={}] - Options for execSync.
       * @returns {Buffer|string} The stdout from the command.
       * @throws {Error} If the command fails, the error object will contain stdout and stderr properties.
       */
      execSync(command, options = {}) {
        // Check for mock first
        if (mockedFunctions['child_process.execSync']) {
            console.log(`Using mock for child_process.execSync('${command}')`);
            return mockedFunctions['child_process.execSync'](command, options);
        }
        // No try/catch here, let it throw naturally.
        console.log(`Executing command synchronously: ${command}`);
        return child_process.execSync(command, options);
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
       * @param {string|Buffer|crypto.KeyObject} key - The HMAC key.
       * @param {string} algorithm - The algorithm to use.
       * @returns {crypto.Hmac} The Hmac object.
       */
      createHmac(algorithm, key) {
        return crypto.createHmac(algorithm, key);
      }
    },

    /**
     * @memberof envjs
     * @namespace dns
     * @description DNS lookup functionality (callback and Promise-based).
     */
    dns: {
      /**
       * Resolves a hostname (e.g., 'google.com') into the first found A (IPv4) or AAAA (IPv6) record using callbacks.
       * @param {string} hostname - The hostname to resolve.
       * @param {function} callback - Callback with (err, address, family).
       */
      lookup(hostname, callback) {
        // Check for mock first
        if (mockedFunctions['dns.lookup']) {
             console.log(`Using mock for dns.lookup('${hostname}')`);
             // Mocked lookup should ideally call the callback
             const mockResult = mockedFunctions['dns.lookup'](hostname);
             if (callback && mockResult) {
                  // Assuming mockResult is { err, address, family }
                  callback(mockResult.err, mockResult.address, mockResult.family);
             }
             return; // Mock handled the call
        }
        console.log(`Looking up DNS for: ${hostname}`);
        // Error handling is via the callback, standard Node.js.
        dns.lookup(hostname, (err, address, family) => {
          if (err) console.error("DNS lookup error:", err.message); // Keep error log
          // else console.log(`DNS lookup result: ${address} (Family: IPv${family})`); // Removed success log
          if (callback) callback(err, address, family);
        });
      },
       /**
       * Resolves a hostname (e.g., 'google.com') into the first found A (IPv4) or AAAA (IPv6) record using Promises.
       * @param {string} hostname - The hostname to resolve.
       * @returns {Promise<{ address: string; family: number; }>} A promise that resolves with the address and family.
       */
      lookupAsync(hostname) {
         // Check for mock first
        if (mockedFunctions['dns.lookupAsync']) {
            console.log(`Using mock for dns.lookupAsync('${hostname}')`);
            return Promise.resolve(mockedFunctions['dns.lookupAsync'](hostname));
        }
        console.log(`Looking up DNS asynchronously for: ${hostname}`);
        return dnsLookupAsync(hostname);
      },
      /**
       * Resolves a hostname into an array of record types specified by rrtype using callbacks.
       * @param {string} hostname - The hostname to resolve.
       * @param {string} [rrtype="A"] - Resource record type (e.g., 'A', 'AAAA', 'MX', 'TXT').
       * @param {function} callback - Callback with (err, records).
       */
      resolve(hostname, rrtype = "A", callback) {
        if (typeof rrtype === 'function') {
          callback = rrtype;
          rrtype = 'A';
        }
         // Check for mock first
        if (mockedFunctions['dns.resolve']) {
             console.log(`Using mock for dns.resolve('${hostname}', '${rrtype}')`);
             // Mocked resolve should ideally call the callback
             const mockResult = mockedFunctions['dns.resolve'](hostname, rrtype);
             if (callback && mockResult) {
                  // Assuming mockResult is { err, records }
                  callback(mockResult.err, mockResult.records);
             }
             return; // Mock handled the call
        }
        console.log(`Resolving DNS ${rrtype} records for: ${hostname}`);
        // Error handling is via the callback, standard Node.js.
        dns.resolve(hostname, rrtype, (err, records) => {
          if (err) console.error(`DNS resolve (${rrtype}) error:`, err.message); // Keep error log
          // else console.log(`DNS resolve (${rrtype}) result:`, records); // Removed success log
          if (callback) callback(err, records);
        });
      },
      /**
       * Resolves a hostname into an array of record types specified by rrtype using Promises.
       * @param {string} hostname - The hostname to resolve.
       * @param {string} [rrtype="A"] - Resource record type (e.g., 'A', 'AAAA', 'MX', 'TXT').
       * @returns {Promise<string[]|dns.MxRecord[]|dns.NaptrRecord[]|dns.SoaRecord|dns.SrvRecord[]|string[][]>} A promise that resolves with the records.
       */
      resolveAsync(hostname, rrtype = "A") {
         // Check for mock first
        if (mockedFunctions['dns.resolveAsync']) {
            console.log(`Using mock for dns.resolveAsync('${hostname}', '${rrtype}')`);
            return Promise.resolve(mockedFunctions['dns.resolveAsync'](hostname, rrtype));
        }
        console.log(`Resolving DNS ${rrtype} records asynchronously for: ${hostname}`);
        return dnsResolveAsync(hostname, rrtype);
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
        server.on('error', (err) => console.error('Net server error:', err.message)); // Keep error log
        // No try/catch here, let errors propagate via the 'error' event.
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
        socket.on('error', (err) => console.error('Net connection error:', err.message)); // Keep error log
         // No try/catch here, let errors propagate via the 'error' event.
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
         * A utility function for piping streams and handling errors using a callback.
         * @param {stream.Readable} source - The source readable stream.
         * @param {stream.Writable} destination - The destination writable stream.
         * @param {function} callback - Called when piping is complete or an error occurs.
         */
        pipe(source, destination, callback) {
            console.log("Piping streams...");
            // Error handling is via the callback, standard Node.js pipeline.
            stream.pipeline(source, destination, (err) => {
                if (err) {
                    console.error('Pipeline failed.', err); // Keep error log
                    if (callback) callback(err);
                } else {
                    // console.log('Pipeline succeeded.'); // Removed success log
                    if (callback) callback(null);
                }
            });
        },
         /**
         * A utility function for piping streams and handling errors using Promises.
         * @param {...(stream.Readable|stream.Writable|stream.Duplex|stream.Transform)} streams - The streams to pipe.
         * @returns {Promise<void>} A promise that resolves when the pipeline is finished.
         */
        pipelineAsync(...streams) {
             console.log("Piping streams asynchronously...");
             // Promisified pipeline will reject on error.
             return util.promisify(stream.pipeline)(...streams);
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
       * @deprecated Node.js recommends using ES6 classes and extends instead.
       */
      inherits(constructor, superConstructor) {
        util.inherits(constructor, superConstructor);
        console.log(`${constructor.name} now inherits from ${superConstructor.name} (using util.inherits)`); // Keep this log as it's informative about the action
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
     * @description Compression and decompression functionality (callback and Promise-based).
     */
    zlib: {
      /**
       * Compresses data using gzip with a callback.
       * @param {Buffer|string} input - The data to compress.
       * @param {function} callback - Callback with (error, result).
       */
      gzip(input, callback) {
        console.log("Gzipping data...");
        // Error handling is via the callback, standard Node.js.
        zlib.gzip(input, (err, result) => {
          if (err) console.error("Gzip error:", err.message); // Keep error log
          // else console.log("Gzip successful."); // Removed success log
          if (callback) callback(err, result);
        });
      },
       /**
       * Compresses data using gzip, returning a Promise.
       * @param {Buffer|string} input - The data to compress.
       * @returns {Promise<Buffer>} A promise that resolves with the compressed data.
       */
      gzipAsync(input) {
         console.log("Gzipping data asynchronously...");
         return gzipAsync(input);
      },
      /**
       * Decompresses gzip data with a callback.
       * @param {Buffer|string} input - The data to decompress.
       * @param {function} callback - Callback with (error, result).
       */
      gunzip(input, callback) {
        console.log("Gunzipping data...");
         // Error handling is via the callback, standard Node.js.
        zlib.gunzip(input, (err, result) => {
          if (err) console.error("Gunzip error:", err.message); // Keep error log
          // else console.log("Gunzip successful."); // Removed success log
          if (callback) callback(err, result);
        });
      },
       /**
       * Decompresses gzip data, returning a Promise.
       * @param {Buffer|string} input - The data to decompress.
       * @returns {Promise<Buffer>} A promise that resolves with the decompressed data.
       */
      gunzipAsync(input) {
         console.log("Gunzipping data asynchronously...");
         return gunzipAsync(input);
      },
      /**
       * Compresses data using deflate with a callback.
       * @param {Buffer|string} input - The data to compress.
       * @param {function} callback - Callback with (error, result).
       */
      deflate(input, callback) {
        console.log("Deflating data...");
         // Error handling is via the callback, standard Node.js.
        zlib.deflate(input, (err, result) => {
          if (err) console.error("Deflate error:", err.message); // Keep error log
          // else console.log("Deflate successful."); // Removed success log
          if (callback) callback(err, result);
        });
      },
       /**
       * Compresses data using deflate, returning a Promise.
       * @param {Buffer|string} input - The data to compress.
       * @returns {Promise<Buffer>} A promise that resolves with the compressed data.
       */
      deflateAsync(input) {
         console.log("Deflating data asynchronously...");
         return deflateAsync(input);
      },
      /**
       * Decompresses deflate data with a callback.
       * @param {Buffer|string} input - The data to decompress.
       * @param {function} callback - Callback with (error, result).
       */
      inflate(input, callback) {
        console.log("Inflating data...");
         // Error handling is via the callback, standard Node.js.
        zlib.inflate(input, (err, result) => {
          if (err) console.error("Inflate error:", err.message); // Keep error log
          // else console.log("Inflate successful."); // Removed success log
          if (callback) callback(err, result);
        });
      },
       /**
       * Decompresses deflate data, returning a Promise.
       * @param {Buffer|string} input - The data to decompress.
       * @returns {Promise<Buffer>} A promise that resolves with the decompressed data.
       */
      inflateAsync(input) {
         console.log("Inflating data asynchronously...");
         return inflateAsync(input);
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
       * @param {boolean} [slashesDenoteHost=false] - If true, //foo/bar will be parsed as { host: 'foo', pathname: '/bar' }.
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
       * @deprecated Use new URL(to, from).href with the WHATWG URL API.
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
     * @deprecated Node.js recommends using URLSearchParams from the WHATWG URL API.
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
    },

    /**
     * @memberof envjs
     * @namespace store
     * @description A simple JSON-based persistent storage.
     */
    store: {
        /**
         * Gets a value from the store using dot notation.
         * @param {string} keyPath - The key path (e.g., "users.0.name").
         * @param {any} [defaultValue] - The value to return if the key path is not found.
         * @returns {any} The value at the key path or the default value.
         */
        get(keyPath, defaultValue) {
            const keys = keyPath.split('.');
            let current = storeData;
            for (const key of keys) {
                if (current === null || typeof current !== 'object' || !(key in current)) {
                    return defaultValue;
                }
                current = current[key];
            }
            return current;
        },
        /**
         * Sets a value in the store using dot notation. Creates nested objects if they don't exist.
         * @param {string} keyPath - The key path (e.g., "users.0.name").
         * @param {any} value - The value to set.
         */
        set(keyPath, value) {
            const keys = keyPath.split('.');
            let current = storeData;
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (current === null || typeof current !== 'object') {
                     console.error(`Cannot set value: Intermediate path '${keys.slice(0, i + 1).join('.')}' is not an object.`); // Keep error log
                     return; // Cannot set if path is not an object
                }
                if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
                    // Create an object if it doesn't exist or is not an object
                    current[key] = {};
                }
                current = current[key];
            }
            const lastKey = keys[keys.length - 1];
             if (current !== null && typeof current === 'object') {
                current[lastKey] = value;
                saveStore(); // Save after setting
             } else {
                 console.error(`Cannot set value: Parent path '${keys.slice(0, -1).join('.')}' is not an object.`); // Keep error log
             }
        },
        /**
         * Deletes a value from the store using dot notation.
         * @param {string} keyPath - The key path (e.g., "users.0").
         */
        delete(keyPath) {
            const keys = keyPath.split('.');
            let current = storeData;
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                 if (current === null || typeof current !== 'object' || !(key in current)) {
                    console.warn(`Delete failed: Path '${keyPath}' not found.`); // Keep warning log
                    return; // Path does not exist
                }
                current = current[key];
            }
            const lastKey = keys[keys.length - 1];
             if (current !== null && typeof current === 'object' && lastKey in current) {
                delete current[lastKey];
                saveStore(); // Save after deleting
             } else {
                 console.warn(`Delete failed: Key '${lastKey}' not found at path '${keys.slice(0, -1).join('.')}'.`); // Keep warning log
             }
        },
        /**
         * Gets the entire store data.
         * @returns {object} The entire store object.
         */
        all() {
            // Return a deep copy to prevent external modification
            return JSON.parse(JSON.stringify(storeData));
        }
    },

    /**
     * @memberof envjs
     * @namespace scheduler
     * @description A simple scheduler using setInterval and setTimeout.
     */
    scheduler: {
        _timers: {}, // Store interval timers

        /**
         * Schedules a callback to run repeatedly at a specified interval.
         * @param {string|number} interval - The interval. Can be a number of milliseconds or a string like "5s", "1m", "1h".
         * @param {function} callback - The function to call.
         * @param {string} [id] - A unique ID for this schedule. If not provided, a random one is generated.
         * @returns {string|null} The ID of the scheduled task, or null if the interval is invalid.
         */
        every(interval, callback, id) {
            const timerId = id || `every-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            const intervalMs = typeof interval === 'string' ? this._parseInterval(interval) : interval;

            if (isNaN(intervalMs) || intervalMs <= 0) {
                console.error(`Invalid interval specified for scheduler: ${interval}`); // Keep error log
                return null;
            }

            console.log(`Scheduling task '${timerId}' to run every ${interval}...`); // Keep informative log
            const timer = setInterval(callback, intervalMs);
            this._timers[timerId] = timer;
            return timerId;
        },

         /**
         * Schedules a callback to run once after a specified delay.
         * @param {string|number} delay - The delay. Can be a number of milliseconds or a string like "5s", "1m", "1h".
         * @param {function} callback - The function to call.
         * @param {string} [id] - A unique ID for this schedule. If not provided, a random one is generated.
         * @returns {string|null} The ID of the scheduled task, or null if the delay is invalid.
         */
        once(delay, callback, id) {
            const timerId = id || `once-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            const delayMs = typeof delay === 'string' ? this._parseInterval(delay) : delay;

             if (isNaN(delayMs) || delayMs < 0) {
                console.error(`Invalid delay specified for scheduler: ${delay}`); // Keep error log
                return null;
            }

            console.log(`Scheduling task '${timerId}' to run once after ${delay}...`); // Keep informative log
            const timer = setTimeout(() => {
                callback();
                delete this._timers[timerId]; // Clean up after execution
            }, delayMs);
            this._timers[timerId] = timer;
            return timerId;
        },

        /**
         * Stops a scheduled task.
         * @param {string} id - The ID of the task to stop.
         * @returns {boolean} True if the task was found and stopped, false otherwise.
         */
        stop(id) {
            if (this._timers[id]) {
                console.log(`Stopping scheduled task '${id}'.`); // Keep informative log
                // Check if it's an interval or timeout
                if (this._timers[id]._repeat) { // Heuristic to check if it's an interval
                     clearInterval(this._timers[id]);
                } else {
                     clearTimeout(this._timers[id]);
                }
                delete this._timers[id];
                return true;
            }
            console.warn(`Scheduled task '${id}' not found.`); // Keep warning log
            return false;
        },

        /**
         * Lists all currently scheduled task IDs.
         * @returns {string[]} An array of scheduled task IDs.
         */
        list() {
            return Object.keys(this._timers);
        },

        /**
         * Parses an interval string (e.g., "5s", "1m", "1h") into milliseconds.
         * @private
         * @param {string} intervalString - The interval string.
         * @returns {number} The interval in milliseconds, or NaN if invalid.
         */
        _parseInterval(intervalString) {
            const value = parseInt(intervalString, 10);
            if (isNaN(value)) return NaN;

            const unit = intervalString.replace(value, '').toLowerCase();
            switch (unit) {
                case 'ms': return value;
                case 's': return value * 1000;
                case 'm': return value * 1000 * 60;
                case 'h': return value * 1000 * 60 * 60;
                case 'd': return value * 1000 * 60 * 60 * 24;
                default: return NaN; // Unknown unit
            }
        }
    },

    /**
     * @memberof envjs
     * @namespace monitor
     * @description Monitors system statistics and emits events.
     */
    monitor: new events.EventEmitter(), // Monitor is an EventEmitter instance directly

    // Initialize monitor functionality
    _initMonitor: function() {
        const monitorInterval = 5000; // Poll every 5 seconds

        // Prevent multiple initializations if envjs() is called multiple times
        if (this.monitor._monitoring) {
            return;
        }
        this.monitor._monitoring = true; // Mark as initialized

        console.log(`Starting system monitor, polling every ${monitorInterval}ms.`); // Keep informative log

        setInterval(() => {
            try {
                const memory = process.memoryUsage();
                this.monitor.emit('memory', memory);
                // console.log('Monitor: Memory emitted', memory); // Debugging

                const freeMem = os.freemem();
                const totalMem = os.totalmem();
                this.monitor.emit('freemem', freeMem);
                this.monitor.emit('totalmem', totalMem);
                this.monitor.emit('memusage', { free: freeMem, total: totalMem, percent: (totalMem - freeMem) / totalMem });
                 // console.log('Monitor: Mem stats emitted', { free: freeMem, total: totalMem }); // Debugging

                const cpus = os.cpus();
                this.monitor.emit('cpus', cpus);
                 // console.log('Monitor: CPUs emitted', cpus.length); // Debugging

                const loadavg = os.loadavg();
                this.monitor.emit('loadavg', loadavg);
                 // console.log('Monitor: Loadavg emitted', loadavg); // Debugging

                const uptime = os.uptime();
                this.monitor.emit('uptime', uptime);
                 // console.log('Monitor: Uptime emitted', uptime); // Debugging

            } catch (err) {
                console.error("Error in system monitor:", err.message); // Keep error log
                this.monitor.emit('error', err);
            }
        }, monitorInterval).unref(); // Allow Node.js to exit even if this timer is active
    }
    // Note: _initMonitor is called below after modules are defined
  };

  // --- Mocking System ---
  /**
   * @memberof envjs
   * @namespace mock
   * @description Provides functionality to mock envjs module functions for testing.
   */
  const mock = {
      /**
       * Mocks a specific function within an envjs module.
       * @param {string} keyPath - The dot-separated path to the function (e.g., "file.readFile", "http.fetch").
       * @param {function} mockFn - The function to use as a mock.
       * @throws {Error} If the module or function does not exist.
       */
      mock(keyPath, mockFn) {
          const parts = keyPath.split('.');
          if (parts.length !== 2) {
              throw new Error(`Invalid keyPath for mock: "${keyPath}". Must be in the format "module.function".`);
          }
          const moduleName = parts[0];
          const functionName = parts[1];

          const module = modules[moduleName];
          if (!module) {
              throw new Error(`Module "${moduleName}" not found for mocking.`);
          }
          const originalFn = module[functionName];
          if (typeof originalFn !== 'function') {
               throw new Error(`Function "${functionName}" not found or is not a function in module "${moduleName}" for mocking.`);
          }

          // Store the original function if not already stored
          if (!originalModules[keyPath]) {
              originalModules[keyPath] = originalFn;
          }

          // Replace the original function with the mock
          module[functionName] = mockFn;
          mockedFunctions[keyPath] = mockFn; // Store the mock function for lookup

          console.log(`Mocked function: ${keyPath}`); // Keep informative log
      },
      /**
       * Restores a mocked function to its original implementation.
       * If no keyPath is provided, all mocked functions are restored.
       * @param {string} [keyPath] - The dot-separated path to the function to restore (e.g., "file.readFile").
       * @throws {Error} If the keyPath is invalid or the function was not mocked.
       */
      restore(keyPath) {
          if (keyPath) {
              const parts = keyPath.split('.');
              if (parts.length !== 2) {
                   throw new Error(`Invalid keyPath for restore: "${keyPath}". Must be in the format "module.function".`);
              }
              const moduleName = parts[0];
              const functionName = parts[1];

              const module = modules[moduleName];
               if (!module) {
                  throw new Error(`Module "${moduleName}" not found for restoring.`);
              }

              const originalFn = originalModules[keyPath];
              if (!originalFn) {
                  // Check if it was ever mocked
                  if (mockedFunctions[keyPath]) {
                       // It was mocked, but originalModules wasn't populated? Should not happen with current logic.
                       console.warn(`Original function for "${keyPath}" not found in storage, but it was marked as mocked. Attempting direct restore if possible.`); // Keep warning log
                       // In a more robust system, you might try to get the original from the core module again.
                       // For this simplified version, we'll just log a warning and proceed to remove the mock marker.
                  } else {
                     throw new Error(`Function "${keyPath}" was not mocked.`);
                  }
              } else {
                 // Restore the original function
                 module[functionName] = originalFn;
              }

              // Clean up mock state
              delete mockedFunctions[keyPath];
              delete originalModules[keyPath];

              console.log(`Restored function: ${keyPath}`); // Keep informative log

          } else {
              // Restore all mocked functions
              console.log("Restoring all mocked functions."); // Keep informative log
              for (const keyPathToRestore in mockedFunctions) {
                  try {
                      this.restore(keyPathToRestore); // Use the single restore logic
                  } catch (e) {
                      console.error(`Error restoring "${keyPathToRestore}": ${e.message}`); // Keep error log
                  }
              }
          }
      },
      /**
       * Checks if a specific function is currently mocked.
       * @param {string} keyPath - The dot-separated path to the function (e.g., "file.readFile").
       * @returns {boolean} True if the function is mocked, false otherwise.
       */
      isMocked(keyPath) {
          return keyPath in mockedFunctions;
      },
      /**
       * Lists all currently mocked functions.
       * @returns {string[]} An array of key paths for mocked functions.
       */
      listMocks() {
          return Object.keys(mockedFunctions);
      }
  };
   // Add mock methods to the modules object so they are accessible via env.use('mock')
   modules.mock = mock;


  // --- Plugin System ---
  /**
   * @memberof envjs
   * @namespace plugin
   * @description Allows registering custom modules.
   */
  const plugin = {
      /**
       * Registers a new custom module with envjs.
       * @param {string} name - The name of the new module.
       * @param {object} moduleContent - The object containing the module's functions and properties.
       * @throws {Error} If a module with the same name already exists.
       */
      register(name, moduleContent) {
          if (modules[name]) {
              throw new Error(`Module "${name}" already exists. Cannot register.`);
          }
          if (typeof moduleContent !== 'object' || moduleContent === null) {
              throw new Error(`Invalid module content provided for "${name}". Must be an object.`);
          }
          modules[name] = moduleContent;
          console.log(`Custom module "${name}" registered.`); // Keep informative log
      }
  };
  // Add plugin methods to the modules object
  modules.plugin = plugin;


  // --- Auto-Loader ---
  /**
   * @memberof envjs
   * @namespace loader
   * @description Provides functionality to load multiple modules at once.
   */
  const loader = {
       /**
       * Loads multiple envjs modules and returns them in an object.
       * @param {string[]} moduleNames - An array of module names to load.
       * @returns {object} An object where keys are module names and values are the corresponding module objects.
       * @throws {Error} If any of the requested modules do not exist.
       */
      load(moduleNames) {
          if (!Array.isArray(moduleNames)) {
              throw new Error("moduleNames must be an array.");
          }
          const loadedModules = {};
          for (const name of moduleNames) {
              const mod = modules[name];
              if (!mod) {
                  throw new Error(`Module "${name}" does not exist.`);
              }
              loadedModules[name] = mod;
          }
          console.log(`Loaded modules: ${moduleNames.join(', ')}`); // Keep informative log
          return loadedModules;
      }
  };
   // Add loader methods to the modules object
   modules.loader = loader;


  // Initialize the monitor after all modules are defined
  if (modules.monitor && !modules.monitor._monitoring) {
      modules._initMonitor.call(modules); // Use .call to set 'this' correctly
  }


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
      return Object.keys(modules).filter(name => !name.startsWith('_')); // Exclude internal modules
    },
     /**
     * Loads multiple envjs modules and returns them in an object.
     * This is a convenience alias for `env.use('loader').load()`.
     * @param {string[]} moduleNames - An array of module names to load.
     * @returns {object} An object where keys are module names and values are the corresponding module objects.
     * @throws {Error} If any of the requested modules do not exist.
     * @example
     * const env = envjs();
     * const { file, os } = env.load(['file', 'os']);
     * console.log(os.platform());
     */
    load(moduleNames) {
        return modules.loader.load(moduleNames);
    },
     /**
     * Mocks a specific function within an envjs module for testing.
     * This is a convenience alias for `env.use('mock').mock()`.
     * @param {string} keyPath - The dot-separated path to the function (e.g., "file.readFile", "http.fetch").
     * @param {function} mockFn - The function to use as a mock.
     * @throws {Error} If the module or function does not exist.
     * @example
     * const env = envjs();
     * env.mock('file.readFile', (filename) => `Mocked content for ${filename}`);
     * const file = env.use('file');
     * file.readFile('test.txt').then(content => console.log(content)); // Outputs: Mocked content for test.txt
     * env.restore('file.readFile'); // Restore original behavior
     */
    mock(keyPath, mockFn) {
        return modules.mock.mock(keyPath, mockFn);
    },
    /**
     * Restores a mocked function to its original implementation.
     * If no keyPath is provided, all mocked functions are restored.
     * This is a convenience alias for `env.use('mock').restore()`.
     * @param {string} [keyPath] - The dot-separated path to the function to restore (e.g., "file.readFile").
     * @throws {Error} If the keyPath is invalid or the function was not mocked.
     * @example
     * // After mocking file.readFile
     * env.restore('file.readFile');
     * // Restore all mocks
     * env.restore();
     */
    restore(keyPath) {
         return modules.mock.restore(keyPath);
    },
     /**
     * Registers a new custom module with envjs.
     * This is a convenience alias for `env.use('plugin').register()`.
     * @param {string} name - The name of the new module.
     * @param {object} moduleContent - The object containing the module's functions and properties.
     * @throws {Error} If a module with the same name already exists.
     * @example
     * const env = envjs();
     * env.register('math', {
     * square: (n) => n * n,
     * add: (a, b) => a + b
     * });
     * const math = env.use('math');
     * console.log(math.square(5)); // Outputs: 25
     */
    register(name, moduleContent) {
        return modules.plugin.register(name, moduleContent);
    }
  };
}
