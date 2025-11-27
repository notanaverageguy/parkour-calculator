// ************************************************** //
function doUndent(str) {
	str = str.split('\n');
	if (str[0].match(/^\s*$/)) str = str.slice(1);
	if (str.slice(-1)[0].match(/^\s*$/)) str = str.slice(0, -1);
	const minLen = Math.min(
		...str.filter((s) => s.replace(/\s/g, '').length).map((s) => s.match(/^\s*/)[0].length)
	);
	return str.map((x) => x.slice(minLen)).join('\n');
};

// ************************************************** //
function joinTemplateTagString(str, prop) {
	const pre = str.split('\n').slice(-1)[0].replace(/./g, ' ');
	return (
		str +
		(prop + '')
			.split('\n')
			.map((x, i) => (i ? pre : '') + x)
			.join('\n')
	);
};

// ************************************************** //
export default function undent(str, ...props) {
	str = str.map((x) => x.replace(/\r/g, '')); // remove windows CR
	str = str.reduce((a, s, i) => a + joinTemplateTagString(s, props[i] || ''), ''); // join template tag into string
	return doUndent(str);
}
