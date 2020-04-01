const debug = process.env["DEBUG"];
const { inspect } = require('util');
const ins = (x) => { if (debug) console.log(inspect(x, {depth: null})) };

const {buildLexer} = require('../lib/lexer');

const SPACE = /(?<SPACE>\s+|\/\/.*)/;
const RESERVEDWORD = /(?<RESERVEDWORD>\b(const|let)\b)/;
const ID = /(?<ID>\b([a-z_]\w*))\b/;
const STRING = /(?<STRING>"([^\\"]|\\.")*")/;
const OP = /(?<OP>[+*\/=-])/;

const myTokens = [
  ['SPACE', SPACE,true], ['RESERVEDWORD', RESERVEDWORD], ['ID', ID],
  ['STRING', STRING], ['OP', OP]
];

let str, lexer, r;
lexer = buildLexer(myTokens);

str = 'const varName = "value"';
ins(str);
r = lexer(str);
ins(r);
let expected = [
  { type: 'RESERVEDWORD', value: 'const' },
  { type: 'ID', value: 'varName' },
  { type: 'OP', value: '=' },
  { type: 'STRING', value: '"value"' }
];

test(str, () => {
  expect(r).toEqual(expected);
});

str = 'let x = a + \nb';
ins(str);
r = lexer(str);
expected = [
  { type: 'RESERVEDWORD', value: 'let' },
  { type: 'ID', value: 'x' },
  { type: 'OP', value: '=' },
  { type: 'ID', value: 'a' },
  { type: 'OP', value: '+' },
  { type: 'ID', value: 'b' }
];
ins(r);
test(str, () => {
  expect(r).toEqual(expected);
});

str = ' // Entrada con errores\nlet x = 42*c';
ins(str);
r = lexer(str);
ins(r);
expected = [
  { type: 'RESERVEDWORD', value: 'let' },
  { type: 'ID', value: 'x' },
  { type: 'OP', value: '=' },
  { type: 'ERROR', value: '42*c' }
];

test(str, () => {
  expect(r).toEqual(expected);
});