self.addEventListener('install', event => event.waitUntil(
	caches.open('persgroep-core')
		.then(cache => cache.addAll([
			'/css/style.css',
			'/js/app.js',
			'/img/logos/persgroep.png'
		]))
		.then(self.skipWaiting())
));

self.addEventListener('fetch', event => {
	const req = event.request;
	if (req.mode === 'navigate' && req.method === 'get') {
		event.respondWith(
			fetch(req)
				.then(res => cachePage(req, res))
				.catch(err => getCachedPage(req))
		);
	} else {
		event.respondWith(
			fetch(req)
				.catch(err => fetchCoreFile(req.url))
		);
	}
});

function fetchCoreFile(url) {
	return caches.open('persgroep-core')
		.then(cache => cache.match(url))
		.then(response => response ? response : Promise.reject());
}

function cachePage(req, res) {
	const clonedRes = res.clone();
	caches.open('persgroep-pages')
		.then(cache => cache.put(req, clonedRes));
	return res;
}

function getCachedPage(req) {
	return caches.open('persgroep-pages')
		.then(cache => cache.match(req))
		.then(res => res ? res : Promise.reject());
}
