function domPromise<T>(elem: () => T): Promise<T> {
	return new Promise((resolve) => {
		if (window.location.hostname === 'neal.fun' && window.location.pathname === '/stimulation-clicker/') {
			if (document.readyState === 'interactive') {
				resolve(elem());
			} else {
				window.addEventListener(
					'DOMContentLoaded',
					() => {
						resolve(elem());
					},
					{ once: true },
				);
			}
		} else {
			resolve(null);
		}
	});
}

const container: Promise<HTMLDivElement> = domPromise(() => document.querySelector('.container'));

export const dom = {
	container,
};
