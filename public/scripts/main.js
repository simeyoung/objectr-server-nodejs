// @ts-nocheck
(function() {
	const socket = io.connect('http://localhost:5600');
	socket.on('image', data => {
		const frame = document.getElementById('video');
		frame.src = 'data:image/jpeg;base64,' + data;
	});

	socket.on('objDetected', objs => {
		const h1 = document.getElementById('objdetects');

		if (!objs) {
			h1.innerHTML = '';
			return;
		}

		const objMerged = mergeArray(JSON.parse(objs));

		let col = '';

		for (let i = 0; i < objMerged.length; i++) {
			col += `
				<div class="p-2">
					<h1>
					${getIcon(objMerged[i])}  ${getCount(objMerged[i])} ${getName(objMerged[i])}
					</h1>
				</div>
			`;
		}

		h1.innerHTML /*+*/ = col;
	});

	function getIcon(value) {
		return icon[value.name];
	}

	function getName(value) {
		return value.count == 1
			? ita[value.name].single
			: ita[value.name].plural;
	}

	function getCount(value) {
		return value.count == 1 ? '' : value.count;
	}

	function mergeArray(arr) {
		let res = [];
		for (let i = 0; i < arr.length; i++) {
			let count = 1;
			// const lngth = arr.length - i;
			for (var j = i + 1; j < arr.length; ++j) {
				if (arr[i] == arr[j]) {
					count++;
					arr.splice(j--, 1);
				}
			}

			res.push({ name: arr[i], count: count });
		}

		return res;
	}

	const ita = {
		background: { single: 'sfondo', plural: 'sfondi' },
		person: { single: 'persona', plural: 'persone' },
		bicycle: { single: 'bicicletta', plural: 'biciclette' },
		car: { single: 'macchina', plural: 'macchine' },
		motorcycle: { single: 'motocicletta', plural: 'motociclette' },
		airplane: { single: 'aereo', plural: 'aeri' },
		bus: { single: 'bus', plural: 'bus' },
		train: { single: 'treno', plural: 'treni' },
		truck: { single: 'camion', plural: 'camion' },
		boat: { single: 'barca', plural: 'barche' },
		'traffic light': { single: 'semaforo', plural: 'semafori' },
		'fire hydrant': { single: '', plural: '' },
		'stop sign': { single: 'segnale stop', plural: 'segnali stop' },
		'parking meter': { single: '', plural: '' },
		bench: { single: '', plural: '' },
		bird: { single: 'uccello', plural: 'uccelli' },
		cat: { single: 'gatto', plural: 'gatti' },
		dog: { single: 'cane', plural: 'cani' },
		horse: { single: 'cavallo', plural: 'cavalli' },
		sheep: { single: 'pecora', plural: 'pecore' },
		cow: { single: 'mucca', plural: 'mucche' },
		elephant: { single: 'elefante', plural: 'elefanti' },
		bear: { single: 'orso', plural: 'orsi' },
		zebra: { single: 'zebra', plural: 'zebre' },
		giraffe: { single: 'giraffa', plural: 'giraffe' },
		backpack: { single: '', plural: '' },
		umbrella: { single: 'ombrello', plural: 'ombrelli' },
		handbag: { single: 'borsetta', plural: 'borsette' },
		tie: { single: 'cravatta', plural: 'cravatte' },
		suitcase: { single: 'valigia', plural: 'valigie' },
		frisbee: { single: 'frisbee', plural: 'frisbee' },
		skis: { single: 'sci', plural: 'scii' },
		snowboard: { single: 'snowboard', plural: 'snowboard' },
		'sports ball': { single: 'pallone', plural: 'palloni' },
		kite: { single: 'tavola', plural: 'tavole' },
		'baseball bat': {
			single: 'mazza da baseball',
			plural: 'mazze da baseball'
		},
		'baseball glove': { single: '', plural: '' },
		skateboard: { single: 'skateboard', plural: 'skateboard' },
		surfboard: { single: 'surfboard', plural: 'surfboard' },
		'tennis racket': { single: 'racchetta', plural: 'racchette' },
		bottle: { single: 'bottiglia', plural: 'bottiglie' },
		'wine glass': {
			single: 'bicchiere di vino',
			plural: 'bicchieri di vino'
		},
		cup: { single: 'tazza', plural: 'tazze' },
		fork: { single: 'forchetta', plural: 'forchette' },
		knife: { single: 'coltello', plural: 'coltelli' },
		spoon: { single: 'spugna', plural: 'spugne' },
		bowl: { single: 'ciotola', plural: 'ciotole' },
		banana: { single: 'banana', plural: 'banane' },
		apple: { single: 'mela', plural: 'mele' },
		sandwich: { single: 'sandwich', plural: 'sandwich' },
		orange: { single: 'aranciata', plural: 'aranciate' },
		broccoli: { single: 'broccoli', plural: 'broccoli' },
		carrot: { single: 'carota', plural: 'carote' },
		'hot dog': { single: 'hot dog', plural: 'hot dog' },
		pizza: { single: 'pizza', plural: 'pizza' },
		donut: { single: 'donut', plural: 'donut' },
		cake: { single: 'torta', plural: 'torte' },
		chair: { single: 'sedia', plural: 'sedie' },
		couch: { single: '', plural: '' },
		'potted plant': { single: '', plural: '' },
		bed: { single: 'letto', plural: 'letti' },
		'dining table': { single: '', plural: '' },
		toilet: { single: 'toilet', plural: 'toilet' },
		tv: { single: 'tv', plural: 'tv' },
		laptop: { single: 'computer', plural: 'computer' },
		mouse: { single: 'mouse', plural: 'mouse' },
		remote: { single: 'telecomando', plural: 'telecomandi' },
		keyboard: { single: 'tastiera', plural: 'tastiera' },
		'cell phone': { single: 'cellulare', plural: 'cellulari' },
		microwave: { single: 'micronde', plural: 'micronde' },
		oven: { single: '', plural: '' },
		toaster: { single: '', plural: '' },
		sink: { single: '', plural: '' },
		refrigerator: { single: '', plural: '' },
		book: { single: 'libro', plural: 'libri' },
		clock: { single: 'orologio', plural: 'orologi' },
		vase: { single: 'vaso', plural: 'vasi' },
		scissors: { single: 'forbice', plural: 'forbici' },
		'teddy bear': { single: 'orsetto', plural: 'orsetti' },
		'hair drier': { single: 'asciugacapelli', plural: 'asciugacapelli' },
		toothbrush: {
			single: 'spazzolino da denti',
			plural: 'spazzolino da denti'
		}
	};

	const icon = {
		background: '',
		person: '👨',
		bicycle: '🚲',
		car: '🚗',
		motorcycle: '🛵',
		airplane: '✈️',
		bus: '🚌',
		train: '🚂',
		truck: '🚚',
		boat: '🛥️',
		'traffic light': '🚦',
		'fire hydrant': '',
		'stop sign': '🛑',
		'parking meter': '',
		bench: '',
		bird: '🐦',
		cat: '🐈',
		dog: '🐕',
		horse: '🐎',
		sheep: '🐑',
		cow: '🐄',
		elephant: '🐘',
		bear: '🐻',
		zebra: '🦓',
		giraffe: '🦒',
		backpack: '🎒',
		umbrella: '☂️',
		handbag: '👜',
		tie: '👔',
		suitcase: '🧳',
		frisbee: '🥏',
		skis: '⛷️',
		snowboard: '🏂',
		'sports ball': '🏐',
		kite: '🪁',
		'baseball bat': '⚾',
		'baseball glove': '',
		skateboard: '🛹',
		surfboard: '🏄',
		'tennis racket': '',
		bottle: '🍾',
		'wine glass': '🍷',
		cup: '🥤',
		fork: '🍴',
		knife: '🔪',
		spoon: '🥄',
		bowl: '🥣',
		banana: '🍌',
		apple: '🍏',
		sandwich: '🥪',
		orange: '🍊',
		broccoli: '',
		carrot: '🥕',
		'hot dog': '🌭',
		pizza: '🍕',
		donut: '🍩',
		cake: '🍰',
		chair: '💺',
		couch: '🛋️',
		'potted plant': '',
		bed: '🛏️',
		'dining table': '',
		toilet: '🚽',
		tv: '📺',
		laptop: '💻',
		mouse: '🖱️',
		remote: '🎮',
		keyboard: '⌨️',
		'cell phone': '📱',
		microwave: '',
		oven: '',
		toaster: '',
		sink: '',
		refrigerator: '',
		book: '',
		clock: '⏰',
		vase: '🏺',
		scissors: '✂️',
		'teddy bear': '🧸🐻',
		'hair drier': '',
		toothbrush: ''
	};

	// Array.prototype.unique = function() {
	// 	let res = [];
	// 	var a = this.concat();
	// 	for (var i = 0; i < a.length; ++i) {
	// 		for (var j = i + 1; j < a.length; ++j) {
	// 			if (a[i] === a[j]) {
	// 				// a.splice(j--, 1);
	// 				res[i].count++;
	// 			} else {
	// 				res.push({ name: a, count: 1 });
	// 			}
	// 		}
	// 	}

	// 	return res;
	// };
})();
