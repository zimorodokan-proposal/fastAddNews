'use strict';

(function () {
	function addHTML (htmlString) {
		var parser = new DOMParser();
		var scriptRequest = new XMLHttpRequest();
		var styleRequest = new XMLHttpRequest();
		var doc = parser.parseFromString(htmlString, 'text/html');
		document.replaceChild(doc.documentElement, document.documentElement);

		function addScript () {
			var script = document.createElement('script');
			var scriptContent = scriptRequest.response.source;
			script.insertAdjacentHTML('beforeend', scriptContent);
			document.head.appendChild(script);
		}

		function addStyle () {
			var style = document.createElement('style');
			var styleContent = styleRequest.response.source;
			style.insertAdjacentHTML('beforeend', styleContent);
			document.head.appendChild(style);
		}

		styleRequest.addEventListener('load', addStyle);
		styleRequest.responseType = 'json';
		styleRequest.open('GET', 'https://ru.wikinews.org/w/rest.php/v1/page/%D0%A3%D1%87%D0%B0%D1%81%D1%82%D0%BD%D0%B8%D0%BA:Zimorodokan%2ffastAddNewsSourceCSS');
		styleRequest.send();

		scriptRequest.addEventListener('load', addScript);
		scriptRequest.responseType = 'json';
		scriptRequest.open('GET', 'https://ru.wikinews.org/w/rest.php/v1/page/%D0%A3%D1%87%D0%B0%D1%81%D1%82%D0%BD%D0%B8%D0%BA:Zimorodokan%2ffastAddNewsSourceJS');
		scriptRequest.send();
	}

	if (location.pathname == '/wiki/%D0%A3%D1%87%D0%B0%D1%81%D1%82%D0%BD%D0%B8%D0%BA:Zimorodokan/%D0%94%D0%9E%D0%91%D0%90%D0%92%D0%98%D0%A2%D0%AC') {
		var htmlRequest = new XMLHttpRequest();
		htmlRequest.addEventListener('load', function () {
			addHTML(htmlRequest.response.source);
		});
		htmlRequest.responseType = 'json';
		htmlRequest.open('GET', 'https://ru.wikinews.org/w/rest.php/v1/page/%D0%A3%D1%87%D0%B0%D1%81%D1%82%D0%BD%D0%B8%D0%BA:Zimorodokan%2ffastAddNewsSourceHTML');
		htmlRequest.send();
	}
}());
