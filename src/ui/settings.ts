GM.registerMenuCommand('Toggle DVD Standardization', async () => {
	const dvdStandardization = await GM.getValue('dvdStandardization', true);
	GM.setValue('dvdStandardization', !dvdStandardization);
	if (dvdStandardization) alert('DVD Standardization has been turned OFF');
	if (!dvdStandardization) alert('DVD Standardization has been turned ON');
	location.reload();
});
