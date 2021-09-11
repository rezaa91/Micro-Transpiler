const {tokenTypes, reservedWords} = require('./types');

function isReservedWord(value) {
    return reservedWords.includes(value);
}

module.exports = function scanner(input) {
    const tokens = [];
    let pointer = 0; // start at first character in input

    while (pointer < input.length) {
        const char = input[pointer];

        if (/\s/.test(char)) {
            // whitespace. do nothing

        } else if (/\d/.test(char)) {
            let value = '';
            do {
                value += input[pointer++];
            } while (/\d/.test(input[pointer]));

            tokens.push({type: tokenTypes.INTLITERAL, value: Number(value)});
            continue;

        } else if (/\w/.test(char)) {
            let value = '';
            do {
                value += input[pointer++];
            } while (input[pointer] && /\w/.test(input[pointer]));

            if (isReservedWord(value)) {
                tokens.push({type: tokenTypes[value.toUpperCase()], value});
            } else {
                tokens.push({type: tokenTypes.ID, value});
            }
            continue;

        } else if (char === '(') {
            tokens.push({type: tokenTypes.LPAREN, value: char});

        } else if (char === ')') {
            tokens.push({type: tokenTypes.RPAREN, value: char});

        } else if (char === ';') {
            tokens.push({type: tokenTypes.SEMICOLON, value: char});

        } else if (char === '=') {
            tokens.push({type: tokenTypes.ASSIGNOP, value: char});

        } else if (char === '+') {
            tokens.push({type: tokenTypes.PLUSOP, value: char});

        } else if (char === '-') {
            if (input[pointer + 1] === '-') {
                // a comment?? let's fast forward until the end of the line
                do {
                    pointer++;
                } while (input[pointer] !== '\n');
            } else {
                tokens.push({type: tokenTypes.MINUSOP, value: char});
            }

        } else {
            // must be an error if there are any other symbols
            throw new Error(`Invalid or unexpected token: ${char}`);
        }

        pointer++;
    }

    return tokens;
}