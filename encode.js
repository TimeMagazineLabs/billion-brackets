const fs = require('fs');
const ohash = require('object-hash');
const hash = require('string-hash')

let test = [ 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63 ];
let typed = new Uint8Array(64);
let str = "";

test.forEach((d,i) => {
	let hexString = d.toString(16);
	if (d < 16) {
		hexString = '0' + hexString;
	}
	str += hexString;
	typed[i] = d;
});

fs.writeFile("./test_buffer.txt", new Buffer.from(typed), function (err) {
	if (err) {
		console.error(err);
	} else {
		console.log(typed.length, typed.byteLength);
	}
});

let oH = ohash(test);

console.log(str, typeof str, str.length);

console.log(oH, typeof oH, oH.length);

let h = hash(str);

console.log(h, typeof h, h.byteSize);
