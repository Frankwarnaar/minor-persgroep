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

			this.socket.onopen = this.sendUserId.bind(this)
			this.socket.onmessage = this.handleMessage.bind(this);
		}
		catch (e) {
			console.log(e);
			console.log('could not setup a websocket connection');
		}
	}

	sendUserId() {
		this.socket.send(`{"userId": "${this.app.userId}"}`);
	}

	handleMessage({data}) {
		data = JSON.parse(data);
		if (data) {
			const count = data.notificationsCount;
			if (count) {
				this.setNotificationsCount(count);
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