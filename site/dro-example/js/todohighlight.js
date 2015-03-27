
if ('addEventListener' in window && 'querySelector' in document) {
	window.addEventListener('DOMContentLoaded', function() {
		var para, paras = document.querySelectorAll('.article-entry p');
		for (var i = 0; i < paras.length; i++) {
			para = paras[i];
			if ('textContent' in para) {
				if (para.textContent.indexOf('TODO') == 0) {
					para.setAttribute('style', 'background-color: #ffe; padding: 0.2em 0.5em; margin: -0.25em -0.5em; font-size: 90%; opacity: 0.8; font-style: italic');
				}
			}
		}
	});
}
