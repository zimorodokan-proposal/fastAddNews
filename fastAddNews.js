/*
	Copyright 2021 andrij krasotkin

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

'use strict';

let V = {};
let E = {};
let F = {};

F.addPageEvents = function addPageEvents () {

	if (E.addNewsForm__submitButtons) {
		E.addNewsForm__submitButtons.forEach(e => e.addEventListener('click', F.submitForm));
	}

	if (E.layerCloseItem) {
		E.layerCloseItem.forEach(e => e.addEventListener('click', function () {
			F.closeLayer(e);
		}));
		E.layerCloseItem.forEach(e => e.addEventListener('keydown', function (event) {
			if (event.key === ' ' || event.key === 'Enter') {
				F.closeLayer(e);
			}
		}));
	}

	if (E.layerOpenItem) {
		E.layerOpenItem.forEach(e => e.addEventListener('click', function () {
			F.openLayer(e.dataset.layerId);
		}));
		E.layerOpenItem.forEach(e => e.addEventListener('keydown', function (event) {
			if (event.key === ' ' || event.key === 'Enter') {
				F.openLayer(e.dataset.layerId);
			}
		}));
	}

	if (E.layerWithShadow) {
		E.layerWithShadow.forEach(e => e.addEventListener('click', function (event) {
			event.stopPropagation();
			if (event.target === e) {
				e.classList.remove('layer--open');
			}
		}));
	}

	if (E.pageStyles) {
		E.pageStyles.forEach(e => e.addEventListener('click', F.getNextPageStyle));
		E.pageStyles.forEach(e => e.addEventListener('keydown', function (event) {
			if (event.key === ' ' || event.key === 'Enter') {
				F.getNextPageStyle(event);
			}
		}));
	}

	if (E.textInputs) {
		E.textInputs.forEach(function (el) {
			el.addEventListener('blur', function () {
				F.removeExessiveSpaceSymbols(el);
			});
		});
	}
};

F.closeLayer = function closeLayer (e) {
	let layer = e.parentElement.parentElement;
	let id = layer.id;
	let focusedElement;
	if (id === 'layerExistingTitle') {
		focusedElement = document.getElementById('addNewsForm__title');
	}
	else {
		focusedElement = document.querySelector(`[data-layer-id=${id}]`);
	}
	layer.classList.remove('layer--open');
	if (focusedElement) {
		focusedElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
		focusedElement.focus();
	}
};

F.applyPageStyle = function applyPageStyle (string) {
	E.html.dataset.pageStyle = string;
};

F.capitalizeFirstLetter = function capitalizeFirstLetter (string) {
	return string[0].toUpperCase() + string.substring(1);
};

F.checkPageExisting = async function checkPageExisting (title) {
	console.log('F.checkPageExisting');
	let requestOptions = {
		'method': 'GET',
	};
	try {
		let response = await fetch(`https://ru.wikinews.org/w/rest.php/v1/page/${title}`, requestOptions);
		console.log(response);
		if (response.status === 200) {
			return true;
		}
		else {
			return false;
		}
	} catch (error) {
		console.log(error);
	}
};

F.checkValidityMinLength = function checkValidityMinLength (element) {
	let textLength = element.value.length;
	let minLength = element.minLength;
	if (minLength > textLength) {
		element.setCustomValidity(`Не менее ${minLength} символов.`);
	}
	else {
		element.setCustomValidity('');
	}
	element.checkValidity();
};

F.createNews = async function createNews (wikiNewsTitle, wikiNewsText, csrfToken, creatingType) {
	console.log('F.createNews');
	let newsPostData = new FormData();
	newsPostData.append('text', wikiNewsText);
	newsPostData.append('token', csrfToken);
	let requestOptions = {
		'method': 'POST',
		'body': newsPostData
	};
	try {
		let response;
		switch (creatingType) {
			case 'addNewsForm__saveButton_wikiEdit':
				response = await fetch(`https://ru.wikinews.org/w/api.php?action=edit&format=json&title=${wikiNewsTitle}&createonly`, requestOptions);
				console.log('addNewsForm__saveButton_wikiEdit', response);
				if (response.status === 200) {
					location.assign(`https://ru.wikinews.org/w/index.php?title=${wikiNewsTitle}&action=edit`);
				}
				break;
			case 'addNewsForm__saveButton_nextEdit':
				response = await fetch(`https://ru.wikinews.org/w/api.php?action=edit&format=json&title=${wikiNewsTitle}&createonly`, requestOptions);
				console.log('addNewsForm__saveButton_nextEdit', response);
				if (response.status === 200) {
					location.assign(`https://ru.wikinews.org/w/index.php?title=${wikiNewsTitle}`);
				}
				break;
			case 'addNewsForm__saveButton_review':
				response = await fetch(`https://ru.wikinews.org/w/api.php?action=edit&format=json&title=${wikiNewsTitle}&createonly`, requestOptions);
				console.log('addNewsForm__saveButton_review', response);
				if (response.status === 200) {
					location.assign(`https://ru.wikinews.org/w/index.php?title=${wikiNewsTitle}`);
				}
				break;
		}
	} catch (error) {
		console.log(error);
	}
};

F.deleteZeroItems = function deleteZeroItems (string) {
	if (string.length > 0) {
		return string;
	}
};

F.isStorageAvailable = (type) => {
	// © https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
	let storage;
	try {
		storage = window[type];
		let x = '__storage_test__';
		storage.setItem(x, x);
		storage.removeItem(x);
		return true;
	}
	catch (e) {
		return e instanceof DOMException && (
			// everything except Firefox
			e.code === 22 ||
			// Firefox
			e.code === 1014 ||
			// test name field too, because code might not be present
			// everything except Firefox
			e.name === 'QuotaExceededError' ||
			// Firefox
			e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
			// acknowledge QuotaExceededError only if there's something already stored
			(storage && storage.length !== 0);
	}
};

F.findElements = function findElements () {
	E.html = document.documentElement;
	E.addNewsForm = document.getElementById('addNewsForm');
	E.addNewsForm__saveButton_WikiEdit = document.getElementById('addNewsForm__saveButton_wikiEdit');
	E.addNewsForm__saveButton_NextEdit = document.getElementById('addNewsForm__saveButton_nextEdit');
	E.addNewsForm__saveButton_Review = document.getElementById('addNewsForm__saveButton_review');
	E.addNewsForm__submitButtons = document.querySelectorAll('[data-submit-button]');
	E.pageStyles = document.querySelectorAll('.pageThemes__listItem');
	E.layerCloseItem = document.querySelectorAll('.layer__closeElement');
	E.layerOpenItem = document.querySelectorAll('[data-layer-id]');
	E.layerWithShadow = document.querySelectorAll('.layer--shadow');
	E.textInputs = document.querySelectorAll('input[type=text], textarea');
};

F.getNextPageStyle = function getNextPageStyle (event) {
	let e = event.target;
	let style = e.dataset.pageStyle;
	F.updateCurrentPageStyle(style);
};

F.getCsrfToken = async function getCsrfToken () {
	console.log('F.getCsrfToken');
	try {
		let url = 'https://ru.wikinews.org/w/api.php?action=query&format=json&meta=tokens';
		let response = await fetch(url);
		let data = await response.json();
		console.log(data);
		return data.query.tokens.csrftoken;
	} catch (err) {
		console.log(err);
	}
};

F.openLayer = function openLayer (layerId) {
	let layer = document.getElementById(layerId);
	if (layer) {
		layer.classList.add('layer--open');
		layer.firstElementChild.firstElementChild.focus();
	}
};

F.processPage = function processPage () {
	V.localStorage = F.isStorageAvailable('localStorage');
	F.findElements();
	F.processUserPageStyle();
	F.addPageEvents();
};

F.processUserPageStyle = function processUserPageStyle () {
	if (V.localStorage) {
		E.html.dataset.storage = '';
		let pageStyle = localStorage.getItem('pageStyle');
		if (pageStyle != null) {
			F.applyPageStyle(pageStyle);
		}
	}
	else {
		console.log('localStorage is ont available');
	}
};

F.removeExessiveSpaceSymbols = function removeExessiveSpaceSymbols (element) {
	let firstCharacterSpace = /\n[ \f\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/gu;
	let linefeeds = /\n+/gu;
	let spaces = /[ \f\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]+/gu;
	let originalValue = element.value;
	let processedValue = originalValue
		.replace(linefeeds, '\n')
		.replace(spaces, ' ')
		.replace(firstCharacterSpace, '\n')
		.trim();
	element.value = processedValue;

	if (element.hasAttribute('minlength')) {
		F.checkValidityMinLength(element);
	}
};

F.submitForm = async function submitForm (event) {
	event.preventDefault();

	let e = event.currentTarget;
	console.log('F.submitForm', e.id);

	if (e.id == 'addNewsForm__cancelButton') {
		location.assign('https://ru.wikinews.org/?curid=1334');
		return;
	}

	let addNewsFormValidity = E.addNewsForm.reportValidity();
	console.log('addNewsFormValidity', addNewsFormValidity);
	if (addNewsFormValidity != true) {
		console.log('Form not valid. Please check fields.');
		return;
	}

	let newsFormData = new FormData(E.addNewsForm);
	let newsTitle = newsFormData.get('addNewsForm__title').trim();
	let newsText = newsFormData.get('addNewsForm__text');
	let newsMainTopic = newsFormData.get('addNewsForm__topics');
	let newsMainCountry = newsFormData.get('addNewsForm__countries');
	let newsCategories = [...(new Set(
		[
			newsMainTopic, newsMainCountry,
			...(newsFormData.get('addNewsForm__categories'))
				.toLowerCase()
				.split(',')
				.map(v => v.trim())
		]
			.filter(F.deleteZeroItems)
			.map(F.capitalizeFirstLetter)
	))]
		.sort()
		.join('|');
	let newsImageUrl = newsFormData.get('addNewsForm__image')
		.trim()
		.replace('https://', '')
		.replace('http://', '')
		.replace('commons.wikimedia.org/wiki/', '')
		.replace('File:', '')
		.replace('Файл:')
		.replaceAll('_', ' ');
	let newsImageDescription = (newsFormData.get('addNewsForm__imageDescription')).trim();
	let newsStatus = (e.id == 'addNewsForm__saveButton_review') ? 'рецензирование' : 'редактируется';

	let newsSourceOneUrl = newsFormData.get('addNewsForm__source_1_url');
	let newsSourceOneHeader = newsFormData.get('addNewsForm__source_1_header');
	let newsSourceOneAuthor = newsFormData.get('addNewsForm__source_1_author');
	let newsSourceOnePublisher = newsFormData.get('addNewsForm__source_1_publisher');
	let newsSourceOneDate = newsFormData.get('addNewsForm__source_1_date');
	var newsSourceOne = newsSourceOneUrl && newsSourceOneHeader ? `* {{источник|url=${newsSourceOneUrl}|Название=${newsSourceOneHeader}|Автор=${newsSourceOneAuthor}|Издатель=${newsSourceOnePublisher}|Дата=${newsSourceOneDate}}}` : '';

	let newsSourceTwoUrl = newsFormData.get('addNewsForm__source_2_url');
	let newsSourceTwoHeader = newsFormData.get('addNewsForm__source_2_header');
	let newsSourceTwoAuthor = newsFormData.get('addNewsForm__source_2_author');
	let newsSourceTwoPublisher = newsFormData.get('addNewsForm__source_2_publisher');
	let newsSourceTwoDate = newsFormData.get('addNewsForm__source_2_date');
	var newsSourceTwo = newsSourceTwoUrl && newsSourceTwoHeader ? `\n* {{источник|url=${newsSourceTwoUrl}|Название=${newsSourceTwoHeader}|Автор=${newsSourceTwoAuthor}|Издатель=${newsSourceTwoPublisher}|Дата=${newsSourceTwoDate}}}` : '';

	let newsSourceThreeUrl = newsFormData.get('addNewsForm__source_3_url');
	let newsSourceThreeHeader = newsFormData.get('addNewsForm__source_3_header');
	let newsSourceThreeAuthor = newsFormData.get('addNewsForm__source_3_author');
	let newsSourceThreePublisher = newsFormData.get('addNewsForm__source_3_publisher');
	let newsSourceThreeDate = newsFormData.get('addNewsForm__source_3_date');
	var newsSourceThree = newsSourceThreeUrl && newsSourceThreeHeader ? `\n* {{источник|url=${newsSourceThreeUrl}|Название=${newsSourceThreeHeader}|Автор=${newsSourceThreeAuthor}|Издатель=${newsSourceThreePublisher}|Дата=${newsSourceThreeDate}}}` : '';
	const date = new Date();
	let formattedDate = date.toLocaleString('ru', { day: 'numeric', month: 'long' }) + ' ' + date.getFullYear();
	let wikiNewsTitle = 'Участник:Zimorodokan%2F' + newsTitle;
	let wikiNewsText = `
{{${newsStatus}}}
${formattedDate}
{{тема|${newsMainCountry}|${newsMainTopic}}}
[[Файл:${newsImageUrl}|thumb|left|300px|${newsImageDescription}]]
${newsText}

{{-}}
== Источники ==
${newsSourceOne} ${newsSourceTwo} ${newsSourceThree}
{{Подвал новости}}
{{Категории|${newsCategories}}}
	`;

	let pageExist = await F.checkPageExisting(wikiNewsTitle);
	console.log('pageExist', pageExist);
	if (pageExist === true) {
		console.log('Page Exist');
		F.openLayer('layerExistingTitle');
		return;
	}
	let csrfToken = await F.getCsrfToken();
	if (csrfToken) {
		let creatingType = e.id;
		F.createNews(wikiNewsTitle, wikiNewsText, csrfToken, creatingType);
	}
};

F.updateCurrentPageStyle = function updateCurrentPageStyle (string) {
	E.html.dataset.pageStyle = string;
	localStorage.setItem('pageStyle', string);
};

F.processPage();
