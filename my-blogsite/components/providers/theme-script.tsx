export function ThemeScript() {
	const script = `
		(function () {
			try {
				var saved = localStorage.getItem('lucid-theme');
				var dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
				document.documentElement.classList.toggle('dark', dark);
				document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
			} catch (_) {}
		})();
	`;

	return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
