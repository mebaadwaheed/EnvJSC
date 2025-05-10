// Import the envjs module
import envjs from './index.js'; // Assuming your envjs code is in index.js in the same directory

// Initialize envjs
const env = envjs();

console.log('--- Starting envjs Comprehensive Test ---');

// 1. Test basic modules (os, path, process)
console.log('\n--- Testing os, path, and process modules ---');
const osInfo = env.use('os');
const pathUtil = env.use('path');
const processInfo = env.use('process');

console.log('OS Platform:', osInfo.platform());
console.log('Total Memory (bytes):', osInfo.totalmem());
console.log('Free Memory (bytes):', osInfo.freemem());
console.log('CPU Architecture:', osInfo.arch());
console.log('System Uptime (seconds):', osInfo.uptime());
console.log('Load Average (1, 5, 15 min):', osInfo.loadavg().join(', '));
console.log('Current User Info:', osInfo.userInfo());

console.log('Path Join:', pathUtil.join('dir1', 'dir2', 'file.txt'));
console.log('Path Resolve:', pathUtil.resolve('..', 'file.txt'));
console.log('Path Dirname:', pathUtil.dirname('/usr/local/bin/node'));
console.log('Path Basename:', pathUtil.basename('/usr/local/bin/node', '.node'));
console.log('Path Extname:', pathUtil.extname('/path/to/file.txt'));
console.log('Path Normalize:', pathUtil.normalize('/usr//local/../bin/./node'));
console.log('Path Separator:', pathUtil.sep);

console.log('Current Working Directory:', processInfo.cwd());
console.log('Node.js Version:', processInfo.version());
console.log('Process ID (PID):', processInfo.pid());
console.log('Process Title:', processInfo.title());
console.log('Memory Usage:', processInfo.memoryUsage());
// console.log('Environment Variables:', processInfo.env()); // Can be very verbose

// 2. Test File System module (Synchronous and Asynchronous)
console.log('\n--- Testing file module (sync and async) ---');
const file = env.use('file');
const testFileNameSync = 'test_envjs_sync.txt';
const testFileNameAsync = 'test_envjs_async.txt';
const testDirSync = 'test_dir_sync';
const testDirAsync = 'test_dir_async';

// --- Synchronous File Tests ---
console.log('\n--- Synchronous File Tests ---');
try {
  // Write file sync
  file.writeFileSync(testFileNameSync, 'Synchronous file content.');
  console.log(`Wrote to ${testFileNameSync} synchronously.`);

  // Read file sync
  const contentSync = file.readFileSync(testFileNameSync);
  console.log(`Read from ${testFileNameSync} synchronously: "${contentSync}"`);

  // Check existence sync
  console.log(`Does ${testFileNameSync} exist synchronously? ${file.existsSync(testFileNameSync)}`);

  // Create directory sync
  file.makeDirSync(testDirSync);
  console.log(`Created directory ${testDirSync} synchronously.`);

  // Read directory sync
  const dirContentSync = file.readDirSync('.');
  console.log(`Directory content (sync): ${dirContentSync.join(', ')}`);

  // Rename sync
  const renamedFileNameSync = 'renamed_test_sync.txt';
  file.renameSync(testFileNameSync, renamedFileNameSync);
  console.log(`Renamed ${testFileNameSync} to ${renamedFileNameSync} synchronously.`);
  console.log(`Does ${testFileNameSync} exist after rename? ${file.existsSync(testFileNameSync)}`);
  console.log(`Does ${renamedFileNameSync} exist after rename? ${file.existsSync(renamedFileNameSync)}`);

  // Stat sync
  const statsSync = file.statSync(renamedFileNameSync);
  console.log(`Stat of ${renamedFileNameSync} (sync):`, statsSync);

  // Delete file sync
  file.deleteFileSync(renamedFileNameSync);
  console.log(`Deleted ${renamedFileNameSync} synchronously.`);
  console.log(`Does ${renamedFileNameSync} exist after deletion? ${file.existsSync(renamedFileNameSync)}`);

  // Remove directory sync
  file.removeDirSync(testDirSync);
  console.log(`Removed directory ${testDirSync} synchronously.`);

} catch (err) {
  console.error('Synchronous file test failed:', err.message);
}

// --- Asynchronous File Tests ---
console.log('\n--- Asynchronous File Tests ---');
file.writeFile(testFileNameAsync, 'Asynchronous file content.')
  .then(() => {
    console.log(`Wrote to ${testFileNameAsync} asynchronously.`);
    return file.readFile(testFileNameAsync);
  })
  .then(contentAsync => {
    console.log(`Read from ${testFileNameAsync} asynchronously: "${contentAsync}"`);
    return file.exists(testFileNameAsync);
  })
  .then(existsAsync => {
    console.log(`Does ${testFileNameAsync} exist asynchronously? ${existsAsync}`);
    return file.makeDir(testDirAsync);
  })
  .then(() => {
    console.log(`Created directory ${testDirAsync} asynchronously.`);
    return file.readDir('.');
  })
  .then(dirContentAsync => {
    console.log(`Directory content (async): ${dirContentAsync.join(', ')}`);
    const renamedFileNameAsync = 'renamed_test_async.txt';
    return file.rename(testFileNameAsync, renamedFileNameAsync)
      .then(() => renamedFileNameAsync); // Pass the new name down the chain
  })
  .then(renamedFileNameAsync => {
    console.log(`Renamed ${testFileNameAsync} to ${renamedFileNameAsync} asynchronously.`);
    return file.exists(testFileNameAsync)
      .then(existsOld => {
        console.log(`Does ${testFileNameAsync} exist after rename? ${existsOld}`);
        return file.exists(renamedFileNameAsync);
      })
      .then(existsNew => {
         console.log(`Does ${renamedFileNameAsync} exist after rename? ${existsNew}`);
         return file.stat(renamedFileNameAsync);
      })
      .then(statsAsync => {
         console.log(`Stat of ${renamedFileNameAsync} (async):`, statsAsync);
         return file.deleteFile(renamedFileNameAsync);
      });
  })
  .then(() => {
    console.log(`Deleted ${testFileNameAsync} asynchronously.`);
    return file.exists(testFileNameAsync);
  })
  .then(existsAfterDelete => {
     console.log(`Does ${testFileNameAsync} exist after deletion? ${existsAfterDelete}`);
     return file.removeDir(testDirAsync);
  })
  .then(() => {
     console.log(`Removed directory ${testDirAsync} asynchronously.`);
  })
  .catch(err => {
    console.error('Asynchronous file test failed:', err.message);
  });


// 3. Test the new 'store' module
console.log('\n--- Testing store module ---');
const store = env.use('store');

// Set values
store.set('user.profile.name', 'Alice');
store.set('user.profile.age', 30);
store.set('settings.theme', 'dark');
store.set('list[0]', 'first item'); // Test array-like keys
store.set('list[1]', 'second item');
store.set('nested.array[0].item', 'nested item');

// Get values
console.log('Store - User Name:', store.get('user.profile.name'));
console.log('Store - User Age:', store.get('user.profile.age', 'Not specified')); // Test default value
console.log('Store - App Theme:', store.get('settings.theme'));
console.log('Store - List item 0:', store.get('list[0]'));
console.log('Store - Nested array item:', store.get('nested.array[0].item'));
console.log('Store - Non-existent key:', store.get('non.existent.key', 'Default value'));

// Get all data
console.log('Store - All store data:', store.all());

// Delete a value
store.delete('user.profile.age');
console.log('Store - User Age after delete:', store.get('user.profile.age', 'Not specified'));
console.log('Store data after delete:', store.all());

// Test deleting a non-existent key
store.delete('non.existent.key');

// Test setting a value on a non-object path (should log error)
store.set('user.profile.name.first', 'Should fail');


// 4. Test the new 'scheduler' module
console.log('\n--- Testing scheduler module ---');
const scheduler = env.use('scheduler');

// Schedule a task every 3 seconds
console.log('Scheduling a task to run every 3 seconds...');
const taskId1 = scheduler.every('3s', () => {
  console.log('Scheduler: Task 1 (every 3s) is running!');
}, 'pingTask'); // Give it an ID

// Schedule a task once after 5 seconds
console.log('Scheduling a task to run once after 5 seconds...');
const taskId2 = scheduler.once('5s', () => {
  console.log('Scheduler: Task 2 (once after 5s) is running!');
}, 'singleRunTask'); // Give it an ID

// Schedule a task with numeric interval
const taskId3 = scheduler.every(2000, () => {
    console.log('Scheduler: Task 3 (every 2000ms) is running!');
}, 'numericTask');

// List scheduled tasks
console.log('Current scheduled tasks:', scheduler.list());

// Stop the first task after 7 seconds
setTimeout(() => {
  console.log('\nAttempting to stop Task 1...');
  const stopped = scheduler.stop(taskId1);
  console.log(`Task 1 stopped: ${stopped}`);
  console.log('Current scheduled tasks after stopping Task 1:', scheduler.list());
}, 7000); // Stop after 7 seconds

// Stop the third task after 8 seconds
setTimeout(() => {
    console.log('\nAttempting to stop Task 3...');
    const stopped = scheduler.stop(taskId3);
    console.log(`Task 3 stopped: ${stopped}`);
    console.log('Current scheduled tasks after stopping Task 3:', scheduler.list());
}, 8000);


// 5. Test the new 'http.fetch' functionality
console.log('\n--- Testing http.fetch ---');
const http = env.use('http');

// Using a public API endpoint for testing (e.g., JSONPlaceholder)
const testApiUrl = 'https://jsonplaceholder.typicode.com/posts/1';
const nonExistentApiUrl = 'https://jsonplaceholder.typicode.com/nonexistent';
const invalidUrl = 'invalid-url';

console.log(`Fetching data from: ${testApiUrl}`);
http.fetch(testApiUrl)
  .then(response => {
    console.log(`Fetch response status for ${testApiUrl}: ${response.status}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json(); // or response.text()
  })
  .then(data => {
    console.log('Fetched data (JSON):', data);
  })
  .catch(error => {
    console.error(`Fetch error for ${testApiUrl}:`, error.message);
  });

console.log(`Fetching from non-existent endpoint: ${nonExistentApiUrl}`);
http.fetch(nonExistentApiUrl)
  .then(response => {
    console.log(`Fetch response status for ${nonExistentApiUrl}: ${response.status}`);
    if (!response.ok) {
      // This is expected for a 404, so we catch it here
      console.warn(`Expected HTTP error for ${nonExistentApiUrl}: status ${response.status}`);
    }
    return response.text(); // Try reading as text
  })
   .then(text => {
       console.log(`Response body for ${nonExistentApiUrl}:`, text);
   })
  .catch(error => {
    console.error(`Fetch error for ${nonExistentApiUrl}:`, error.message);
  });

console.log(`Attempting to fetch from invalid URL: ${invalidUrl}`);
http.fetch(invalidUrl)
  .then(response => {
     console.log(`Fetch response status for ${invalidUrl}: ${response.status}`);
  })
  .catch(error => {
    console.error(`Fetch error for ${invalidUrl}:`, error.message); // Expecting an error here
  });


// 6. Test the new 'monitor' module
console.log('\n--- Testing monitor module (listening for events) ---');
const monitor = env.use('monitor');

monitor.on('memusage', (mem) => {
  // This event fires periodically (default 5s)
  console.log(`Monitor: Memory Usage - Free: ${(mem.free / 1024 / 1024).toFixed(2)}MB, Total: ${(mem.total / 1024 / 1024).toFixed(2)}MB, Percent: ${(mem.percent * 100).toFixed(2)}%`);
});

monitor.on('loadavg', (load) => {
  // This event fires periodically (default 5s)
  console.log(`Monitor: Load Average (1, 5, 15 min) - ${load.join(', ')}`);
});

monitor.on('error', (err) => {
  console.error('Monitor Error:', err.message);
});

// Note: The monitor runs in the background once initialized.
// You will see its output periodically as long as the script is running.


// 7. Test the new 'mock' module
console.log('\n--- Testing mock module ---');
const mock = env.use('mock');

// Test mocking a synchronous function
console.log('Testing synchronous function mock (file.readFileSync)...');
const originalFileContentSync = 'Original sync file content.';
file.writeFileSync('mock_sync_test.txt', originalFileContentSync);
console.log('Original sync file content:', file.readFileSync('mock_sync_test.txt'));

console.log('Mocking file.readFileSync...');
mock.mock('file.readFileSync', (filename, encoding) => {
  console.log(`(MOCK) Reading file synchronously: ${filename} (encoding: ${encoding})`);
  return `Mocked synchronous content for ${filename}`;
});

console.log('Reading file using mocked sync function:', file.readFileSync('mock_sync_test.txt'));
console.log('Is file.readFileSync mocked?', mock.isMocked('file.readFileSync'));
console.log('List of mocks:', mock.listMocks());

// Restore file.readFileSync
console.log('Restoring file.readFileSync...');
mock.restore('file.readFileSync');
console.log('Reading file using restored sync function:', file.readFileSync('mock_sync_test.txt'));
console.log('Is file.readFileSync mocked after restore?', mock.isMocked('file.readFileSync'));
console.log('List of mocks after restore:', mock.listMocks());
file.deleteFileSync('mock_sync_test.txt'); // Clean up


// Test mocking an asynchronous function
console.log('\nTesting asynchronous function mock (file.readFile)...');
const originalFileContentAsync = 'Original async file content.';
file.writeFile('mock_async_test.txt', originalFileContentAsync)
    .then(() => file.readFile('mock_async_test.txt'))
    .then(content => console.log('Original async file content:', content));

console.log('Mocking file.readFile...');
mock.mock('file.readFile', (filename, encoding) => {
    console.log(`(MOCK) Reading file asynchronously: ${filename} (encoding: ${encoding})`);
    return Promise.resolve(`Mocked asynchronous content for ${filename}`);
});

file.readFile('mock_async_test.txt')
    .then(content => console.log('Reading file using mocked async function:', content))
    .then(() => {
        console.log('Is file.readFile mocked?', mock.isMocked('file.readFile'));
        console.log('List of mocks:', mock.listMocks());
        console.log('Restoring file.readFile...');
        mock.restore('file.readFile');
        console.log('Is file.readFile mocked after restore?', mock.isMocked('file.readFile'));
        console.log('List of mocks after restore:', mock.listMocks());
        return file.readFile('mock_async_test.txt');
    })
    .then(content => console.log('Reading file using restored async function:', content))
    .then(() => file.deleteFile('mock_async_test.txt')) // Clean up
    .catch(err => console.error('Asynchronous mock test failed:', err.message));


// Test mocking http.fetch
console.log('\nTesting http.fetch mock...');
console.log('Original fetch call (should hit real API):');
http.fetch('https://jsonplaceholder.typicode.com/posts/2')
    .then(res => res.json())
    .then(data => console.log('Original fetch result:', data))
    .catch(err => console.error('Original fetch error:', err.message));

console.log('Mocking http.fetch...');
mock.mock('http.fetch', (url, options) => {
    console.log(`(MOCK) Fetching URL: ${url} with options:`, options);
    // Simulate a fetch Response object
    const mockResponse = {
        ok: true,
        status: 200,
        statusText: 'OK (Mocked)',
        headers: { 'Content-Type': 'application/json' },
        text: () => Promise.resolve(JSON.stringify({ mocked: true, url: url, method: options.method || 'GET' })),
        json: () => Promise.resolve({ mocked: true, url: url, method: options.method || 'GET' }),
    };
    return Promise.resolve(mockResponse);
});

console.log('Fetch call using mocked function:');
http.fetch('https://api.example.com/some/endpoint', { method: 'POST', body: 'test' })
    .then(res => res.json())
    .then(data => console.log('Mocked fetch result:', data))
    .catch(err => console.error('Mocked fetch error:', err.message));

console.log('Is http.fetch mocked?', mock.isMocked('http.fetch'));

// Restore http.fetch
console.log('Restoring http.fetch...');
mock.restore('http.fetch');
console.log('Is http.fetch mocked after restore?', mock.isMocked('http.fetch'));

console.log('Fetch call after restore (should hit real API again):');
http.fetch('https://jsonplaceholder.typicode.com/posts/3')
    .then(res => res.json())
    .then(data => console.log('Restored fetch result:', data))
    .catch(err => console.error('Restored fetch error:', err.message));


// Test restoring all mocks
console.log('\nMocking a few functions for testing restoreAll...');
mock.mock('os.platform', () => '(MOCKED) Test OS');
mock.mock('process.cwd', () => '(MOCKED) /mocked/cwd');
console.log('os.platform() is mocked:', mock.isMocked('os.platform'));
console.log('process.cwd() is mocked:', mock.isMocked('process.cwd'));
console.log('List of mocks:', mock.listMocks());

console.log('Restoring all mocks...');
mock.restore(); // Restore all
console.log('os.platform() is mocked after restoreAll:', mock.isMocked('os.platform'));
console.log('process.cwd() is mocked after restoreAll:', mock.isMocked('process.cwd'));
console.log('List of mocks after restoreAll:', mock.listMocks());
console.log('os.platform() after restoreAll:', osInfo.platform());
console.log('process.cwd() after restoreAll:', processInfo.cwd());


// 8. Test the new 'plugin' module
console.log('\n--- Testing plugin module ---');
const plugin = env.use('plugin');

// Register a custom module
console.log('Registering custom "math" module...');
try {
    plugin.register('math', {
      square: (n) => n * n,
      add: (a, b) => a + b,
      subtract: (a, b) => a - b
    });
    console.log('"math" module registered successfully.');
} catch (err) {
    console.error('Error registering "math" module:', err.message);
}


// Use the custom module
try {
    const math = env.use('math');
    console.log('Using custom math module: 5 squared is', math.square(5));
    console.log('Using custom math module: 10 + 3 is', math.add(10, 3));
} catch (err) {
    console.error('Error using "math" module:', err.message);
}

console.log('Available modules after plugin registration:', env.availableModules());

// Attempt to register a module with an existing name (should throw error)
console.log('Attempting to register "file" module again (should fail)...');
try {
    plugin.register('file', { dummy: true });
} catch (err) {
    console.error('Caught expected error when registering existing module:', err.message);
}


// 9. Test the new 'loader' functionality (alias on env object)
console.log('\n--- Testing loader functionality ---');
try {
    const { file: loadedFile, os: loadedOs, math: loadedMath } = env.load(['file', 'os', 'math']);

    console.log('Loaded modules using env.load():');
    console.log('  Platform from loaded os:', loadedOs.platform());
    // Note: Reading test file using loaded file module will likely fail if the async tests haven't finished deleting it
    // console.log('  Reading test file using loaded file module:', loadedFile.readFileSync('test_envjs_sync.txt'));
    console.log('  Using loaded math module: 7 - 3 is', loadedMath.subtract(7, 3));

} catch (err) {
    console.error('Error using env.load():', err.message);
}

// Test loading non-existent module (should throw error)
console.log('Attempting to load non-existent module (should fail)...');
try {
    env.load(['nonexistentmodule']);
} catch (err) {
    console.error('Caught expected error when loading non-existent module:', err.message);
}


// 10. Test other core modules (crypto, dns, net, stream, zlib, url, querystring, events)
console.log('\n--- Testing other core modules (crypto, dns, net, stream, zlib, url, querystring, events) ---');

const crypto = env.use('crypto');
const dns = env.use('dns');
const net = env.use('net');
const stream = env.use('stream');
const zlib = env.use('zlib');
const url = env.use('url');
const querystring = env.use('querystring');
const events = env.use('events');

// Crypto tests
console.log('Crypto - Random bytes (16):', crypto.randomBytes(16).toString('hex'));
const hash = crypto.createHash('sha256');
hash.update('hello world');
console.log('Crypto - SHA256 hash of "hello world":', hash.digest('hex'));
const hmac = crypto.createHmac('sha256', 'a-secret-key');
hmac.update('hello world');
console.log('Crypto - HMAC-SHA256 of "hello world":', hmac.digest('hex'));


// DNS tests (async)
console.log('\nDNS - Lookup async "google.com"...');
dns.lookupAsync('google.com')
    .then(result => console.log('DNS - Lookup result:', result))
    .catch(err => console.error('DNS - Lookup error:', err.message));

console.log('DNS - Resolve async "google.com" (MX records)...');
dns.resolveAsync('google.com', 'MX')
    .then(records => console.log('DNS - MX records:', records))
    .catch(err => console.error('DNS - Resolve MX error:', err.message));

// DNS tests (callback)
console.log('\nDNS - Lookup callback "nodejs.org"...');
dns.lookup('nodejs.org', (err, address, family) => {
    if (err) {
        console.error('DNS - Lookup callback error:', err.message);
    } else {
        console.log(`DNS - Lookup callback result: ${address} (Family: IPv${family})`);
    }
});

console.log('DNS - Resolve callback "nodejs.org" (A records)...');
dns.resolve('nodejs.org', 'A', (err, records) => {
    if (err) {
        console.error('DNS - Resolve callback A error:', err.message);
    } else {
        console.log('DNS - A records:', records);
    }
});


// Net tests (basic server/client - requires manual setup or mocking for full test)
// This is a basic example, setting up actual network connections requires more context
console.log('\nNet - Basic server creation (listening on default port)...');
try {
    const server = net.createServer((socket) => {
        console.log('Net - Client connected.');
        socket.on('end', () => {
            console.log('Net - Client disconnected.');
        });
        socket.write('Hello from server!\r\n');
        socket.pipe(socket);
    });
    // server.listen(0); // Listen on a random available port for testing
    console.log('Net - Server created.');
    // server.close(); // Close the server after a short delay if not doing full network test
} catch (err) {
    console.error('Net - Server creation error:', err.message);
}


// Stream tests (basic piping - requires readable/writable streams)
console.log('\nStream - Testing pipelineAsync (requires streams)...');
// Example using dummy streams (requires more complex setup for real test)
// const { Readable, Writable } = stream;
// const readableStream = new Readable({ read() {} });
// const writableStream = new Writable({ write(chunk, encoding, callback) { console.log('Stream - Received chunk:', chunk.toString()); callback(); } });
// readableStream.push('hello');
// readableStream.push('world');
// readableStream.push(null); // End the stream
// stream.pipelineAsync(readableStream, writableStream)
//     .then(() => console.log('Stream - Pipeline finished successfully.'))
//     .catch(err => console.error('Stream - Pipeline failed:', err.message));


// Zlib tests (async)
console.log('\nZlib - Gzip async...');
const inputData = 'This is some data to compress.';
zlib.gzipAsync(inputData)
    .then(compressedData => {
        console.log('Zlib - Gzip async compressed data (Buffer):', compressedData);
        return zlib.gunzipAsync(compressedData);
    })
    .then(decompressedData => {
        console.log('Zlib - Gunzip async decompressed data (string):', decompressedData.toString());
    })
    .catch(err => console.error('Zlib - Async compression/decompression error:', err.message));

// Zlib tests (callback)
console.log('\nZlib - Deflate callback...');
zlib.deflate('Callback deflate data.', (err, compressedData) => {
    if (err) {
        console.error('Zlib - Deflate callback error:', err.message);
    } else {
        console.log('Zlib - Deflate callback compressed data (Buffer):', compressedData);
        zlib.inflate(compressedData, (err, decompressedData) => {
            if (err) {
                 console.error('Zlib - Inflate callback error:', err.message);
            } else {
                 console.log('Zlib - Inflate callback decompressed data (string):', decompressedData.toString());
            }
        });
    }
});


// URL tests
console.log('\nURL - Parsing "http://example.com/path?query=string#hash"...');
const parsedUrl = url.parse('http://example.com/path?query=string#hash', true);
console.log('URL - Parsed URL:', parsedUrl);
console.log('URL - Formatting parsed URL:', url.format(parsedUrl));
console.log('URL - Resolving "/another/path" relative to "http://example.com/path":', url.resolve('http://example.com/path', '/another/path'));
const whatwgUrl = new url.URL('https://www.example.com/foo?bar=baz');
console.log('URL - WHATWG URL object:', whatwgUrl);


// Querystring tests
console.log('\nQuerystring - Parsing "foo=bar&baz=qux"...');
const parsedQs = querystring.parse('foo=bar&baz=qux');
console.log('Querystring - Parsed:', parsedQs);
console.log('Querystring - Stringifying { a: 1, b: [2, 3] }:', querystring.stringify({ a: 1, b: [2, 3] }));


// Events tests
console.log('\nEvents - Testing EventEmitter...');
const emitter = events.createEmitter();
emitter.on('testEvent', (arg1, arg2) => {
    console.log('Events - testEvent received:', arg1, arg2);
});
console.log('Events - Emitting testEvent...');
emitter.emit('testEvent', 'hello', 123);


// 11. Test $ (Async Shell Commands)
console.log('\n--- Testing $ (Async Shell Commands) ---');
(async () => {
  try {
    const echoOutput = await env.$`echo Hello from env.$`;
    console.log('$ - Echo command stdout:', echoOutput.stdout.trim());

    // Test with a command that might produce stderr (e.g., listing a non-existent file)
    // Note: Behavior of stderr can vary. Some commands output to stdout even for errors.
    const lsError = await env.$`ls non_existent_file_for_test_stderr`;
    if (lsError.stderr) {
      console.log('$ - ls non_existent_file_for_test_stderr stderr:', lsError.stderr.trim());
    }
    // Depending on the shell, `ls` for a non-existent file might still exit with 0
    // and print to stderr or stdout. This test is more about capturing output.
  } catch (error) {
    // This catch block will trigger if execAsync itself throws (e.g., command not found, or exit code is non-zero depending on shell options)
    console.error('$ - Error executing command:', error.message);
    if (error.stderr) {
        console.error('$ - Command stderr:', error.stderr.trim());
    }
    if (error.stdout) {
        console.error('$ - Command stdout (on error):', error.stdout.trim());
    }
  }
})();

// 12. Test env.state alias
console.log('\n--- Testing env.state alias ---');
env.state.set('aliasTest.data', 'Data set via env.state');
console.log('env.state - Get data:', env.state.get('aliasTest.data'));
console.log('env.state - All data after alias set:', env.state.all());
env.state.delete('aliasTest.data');
console.log('env.state - Data after delete:', env.state.get('aliasTest.data', 'Default if not found'));


// 13. Test env.schedule() alias
console.log('\n--- Testing env.schedule() alias ---');
const scheduleAliasId = env.schedule('*/1 * * * *', () => { // Simplified cron: runs if minute matches
  console.log('Scheduler (env.schedule alias): Task is running!');
}, 'aliasScheduleTask');
console.log(`env.schedule - Scheduled task with ID: ${scheduleAliasId}. Will run based on (simplified) cron.`);
// Allow it to run once or twice, then stop it later in the script if needed.


// 14. Test Task Runner (env.task and env.tasks)
console.log('\n--- Testing Task Runner (env.task and env.tasks) ---');

// Define tasks using env.task()
env.task('simpleTask', async () => {
  console.log('Task Runner: simpleTask is running.');
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate async work
  return 'simpleTask completed';
});

env.task('taskWithArgs', async (arg1, arg2 = 'default') => {
  console.log(`Task Runner: taskWithArgs running with: ${arg1}, ${arg2}`);
  return `Received: ${arg1}, ${arg2}`;
});

env.task('errorTask', async () => {
  console.log('Task Runner: errorTask is running and will throw an error.');
  throw new Error('Intentional error from errorTask');
});

(async () => {
  // List tasks using env.tasks.list()
  console.log('Task Runner - Available tasks:', env.tasks.list());

  // Run tasks using env.tasks.run()
  try {
    const simpleResult = await env.tasks.run('simpleTask');
    console.log('Task Runner - simpleTask result:', simpleResult);

    const argsResult = await env.tasks.run('taskWithArgs', 'hello', 'world');
    console.log('Task Runner - taskWithArgs result:', argsResult);

    const defaultArgResult = await env.tasks.run('taskWithArgs', 'onlyOne');
    console.log('Task Runner - taskWithArgs (default) result:', defaultArgResult);

    console.log('Task Runner - Attempting to run errorTask...');
    await env.tasks.run('errorTask');
  } catch (error) {
    console.error('Task Runner - Caught error from errorTask:', error.message);
  }

  // Test running a non-existent task
  try {
    console.log('Task Runner - Attempting to run nonExistentTask...');
    await env.tasks.run('nonExistentTask');
  } catch (error) {
    console.error('Task Runner - Caught expected error for nonExistentTask:', error.message);
  }

  // Schedule a task using env.tasks.schedule()
  const taskScheduleId = env.tasks.schedule('simpleTask', '*/2 * * * *', 'scheduledSimpleTask'); // Simplified cron
  console.log(`Task Runner - Scheduled 'simpleTask' (ID: ${taskScheduleId}). Will run based on (simplified) cron.`);

  // Attempt to schedule a non-existent task
  try {
    console.log('Task Runner - Attempting to schedule nonExistentTaskForScheduling...');
    env.tasks.schedule('nonExistentTaskForScheduling', '* * * * *');
  } catch (error) {
    console.error('Task Runner - Caught expected error for scheduling nonExistentTask:', error.message);
  }
})();


// 15. Test DB Module
(async () => {
  console.log('\n--- Testing DB Module ---');
  const env = envjs(); // Ensure env is scoped for this async test block if not already global

  // Get a collection
  const users = env.db.collection('users');
  const posts = env.db.collection('Posts'); // Test case-insensitivity for collection name

  // Clear existing data from previous runs (optional)
  console.log('DB: Clearing existing test collections...');
  users.clear();
  posts.clear();
  console.log('DB: Users count after clear:', users.count());
  console.log('DB: Posts count after clear:', posts.count());

  // Insert documents
  console.log('\nDB: Inserting documents...');
  const alice = users.insert({ name: 'Alice', age: 30, city: 'New York', tags: ['dev', 'js'] });
  const bob = users.insert({ name: 'Bob', age: 24, city: 'London', tags: ['dev', 'python'] });
  const charlie = users.insert({ name: 'Charlie', age: 35, city: 'New York', tags: ['qa', 'js'] });
  console.log('DB: Inserted Alice:', alice);
  console.log('DB: Inserted Bob:', bob);

  // Insert multiple
  const moreUsers = users.insert([
    { name: 'David', age: 24, city: 'Paris', tags: ['dev', 'go'] },
    { name: 'Eve', age: 30, city: 'Berlin', tags: ['pm', 'js'] }
  ]);
  console.log('DB: Inserted multiple users:', moreUsers);
  console.log('DB: Total users count:', users.count());

  // Find documents
  console.log('\nDB: Finding documents...');
  const allUsers = users.find();
  console.log('DB: All users:', allUsers);

  const usersInNewYork = users.find({ city: 'New York' });
  console.log('DB: Users in New York:', usersInNewYork);

  const devsAge30 = users.find({ age: 30, tags: ['dev', 'js'] });
  console.log('DB: Devs aged 30 with exact tags [dev, js]:', devsAge30);

  // Find one document
  console.log('\nDB: Finding one document...');
  const firstBob = users.findOne({ name: 'Bob' });
  console.log('DB: Found Bob:', firstBob);

  const nonExistent = users.findOne({ name: 'Zoe' });
  console.log('DB: Found Zoe (non-existent):', nonExistent);

  // Update documents
  console.log('\nDB: Updating documents...');
  const bobUpdate = users.update({ name: 'Bob' }, { age: 25, status: 'active' });
  console.log('DB: Bob update result:', bobUpdate);
  console.log('DB: Updated Bob:', users.findOne({ _id: bob._id }));

  const nyUpdate = users.update({ city: 'New York' }, { region: 'East Coast' }, { multi: true });
  console.log('DB: New York update result:', nyUpdate);
  users.find({ city: 'New York' }).forEach(u => console.log('DB: NY User after region update:', u));

  const charlieId = charlie._id;
  const charlieFuncUpdate = users.update(
    { _id: charlieId },
    (doc) => {
      doc.age += 1;
      doc.status = 'active';
      doc.tags.push('lead');
      return doc;
    }
  );
  console.log('DB: Charlie functional update result:', charlieFuncUpdate);
  console.log('DB: Updated Charlie:', users.findOne({ _id: charlieId }));

  console.log('\nDB: Testing upsert...');
  const zoeUpsert = users.update({ name: 'Zoe' }, { age: 28, city: 'Madrid', tags: ['new'] }, { upsert: true });
  console.log('DB: Zoe upsert result:', zoeUpsert);
  console.log('DB: Zoe after upsert:', users.findOne({ name: 'Zoe' }));

  const davidUpsertExisting = users.update({ name: 'David' }, { age: 25 }, { upsert: true });
  console.log('DB: David upsert (existing) result:', davidUpsertExisting);
  console.log('DB: David after upsert (age should be 25):', users.findOne({ name: 'David' }));

  console.log('\nDB: Counting documents...');
  console.log('DB: Total users:', users.count());
  console.log('DB: Users in Paris:', users.count({ city: 'Paris' }));
  console.log('DB: Active users:', users.count({ status: 'active' }));

  console.log('\nDB: Removing documents...');
  const removeBobResult = users.remove({ name: 'Bob' });
  console.log('DB: Remove Bob result:', removeBobResult);
  console.log('DB: Bob exists after remove?', !!users.findOne({ name: 'Bob' }));
  console.log('DB: Users count after Bob removal:', users.count());

  const removeParisResult = users.remove({ city: 'Paris' }, { multi: true });
  console.log('DB: Remove Paris users result:', removeParisResult);
  console.log('DB: Paris users count after removal:', users.count({city: 'Paris'}));

  console.log('\nDB: Clearing "posts" collection...');
  posts.insert({ title: 'A post to be cleared' });
  console.log('DB: Posts count before clear:', posts.count());
  const clearResult = posts.clear();
  console.log('DB: Clear posts result:', clearResult);
  console.log('DB: Posts count after clear:', posts.count());

  // Test inserting non-object
  console.log('\nDB: Testing inserting non-object...');
  const invalidInsert = users.insert(123);
  console.log('DB: Result of inserting number:', invalidInsert);
  const invalidInsertNull = users.insert(null);
  console.log('DB: Result of inserting null:', invalidInsertNull);
  console.log('DB: Users count after invalid inserts:', users.count());

  // Test find with empty query and no query
  console.log('\nDB: Testing find with empty/no query...');
  console.log('DB: users.find({}):', users.find({}).length);
  console.log('DB: users.find():', users.find().length);

  // Test findOne with empty query and no query
  console.log('DB: users.findOne({}):', users.findOne({}));
  console.log('DB: users.findOne():', users.findOne());

  console.log('\n--- DB Module Test Finished within test.js ---');
})().catch(err => console.error('DB Test Block Error:', err));


// Keep the process alive for a bit to let scheduled tasks and monitor run
// In a real application, your server or other logic would keep the process running.
// For this test script, we'll use a long timeout.
const keepAliveDuration = 20000; // 20 seconds
console.log(`\nKeeping test script alive for ${keepAliveDuration / 1000} seconds to observe background tasks (scheduler, monitor, scheduled tasks).`);

// Example of stopping a scheduled task after some time:
setTimeout(() => {
  if (scheduleAliasId) {
    console.log(`\nStopping env.schedule alias task: ${scheduleAliasId}`);
    env.use('scheduler').stop(scheduleAliasId);
  }
  const scheduledSimpleTaskFromList = env.use('scheduler').list().find(id => id.includes('scheduledSimpleTask'));
  if (scheduledSimpleTaskFromList) {
      console.log(`Stopping env.tasks.schedule task: ${scheduledSimpleTaskFromList}`);
      env.use('scheduler').stop(scheduledSimpleTaskFromList);
  }
  console.log('Current scheduled tasks after cleanup attempts:', env.use('scheduler').list());
}, keepAliveDuration - 5000); // Stop them 5 seconds before script ends

setTimeout(() => {
  console.log('\n--- envjs Comprehensive Test Finished ---');
  // You might want to explicitly exit if the monitor or other background tasks are running indefinitely
  // process.exit(0);
}, keepAliveDuration);
