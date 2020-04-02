# Lexer - Alu0101160337
 
**NOTA**
No olvidarse de configurar entorno con :
```sh
npm config set @ull-esit-pl-1920:registry https://npm.pkg.github.com
```

Antes de intentar *npm install*
 
Este módulo consiste en un método que recibe un array con el siguiente formato:
```js
let tokens = [
    [/*<nombre_tipo>*/,/*<Regex que lo reconoce>*/,/*Debe ignorarse?(Por defecto, false)*/], //1
    [/*<nombre_tipo>*/,/*<Regex que lo reconoce>*/,/*Debe ignorarse?(Por defecto, false)*/], //2
    .
    .
    .
    [/*<nombre_tipo>*/,/*<Regex que lo reconoce>*/,/*Debe ignorarse?(Por defecto, false)*/] //N
]
```
Y con ese array, se construye un analizador léxico en forma de función que recibe como argumento la cadena a analizar
 
```js
const {buildLexer} = require(".lexer");
let tokens = [ ... ]; //Formato explicado anteriormente
 
const analizadorLexico = buildLexer(tokens);
```
 
Pudiendo invocarse de la siguiente forma:
```js
const str = 'const varName = "value"';
analizadorLexico(str)
```
 
Un ejemplo completo de su uso se expone a continuación:
 
```js
const SPACE = /(?<SPACE>\s+|\/\/.*)/;
const RESERVEDWORD = /(?<RESERVEDWORD>\b(const|let)\b)/;
const ID = /(?<ID>\b([a-z_]\w*))\b/;
const STRING = /(?<STRING>"([^\\"]|\\.")*")/;
const OP = /(?<OP>[+*\/=-])/;
 
const myTokens = [
  ['SPACE', SPACE,true], ['RESERVEDWORD', RESERVEDWORD], ['ID', ID],
  ['STRING', STRING], ['OP', OP]
];
const str = ' // Entrada con errores\nlet x = 42*c';
 
 
const {buildLexer} = require('./lexer');
console.log(buildLexer(myTokens)(str));
```
 
Mostrando por pantalla el siguiente resultado
 
```js
[
  { type: 'RESERVEDWORD', value: 'let' },
  { type: 'ID', value: 'x' },
  { type: 'OP', value: '=' },
  { type: 'ERROR', value: '42*c' }
];
```
**NOTA**
Conviene destacar que, en caso de que las expresiones regulares pasadas para construir el analizador léxico sean incapaces de analizar toda la cadena pasada, aquella parte sin analizar es pasada en el resultado como un token de tipo *"ERROR"*, tal y como se muestra en el ejemplo previo.

