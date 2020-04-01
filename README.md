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
const {buildLexer} = require("@ull-esit-pl-1920/p10-t2-lexgen-code-jdm-ull-93");
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


________________________________________________________________________________________________

# Subiendo un modulo a Github registry

Veamos... Para subir mi modulo a github registry

Antes de nada, configure npm ejecutando la siguiente secuencia de comandos

```sh
npm set init.author.name "alu0101160337"
npm set init.author.email "alu0101160337@ull.edu.es"
npm set init.author.url "https://github.com/JDM-ULL-93"
```
Bien, tras esa pequeña configuración de NPM se me crea un fichero *'~/.npmrc'* con la siguiente contenido:

```ini
init.author.name=alu0101160337
init.author.email=alu01011600337@ull.edu.es
init.author.url=https://github.com/JDM-ULL-93
```
1) Cree un token en github dirigiendome a *Settings->Developer Settings->Personal access tokens*-> boton *"Generate New Token"* y seteandole los siguientes permisos:

![permisos_tokens](./img/permisos_tokens.jpg?raw=true)

2) Copie el codigo del token creado (una cadena de 40 digitos hexadecimales) y, con ese codigo copiado, ejecute el siguiente comando:

```sh
npm login --registry=https://npm.pkg.github.com
```
![comando_npm_login](./img/comando_npm_login.jpg?raw=true)

3) Introduciendo lo siguiente :

![datos_npm_login](./img/datos_npm_login.jpg?raw=true)

***Nota***: *En password pegue la cadena del token creado anteriormente*

Nuevamente, todo esto modifica nuestro fichero *'~/.npmrc'* añadiendole la siguiente información:

```ini
//npm.pkg.github.com/:_authToken=<cadena de 40 digitos hexadecimales>
```

Bien, ya estamos casi listos para publicar nuestro modulo como un paquete(*package*) en Github Registry, pero antes, dado que queremos publicarlo en el repositorio *"@ull-esit-pl-1920/p10-t2-lexgen-code-jdm-ull-93"* (en mi caso), modificaremos el fichero *"package.json"* cambiando el atributo *"name"* por esto:

```json
"name": "@ull-esit-pl-1920/p10-t2-lexgen-code-jdm-ull-93",
```

Como lo que queremos es subirlo a Github packages , además, le añadimos la siguiente propiedad al mismo *"package.json"*:

```json
"publishConfig": {
    "registry": "https://npm.pkg.github.com"
  },
```

Ya esta casi todo listo, en mi caso, como publico el modulo sobre el mismo repositorio, me interesa que varios ficheros y directorios no se incluyan en la publicación, para ello, en el mismo directorio de *"package.json"* creo un fichero llamado *".npmignore"* que funciona exactamente de la misma forma que un *".gitignore"*, de modo que le agrego lo siguiente:

```
img/
.github/
.gitignore
.git/
lexer.test.js
```
 
 Ahora si, ahora estamos listos, solo falta publicarlo, y eso lo logramos con la llamada al comando:

 ```sh
 npm publish
 ```

![npm_publish](./img/npm_publish.jpg?raw=true)

Por norma general, en la versión mas minimalista, solo nos interesa que se suban 3 ficheros:
1) README.md, fichero que contendra documentación sobre como usar el modulo
2) package.json, fichero que indicará las dependencias de otros modulos y como se invocará el modulo 
3) lexer.js , en mi caso, el fichero script que contiene el codigo del modulo, por norma general es "index.js"


# Uso del modulo

Para empezar, para que npm pueda buscar y encontrar nuestro modelo, en todas las maquinas en las que queramos usarla deberemos escribir una vez el siguiente comando:

```sh
npm config set @ull-esit-pl-1920:registry https://npm.pkg.github.com
```

Esto sirve para vincular un ambito(scope) a un repositorio sobre el que buscarlo, de forma que todo modulo que se encuentra dentro del ambito *"@ull-esit-pl-1920"* siempre será buscado en https://npm.pkg.github.com 

Y nos introducirá en ~/.npmrc la siguiente linea:

```ini
@ull-esit-pl-1920:registry=https://npm.pkg.github.com
```

Una vez tenemos el entorno configurado y listo, siempre que queramos utilizar nuestro modulo:
1) Primero lo instalaremos con:
```sh
npm install @ull-esit-pl-1920/p10-t2-lexgen-code-jdm-ull-93[@1.0.3]
```

2) Y luego lo usaremos en nuestro codigo con
```js
const {buildLexer} = require("@ull-esit-pl-1920/p10-t2-lexgen-code-jdm-ull-93")
```
