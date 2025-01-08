if (window.location.hostname === 'neal.fun') {
	let finishedLoading = false;

	window.history.pushState = new Proxy(history.pushState, {
		apply: (target, thisArg, argsList) => {
			if (argsList[2] !== undefined && finishedLoading) {
				const newURL = new URL(argsList[2], document.baseURI);
				const isStimulationClicker = newURL.hostname === 'neal.fun' && newURL.pathname === '/stimulation-clicker/';
				if (isStimulationClicker) location.replace(newURL);
			}
			return Reflect.apply(target, thisArg, argsList);
		},
	});

	window.history.replaceState = new Proxy(history.replaceState, {
		apply: (target, thisArg, argsList) => {
			if (argsList[2] !== undefined && finishedLoading) {
				const newURL = new URL(argsList[2], document.baseURI);
				const isStimulationClicker = newURL.hostname === 'neal.fun' && newURL.pathname === '/stimulation-clicker/';
				if (isStimulationClicker) location.replace(newURL);
			}
			return Reflect.apply(target, thisArg, argsList);
		},
	});

	window.addEventListener('popstate', () => {
		if (finishedLoading) {
			const newURL = new URL(window.location.href);
			const isStimulationClicker = newURL.hostname === 'neal.fun' && newURL.pathname === '/stimulation-clicker/';
			if (isStimulationClicker) location.replace(newURL);
		}
	});

	if (document.readyState === 'interactive') {
		finishedLoading = true;
	} else {
		window.addEventListener(
			'DOMContentLoaded',
			() => {
				finishedLoading = true;
			},
			{ once: true },
		);
	}
}
