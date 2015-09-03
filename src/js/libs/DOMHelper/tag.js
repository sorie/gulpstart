/*function tag()*/
function tag(name, parentEl) {
	return (document || parentEl).getElementsByTagName(name);
}