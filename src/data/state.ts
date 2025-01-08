import { dom } from './dom';
import { VirtualDOM } from './types';

function getVueState(container: HTMLDivElement, resolve: (value: unknown) => void) {
	if ((container as VirtualDOM<HTMLDivElement>).__vue__ !== undefined) {
		const vueState =
			(container as VirtualDOM<HTMLDivElement>).__vue__.stimulation === undefined ?
				(container as VirtualDOM<HTMLDivElement>).__vue__.$children.find((child) => child.stimulation !== undefined)
			:	(container as VirtualDOM<HTMLDivElement>).__vue__;
		resolve(vueState);
	} else {
		Object.defineProperty(container, '__vue__', {
			set(vueState) {
				if (vueState !== null) {
					resolve(vueState);
					Object.defineProperty(container, '__vue__', {
						value: vueState,
						writable: true,
						configurable: true,
						enumerable: true,
					});
				}
			},
			configurable: true,
			enumerable: true,
		});
	}
}

export const state: Promise<{
	showStimulation: boolean;
	showHydraulicPress: boolean;
	showLevels: boolean;
	showStockMarket: boolean;
	inboxUnlocked: boolean;
	cryptoUnlocked: boolean;
	stockLeverage: number;
	startWormhole: () => void;
	endGame: () => void;
}> = new Promise((resolve) => {
	if (window.location.hostname === 'neal.fun' && window.location.pathname === '/stimulation-clicker/') {
		if (document.readyState === 'complete') {
			dom.container.then(async (container) => getVueState(await container, resolve));
		} else {
			window.addEventListener(
				'load',
				() => {
					dom.container.then(async (container) => getVueState(await container, resolve));
				},
				{ once: true },
			);
		}
	} else {
		resolve(null);
	}
});
