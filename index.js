const fs = require('fs');
const path = require('path');
// const express = require('express');
// const app = express();
// const server = require('http').createServer(app);
const io = require('socket.io')();
const classNames = require('./dnnTensorflowObjectDetectionClassNames');
const { cv, runVideoDetection } = require('./utils');

const PORT = 5600;

if (!cv.xmodules.dnn) {
	throw new Error('exiting: opencv4nodejs compiled without dnn module');
}

// replace with path where you unzipped detection model
const detectionModelPath = './data/dnn/tf-detection';

const pbFile = path.resolve(detectionModelPath, 'frozen_inference_graph.pb');
const pbtxtFile = path.resolve(
	detectionModelPath,
	'ssd_mobilenet_v2_coco_2018_03_29.pbtxt'
);

console.log(pbFile);
console.log(pbtxtFile);

if (!fs.existsSync(pbFile) || !fs.existsSync(pbtxtFile)) {
	console.log('could not find detection model');
	console.log(
		'download the model from: https://github.com/opencv/opencv/wiki/TensorFlow-Object-Detection-API#use-existing-config-file-for-your-model'
	);
	throw new Error('exiting');
}

// set webcam port
const webcamPort = 0;

// initialize tensorflow darknet model from modelFile
// @ts-ignore
const net = cv.readNetFromTensorflow(pbFile, pbtxtFile);

const classifyImg = async buffer => {
	// object detection model works with 300 x 300 images
	const size = new cv.Size(300, 300);
	const vec3 = new cv.Vec3(0, 0, 0);

	cv.imdecodeAsync(buffer).then(async img => {
		// network accepts blobs as input
		const inputBlob = cv.blobFromImage(img, 1, size, vec3, true, true);
		net.setInput(inputBlob);

		console.time('net.forward');
		// forward pass input through entire network, will return
		// classification result as 1x1xNxM Mat
		const outputBlob = net.forward();
		console.timeEnd('net.forward');

		// get height and width from the image
		const [imgHeight, imgWidth] = img.sizes;
		const numRows = outputBlob.sizes.slice(2, 3);

		let objdetects = [];

		// @ts-ignore
		for (let y = 0; y < numRows; y += 1) {
			const confidence = outputBlob.at([0, 0, y, 2]);
			if (confidence > 0.5) {
				const classId = outputBlob.at([0, 0, y, 1]);
				const className = classNames[classId];
				objdetects.push(className);
			}
		}

		// const encoded = cv.imencode('.jpg', img);
		// const base64 = encoded.toString('base64');
		// io.emit('image', base64);
		io.emit('objDetected', JSON.stringify(objdetects));
	});

	// cv.imshow('Temsorflow Object Detection', img);
};

// runVideoDetection(webcamPort, classifyImg);

async function initServerAsync() {
	console.log('[SERVER] server starting...');
	// app.use(express.static(__dirname + '/public'));
	// app.get('/', (req, res) => {
	// 	res.sendFile(path.join(__dirname, '/public/index.html'));
	// });

	// app.listen(PORT + 1);
	io.attach(PORT);
	io.on('connection', socket => {
		// socket.join('room1');
		console.log('connesso: ', socket.id);
		socket.on('imageToAnalyze', classifyImg);
		// socket.in('room1').on('imageToAnalyze', classifyImg);

		// socket.on('imageToAnalyze', buffer => {
		// 	const base64 = buffer.toString('base64');
		// 	io.emit('image', base64);
		// });
	});
	// TODO: Non funziona! capire il perchè
	// io.on('ping', () => console.log('ping'));
	// io.on('reconnecting', () => console.log('reconnecting'));
	// io.on('error', error => console.log('error', error));
	// io.on('connect_error', err => console.log('connect_error', err));
	// // server.listen(PORT);
	// // console.log(`[SERVER] started and listening on ${PORT} port`);

	// // io.on('image', data => onFrameAsync(data));
	// io.on('imageToAnalyze', () => console.log('data received'));
	// io.on('server-connected', res => console.log(res));
	// // console.log('[SOCKET] websocket started');
	// io.emit('socket-started', true);
}

initServerAsync();
