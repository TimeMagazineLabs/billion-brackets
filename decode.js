const fs = require('fs');

let buf = new Buffer.from(fs.readFileSync("./test_buffer.txt", "utf8"));

console.log(buf.toJSON());