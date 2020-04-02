"use strict";
/*
const SPACE = /(?<SPACE>\s+|\/\/.*)/;
const RESERVEDWORD = /(?<RESERVEDWORD>\b(const|let)\b)/;
const ID = /(?<ID>\b([a-z_]\w*))\b/;
const STRING = /(?<STRING>"([^\\"]|\\.")*")/;
const OP = /(?<OP>[+*\/=-])/;

const myTokens = [
  ['SPACE', SPACE,true], ['RESERVEDWORD', RESERVEDWORD], ['ID', ID],
  ['STRING', STRING], ['OP', OP]
];
//const str = 'const varName = "value"';
//const str = ' // Entrada con errores\nlet x = 42*c';
const str = 'let x = a + \nb';
console.log(buildLexer(myTokens)(str));
*/
function buildLexer(tokens = []){
    const tokenNames = tokens.map(t => t[0]);
    const tokenRegs  = tokens.map(t => t[1]);
    const ignoreTokens = [];
    tokens.forEach(t => ignoreTokens[t[0]] = t[2] ? t[2] : false);
        //console.log(tokenFunctions);
      
    const buildOrRegexp = (regexps) => {
        const sources = regexps.map(r => r.source);
        const union = sources.join('|');
        // console.log(union);
        return new RegExp(union, "yu");
    };
    
    const regexp = buildOrRegexp(tokenRegs);
    
    const getToken = (match) => tokenNames.find(tn => typeof match[tn] !== 'undefined');

    const make = (value,type) => { return {"type":type, "value":value} };

    return (str) =>{

        let result = [];
        let ERROR = /.*/yu;
        let match;  
        
        while (match = regexp.exec(str)) {
            let t = getToken(match.groups);
            //console.log(`Found token '${t}' with value '${match.groups[t]}'`);
            ERROR.lastIndex += match.groups[t].length;
            if(!ignoreTokens[t]) result.push( make(match.groups[t],t) );
        }
        if(ERROR.lastIndex != str.length)
            result.push( make(ERROR.exec(str)[0].trim(),"ERROR") );
        return result;
    };
};

module.exports = {
    buildLexer,
}
