import { state } from '../data/state';

async function startLiveSplit() {
	const livesplitServer = new WebSocket('ws://127.0.0.1:16834/livesplit');
	livesplitServer.onopen = () => {
		livesplitServer.send('reset');
	};

	function getSplitIndex(): Promise<number> {
		return new Promise((resolve) => {
			livesplitServer.onmessage = (event) => {
				livesplitServer.onmessage = null;
				resolve(parseInt(event.data));
			};
			livesplitServer.send('getsplitindex');
		});
	}

	async function split(splitTo: number) {
		let splitIndex = await getSplitIndex();
		for (let i = Math.max(splitIndex, 0); i < splitTo; i++) {
			livesplitServer.send('skipsplit');
			splitIndex++;
		}
		if (splitIndex === splitTo) livesplitServer.send('split');
	}

	const vueState = await state;

	// When stimulation is first shown, start the timer
	const { set: showStimulationSetter } = Object.getOwnPropertyDescriptor(vueState, 'showStimulation');
	Object.defineProperty(vueState, 'showStimulation', {
		set(showStimulation) {
			if (!vueState.showStimulation && showStimulation) livesplitServer.send('starttimer');
			return showStimulationSetter.call(this, showStimulation);
		},
		configurable: true,
		enumerable: true,
	});

	// When Hydraulic Press is purchased, split to index 0
	const { set: showHydraulicPressSetter } = Object.getOwnPropertyDescriptor(vueState, 'showHydraulicPress');
	Object.defineProperty(vueState, 'showHydraulicPress', {
		set(showHydraulicPress) {
			if (!vueState.showHydraulicPress && showHydraulicPress) split(0);
			return showHydraulicPressSetter.call(this, showHydraulicPress);
		},
		configurable: true,
		enumerable: true,
	});

	// When Levels is purchased, split to index 1
	const { set: showLevelsSetter } = Object.getOwnPropertyDescriptor(vueState, 'showLevels');
	Object.defineProperty(vueState, 'showLevels', {
		set(showLevels) {
			if (!vueState.showLevels && showLevels) split(1);
			return showLevelsSetter.call(this, showLevels);
		},
		configurable: true,
		enumerable: true,
	});

	// When Stock Market is purchased, split to index 2
	const { set: showStockMarketSetter } = Object.getOwnPropertyDescriptor(vueState, 'showStockMarket');
	Object.defineProperty(vueState, 'showStockMarket', {
		set(showStockMarket) {
			if (!vueState.showStockMarket && showStockMarket) split(2);
			return showStockMarketSetter.call(this, showStockMarket);
		},
		configurable: true,
		enumerable: true,
	});

	// When Email is purchased, split to index 3
	const { set: inboxUnlockedSetter } = Object.getOwnPropertyDescriptor(vueState, 'inboxUnlocked');
	Object.defineProperty(vueState, 'inboxUnlocked', {
		set(inboxUnlocked) {
			if (!vueState.inboxUnlocked && inboxUnlocked) split(3);
			return inboxUnlockedSetter.call(this, inboxUnlocked);
		},
		configurable: true,
		enumerable: true,
	});

	// When Crypto is purchased, split to index 4
	const { set: cryptoUnlockedSetter } = Object.getOwnPropertyDescriptor(vueState, 'cryptoUnlocked');
	Object.defineProperty(vueState, 'cryptoUnlocked', {
		set(cryptoUnlocked) {
			if (!vueState.cryptoUnlocked && cryptoUnlocked) split(4);
			return cryptoUnlockedSetter.call(this, cryptoUnlocked);
		},
		configurable: true,
		enumerable: true,
	});

	// When Leverage is purchased, split to index 5
	const { set: stockLeverageSetter } = Object.getOwnPropertyDescriptor(vueState, 'stockLeverage');
	Object.defineProperty(vueState, 'stockLeverage', {
		set(stockLeverage) {
			if (vueState.stockLeverage === 1 && stockLeverage === 2) split(5);
			return stockLeverageSetter.call(this, stockLeverage);
		},
		configurable: true,
		enumerable: true,
	});

	// When Subway Surfers Wormhole is purchased, split to index 6
	vueState.startWormhole = new Proxy(vueState.startWormhole, {
		apply: (target, thisArg, argsList) => {
			split(6);
			return Reflect.apply(target, thisArg, argsList);
		},
	});

	// When Go to the Ocean is purchased, split to index 7
	vueState.endGame = new Proxy(vueState.endGame, {
		apply: (target, thisArg, argsList) => {
			split(7);
			return Reflect.apply(target, thisArg, argsList);
		},
	});
}

if (window.location.hostname === 'neal.fun' && window.location.pathname === '/stimulation-clicker/') {
	if (document.readyState === 'complete') {
		startLiveSplit();
	} else {
		window.addEventListener('load', startLiveSplit, { once: true });
	}
}
