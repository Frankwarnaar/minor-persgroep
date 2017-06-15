// source:  https://www.kirupa.com/html5/get_element_position_using_javascript.htm
function getPosition($el) {
	let xPos = 0;
	let yPos = 0;

	while ($el) {
		xPos += ($el.offsetLeft + $el.clientLeft);
		yPos += ($el.offsetTop + $el.clientTop);

		$el = $el.offsetParent;
	}

	return {
		x: xPos,
		y: yPos
	};
}

module.exports = getPosition;