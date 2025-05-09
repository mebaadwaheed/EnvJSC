import envjs from "./index.js"

/* const e = envjs();
const file = e.use("file");
const user = e.use("os");
file.readFile("./test.txt");

console.log(user.currentUserData());
console.log(`Free Memory: ${user.freeMem()}bytes`); */

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