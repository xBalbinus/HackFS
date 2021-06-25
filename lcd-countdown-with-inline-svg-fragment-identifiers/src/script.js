$(function () {
	/**
	 * Script based on countdown timer article by Yaphi Berhanu and Nilson Jacques.
	 * article: https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/
	 * pen:     https://codepen.io/SitePoint/pen/NWxKgxN
	 */
	const goTime = "July 31 2021 09:00:00 GMT-0600"; // 9am MDT
	// const goTime = new Date(Date.parse(new Date()) + 5 * 24 * 60 * 60 * 1000); // 5 days from now
	// how often countdown display will be updated (in milliseconds)
	// if seconds are hidden, set this to 1000 * 60
	const updateFrequency = 1000;

	function getTimeRemaining() {
		const total = Date.parse(goTime) - Date.parse(new Date());
		const days = Math.floor(total / (1000 * 60 * 60 * 24));
		const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
		const minutes = Math.floor((total / 1000 / 60) % 60);
		const seconds = Math.floor((total / 1000) % 60);

		// IE11 doesn't support ES6 object property shorthand
		return {
			total: total,
			days: days,
			hours: hours,
			minutes: minutes,
			seconds: seconds
		};
	}

	function initCountdown() {
		const $container = $(".js-countdown-container");
		const $days = $container.find(".js-countdown-digit-days");
		const $hours = $container.find(".js-countdown-digit-hours");
		const $minutes = $container.find(".js-countdown-digit-minutes");
		const $seconds = $container.find(".js-countdown-digit-seconds");
		const $separators = $container.find(".js-countdown-separator");
		const $status = $container.find(".js-countdown-status");
		let previousMinutesValue = 60; // set to 60 so countdown value is read at init

		function updateDigits($set, digits) {
			$set.each(function(index) {
				const text = digits.charAt(index);
				const $digit = $(this);
				
				// update svg display
				$digit.find(".js-countdown-digit-image use").attr("xlink:href", "#n" + text);
				// update screen reader text
				$digit.find(".js-countdown-digit-text").text(text);
			});
		}

		function updateDisplay() {
			const remaining = getTimeRemaining();
			const zero = "0";
			const countdownComplete = remaining.total <= 0;
			
			// add a leading zero when necessary
			let days = (zero + remaining.days).slice(-2);
			let hours = (zero + remaining.hours).slice(-2);
			let minutes = (zero + remaining.minutes).slice(-2);
			let seconds = (zero + remaining.seconds).slice(-2);

			if (countdownComplete) {
				clearInterval(updateInterval);
				// reset any negative values
				days = hours = minutes = seconds = "00";
			}

			// update UI
			updateDigits($days, days);
			updateDigits($hours, hours);
			updateDigits($minutes, minutes);
			updateDigits($seconds, seconds);
			$separators.find("use").attr("xlink:href", "#separator1");
			
			// update screen reader status every minute until completion
			if (countdownComplete || remaining.minutes < previousMinutesValue || remaining.minutes == 59) {
				let status = 'Time remaining: ';
				
				if (countdownComplete) {
					status = 'Countdown complete';
				} else {
					// don't announce hidden sets
					if ($days.filter(':visible').length) {
						status += remaining.days + ' days';
					}
					if ($hours.filter(':visible').length) {
						status += ', ' + remaining.hours + ' hours';
					}
					if ($minutes.filter(':visible').length) {
						status += ', ' + remaining.minutes + ' minutes';
					}
				}
				// update screen-reader-only alert element
				$status.text(status);
				previousMinutesValue = remaining.minutes;
			}
		}

		updateDisplay();
		var updateInterval = setInterval(updateDisplay, updateFrequency);
	}

	initCountdown();
});
