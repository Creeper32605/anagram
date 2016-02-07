let countChars = function countChars(inp) {
	let chars = {};
	for (let char of inp.toUpperCase()) {
		if (char.match(/^\W$/)) continue;
		if (!(char in chars)) {
			chars[char] = 1;
		} else {
			chars[char]++;
		}
	}
	return chars;
};

let getCountTable = function getCountTable(a, b) {
	let keys = [];
	let table = {};
	for (let i in a) {
		if (!keys.includes(i)) keys.push(i);
	}
	for (let i in b) {
		if (!keys.includes(i)) keys.push(i);
	}
	keys.sort(function(a, b) {
		if (a.codePointAt(0) > b.codePointAt(0)) {
			return 1;
		} else if (a.codePointAt(0) < b.codePointAt(0)) {
			return -1;
		}
		return 0;
	})
	for (let i of keys) {
		table[i] = [(a[i] || 0), (b[i] || 0)];
	}
	return table;
}
let cTableMatches = function cTableMatches(t) {
	let match = true;
	for (let i in t) {
		if (t[i][0] != t[i][1]) {
			match = false;
		}
	}
	return match;
};

let inp1 = document.querySelector('#ana1');
let inp2 = document.querySelector('#ana2');
let stat = document.querySelector('#status');
let errt = document.querySelector('#err-table');
let canv = document.querySelector('#an-canvas');

Object.defineProperty(window, 'dp', {
	enumerable: true,
	get: function() {
		return window.devicePixelRatio;
	}
});
let resizeCanvas = function() {
	canv.width = innerWidth * dp;
	canv.height = 200 * dp;
	canv.style.width = innerWidth + 'px';
	canv.style.height = 200 + 'px';
};
let ctx = canv.getContext('2d');
resizeCanvas();
window.resize = resizeCanvas;

let updateCanvas = function() {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.fillStyle = '#000000';
	ctx.font = (dp * 16) + 'px monospace';
	ctx.textAlign = 'center';
	let height = 150 * dp;
	let index = 0;
	let chars = {};
	for (let i of inp1.value) {
		ctx.fillText(i, (7 + index * 12) * dp, dp * 16);
		if (!(i in chars)) chars[i] = [index];
		else chars[i].push(index);
		index++;
	}
	index = 0;
	ctx.lineWidth = 2 * dp;
	ctx.lineCap = 'round';
	ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
	for (let i of inp2.value) {
		ctx.fillText(i, (7 + index * 12) * dp, height - (dp * 5));
		if (!i.match(/^\W$/) && chars[i] && chars[i].length) {
			let ci = chars[i][0];
			chars[i].splice(0, 1);
			ctx.beginPath();
			let x1 = (7 + index * 12) * dp;
			let y1 = height - (dp * 20);
			let x2 = (7 + ci * 12) * dp;
			let y2 = dp * 18;
			ctx.moveTo(x1, y1);
			ctx.bezierCurveTo(x1, height * 0.7, x2, height * 0.3, x2, y2);
			ctx.stroke();
		}
		index++;
	}
};

let checkValidity = function checkValidity() {
	let i1 = countChars(inp1.value);
	let i2 = countChars(inp2.value);
	errt.innerHTML = '';
	let tab = getCountTable(i1, i2);
	if (cTableMatches(tab)) {
		stat.textContent = 'Valid Anagram';
		stat.setAttribute('valid', true);
	} else {
		stat.textContent = 'Invalid Anagram';
		stat.setAttribute('valid', false);
		let h0 = document.createElement('th');
		let h1 = document.createElement('th');
		let h2 = document.createElement('th');
		h0.textContent = '';
		h1.textContent = 'Input 1';
		h2.textContent = 'Input 2';
		let th = document.createElement('tr');
		th.appendChild(h0);
		th.appendChild(h1);
		th.appendChild(h2);
		errt.appendChild(th);
		for (let i in tab) {
			let j = tab[i];
			let q0 = document.createElement('td');
			let q1 = document.createElement('td');
			let q2 = document.createElement('td');
			q0.textContent = i;
			q1.textContent = j[0];
			q2.textContent = j[1];
			let tr = document.createElement('tr');
			tr.appendChild(q0);
			tr.appendChild(q1);
			tr.appendChild(q2);
			if (j[0] == j[1]) tr.classList.add('match');
			else if (j[0] < j[1]) tr.classList.add('diffr')
			else tr.classList.add('diffl')
			errt.appendChild(tr);
		}
	}
	updateCanvas();
};

inp1.addEventListener('keyup', checkValidity);
inp2.addEventListener('keyup', checkValidity);