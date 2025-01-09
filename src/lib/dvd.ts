import { state } from '../data/state';

async function patchDVDs() {
	if (await GM.getValue('dvdStandardization', true)) {
		const vueState = await state;
		const bgState = vueState.$refs.bg;
		const renderer = bgState.$refs.renderer;

		renderer.style.width = '1920px';
		renderer.style.height = '1080px';
		renderer.style.position = 'fixed';
		renderer.style.top = '50%';
		renderer.style.left = '50%';
		renderer.style.transform = 'translate(-50%, -50%)';

		// We don't have direct access to updateDVDs as it's not part of vue data,
		// but we can set the size of the window to 1920x1080 before the dvd hits
		// calculation by setting them before the start of bgAnimationLoop, and
		// resetting them after the bgAnimationLoop function has executed.
		vueState.bgAnimationLoop = new Proxy(vueState.bgAnimationLoop, {
			apply: (target, thisArg, argsList) => {
				const realWidth = window.innerWidth;
				const realHeight = window.innerHeight;
				window.innerWidth = 1920;
				window.innerHeight = 1080;
				const returnValue = Reflect.apply(target, thisArg, argsList);
				window.innerWidth = realWidth;
				window.innerHeight = realHeight;
				return returnValue;
			},
		});
		// This is purely for the visuals, actually renders the DVDs at the size of the canvas (1920x1080)
		bgState.resize();
	}
}

if (window.location.hostname === 'neal.fun' && window.location.pathname === '/stimulation-clicker/') {
	if (document.readyState === 'complete') {
		patchDVDs();
	} else {
		window.addEventListener('load', patchDVDs, { once: true });
	}
}
