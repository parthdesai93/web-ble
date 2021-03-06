import HeartRateService from './heartRateService'

const heartRate = new HeartRateService()
const connectButton = document.getElementById('connect');
const errorMessage = document.getElementById('errorMessage');
const heartRateEl = document.getElementById('heartRate');
// const locationEl = document.getElementById('location');
let connected = false

connectButton.addEventListener('click', () => {
	if (connected) {
		heartRate.disconnect()
		connected = false
		connectButton.textContent = 'Connect';
		heartRateEl.textContent = '';
	} else {
		connectButton.textContent = 'Connecting...';
	  	heartRate.connect()
		.then(() => {
			connected = true;
			errorMessage.textContent = '';
			connectButton.textContent = 'Disconnect';
			heartRate.readSensorLocation().then(location => console.log('reading from ', location))
			return heartRate.startHeartRateNotifications().then(handleHeartRateNotifications)
		})
		.catch(error => {
			errorMessage.textContent = error;
			connectButton.textContent = 'Connect';
		})
	}
})

const handleHeartRateNotifications = (heartRateMeasurement) => {
	heartRateMeasurement.addEventListener('characteristicvaluechanged', event => {
		const heartRateValue = heartRate.parseHeartRate(event.target.value)
		heartRateEl.textContent = heartRateValue
	})
}
