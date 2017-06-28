class Notifications {
	constructor(app) {
		this.app = app;
		this.$notifications = document.getElementById('notifications');
		this.$notificationsCount = document.querySelector('#notifications span');

		if (this.$notifications && this.$notificationsCount && this.app.userId) {
			this.init();
		}
	}

	init() {
		try {
			this.socket = new WebSocket(`ws://${window.location.hostname}:8000`, 'echo-protocol');
			this.requestNotifications();

			this.socket.onopen = this.sendUserId.bind(this)
			this.socket.onmessage = this.handleMessage.bind(this);
		}
		catch (e) {
			console.log(e);
			console.log('could not setup a websocket connection');
		}
	}

	requestNotifications() {
		if ('Notification' in window) {
			Notification.requestPermission();
		}
	}

	showNotification(review) {
		if ('Notification' in window) {
			Notification.requestPermission(result => {
				if (result === 'granted') {
					navigator.serviceWorker.ready.then(registration => {
						registration.showNotification('New review', {
							body: 'There is a new review on your article',
							icon: '/img/app-icons/favicon.png',
							vibrate: [200, 100, 200]
						});
					});
				}
			});
		}
	}

	sendUserId() {
		this.socket.send(`{"userId": "${this.app.userId}"}`);
	}

	handleMessage({data}) {
		data = JSON.parse(data);
		if (data) {
			const {count, review} = data;
			if (count) {
				this.setNotificationsCount(count);
			}
			if (review) {
				this.showNotification(review);
			}
		}
	}

	setNotificationsCount(count) {
		this.$notificationsCount.innerHTML = count;
		if (count > 0) {
			this.$notifications.setAttribute('data-has-notifications', 'true');
		}
	}
}

module.exports = Notifications;