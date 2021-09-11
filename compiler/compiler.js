const fs = require('fs');
const scanner = require('./scanner');
const parser = require('./parser');
const generator = require('./generator');

const source = fs.readFileSync('./source.micro').toString();
const tokens = scanner(source);
const ast = parser(tokens);
const transpiledCode = generator(ast);
fs.writeFileSync('./output/app.js', transpiledCode);
