//const Server = require('./server.js');
import Server from './server.js';

import { createProxyMiddleware } from 'http-proxy-middleware';
/**
 Initiate server instance when running project
 */
(() => {
	console.log("Starting server...");
	try {
		/**
		 * Server
		 * @type {Server}
		 */
		let server = new Server(process.argv.includes("d"));
		server.createApp();
		startPythonServer(server.app)
		return server;
	}catch (error) {
		throw error;
	}
})()

import { spawn } from 'child_process';

function startPythonServer(app) {
	// Start the Python Flask server
	const pythonProcess = spawn('python3', ['python/server.py']); // Adjust the path to your Python server script

	// Listen for Python server output
	pythonProcess.stdout.on('data', (data) => {
		console.log(`Python Server Output: ${data}`);
	});

	// Capture errors
	pythonProcess.stderr.on('data', (data) => {
		console.error(`Python Server Error: ${data}`);
	});

	// When the Python server exits
	pythonProcess.on('close', (code) => {
		console.log(`Python Server Process exited with code ${code}`);
	});

	process.on('exit', () => {
		pythonProcess.kill();
	});

	console.log('Python server started...');
	// redirect from local to python server
	app.use('/python', createProxyMiddleware({
		target: 'http://localhost:5000', // Python server
		changeOrigin: true,
		pathRewrite: {'^/python': ''}
	}));

}