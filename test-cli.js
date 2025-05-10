#!/usr/bin/env node

import envjs from './index.js'; // Assuming index.js is in the same directory (env/)

const env = envjs();

// Set application info (optional but good for help messages)
env.cli.setAppInfo({
  name: 'envjs', // This will be the command name users type
  description: 'A versatile CLI tool powered by the envjs library.',
});

// --- Define Your CLI Commands Here ---

// Example: Greet command
env.cli.command(
  'greet',
  'Greets a person or the world.',
  {
    args: [{ name: 'personName', description: 'The name of the person to greet.' }],
    options: {
      times: { description: 'Number of times to greet.', alias: 't' },
      loud: { description: 'Greet loudly.', type: 'boolean', alias: 'l'}
    }
  },
  (cmdArgs) => {
    const name = cmdArgs.personName || 'World';
    const times = parseInt(cmdArgs.times || 1);

    for (let i = 0; i < times; i++) {
      let greeting = `Hello, ${name}!`;
      if (cmdArgs.loud) {
        greeting = greeting.toUpperCase();
      }
      console.log(greeting);
    }
  }
);

// Example: Add command
env.cli.command('add', 'Adds two numbers.', (cmdArgs) => {
  const num1 = parseFloat(cmdArgs._[0]); // Access positional args via _
  const num2 = parseFloat(cmdArgs._[1]);
  if (isNaN(num1) || isNaN(num2)) {
    console.error('Please provide two numbers to add.');
    process.exitCode = 1;
    return;
  }
  console.log(`Result: ${num1 + num2}`);
});

// Example: A command to show OS info
env.cli.command('osinfo', 'Displays basic OS information.', () => {
  const { platform, arch, totalmem, freemem } = env.use('os');
  console.log(`Platform: ${platform()}`);
  console.log(`Architecture: ${arch()}`);
  console.log(`Total Memory: ${(totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
  console.log(`Free Memory: ${(freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
});


// Command to run tasks from the Task Runner
env.cli.command(
    'run',
    'Runs a defined envjs task.',
    {
        args: [{ name: 'taskName', description: 'The name of the task to run.', required: true }]
        // Add options here if you want to pass them as named CLI options to the task
    },
    async (cmdArgs, options, rawPositionalArgs) => {
        const taskName = cmdArgs.taskName;
        // All further positional arguments are passed to the task
        const taskArgs = rawPositionalArgs.slice(1); 
        try {
            console.log(`CLI: Attempting to run task '${taskName}' with args: ${taskArgs.join(', ')}`);
            await env.tasks.run(taskName, ...taskArgs);
        } catch (error) {
            console.error(`CLI: Error running task '${taskName}':`, error.message);
            process.exitCode = 1;
        }
    }
);

// Define some sample tasks for the 'run' command to execute
env.task('helloTask', async (name = 'Task World') => {
    console.log(`[Task: helloTask] Hello, ${name}!`);
    await new Promise(r => setTimeout(r, 50)); 
    console.log('[Task: helloTask] Done.');
});

env.task('build', async () => {
    console.log('[Task: build] Starting build process...');
    // Simulate build steps
    await env.tasks.run('helloTask', 'Builder');
    console.log('[Task: build] Linting complete.');
    console.log('[Task: build] Tests passed.');
    console.log('[Task: build] Build finished successfully!');
});


// --- Default Handler ---
env.cli.default((cmdArgs, options, rawArgs) => {
  // Check if any arguments or meaningful options were passed
  const hasMeaningfulArgs = rawArgs.length > 0 || 
                           (Object.keys(options).length > 0 && !options.h && !options.help);

  if (!hasMeaningfulArgs) {
    console.log('No command specified. Showing help:');
    env.cli.run(['--help']); // Show general help
  } else {
    console.log('Default handler triggered with unhandled arguments/options:');
    if(rawArgs.length > 0) console.log('  Arguments:', rawArgs);
    if(Object.keys(options).length > 0) console.log('  Options:', options);
    console.log(`\nRun "${env.cli._commands().appName || 'envjs-tool'} --help" for available commands.`);
    process.exitCode = 1;
  }
});

// --- Run the CLI --- 
// This parses process.argv and executes the matched command/handler.
env.cli.run();