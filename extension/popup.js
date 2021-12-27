'use strict'
// NOTE: Also in content.js
const settings = {
	'selector': null,
	'outline': '4px solid yellow'
}

chrome.storage.sync.get(settings, items => {
	for (const setting in settings) {
		if (items[setting]) {
			document.getElementById(setting).value = items[setting]
		}
	}
})

for (const setting in settings) {
	document.getElementById(setting).addEventListener('change', event => {
		if (setting === 'outline' && event.target.value === '') {
			event.target.value = settings.outline
		}
		chrome.storage.sync.set({ [setting]: event.target.value })
	})
}

chrome.runtime.onMessage.addListener(message => {
	switch (message.name) {
		case 'mutations':
		case 'runs':
		case 'matches':
			document.getElementById(message.name).innerText =
				message.data >= 0 ? message.data : '\u2014'
			break
		case 'validity': {
			const input = message.of
			document.getElementById(`${input}-valid`).hidden = !message.data
			document.getElementById(`${input}-invalid`).hidden = message.data
			document.getElementById(input).setAttribute(
				'aria-invalid', !message.data)
			break
		}
		case 'ignoring': {
			const ignoring = message.data === true
			const indicator = document.getElementById('ignoring')
			indicator.firstElementChild.hidden = !ignoring
			indicator.lastElementChild.hidden = ignoring
			break
		}
		default:
	}
})

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
	chrome.tabs.sendMessage(tabs[0].id, { name: 'get-info' })
})

document.getElementById('help').addEventListener('click', () => {
	chrome.tabs.create({ url: chrome.runtime.getURL('README.html') })
	window.close()
})
