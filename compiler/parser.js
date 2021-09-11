const {tokenTypes} = require('./types');

let pointer = -1;
const lexemes = [];
const symbolTable = {};

function assertEOF() {
    if (pointer !== lexemes.length - 1) {
        throw new Error('Expected EOF. "end" should be the last statement in your source file.');
    }
}

function assertNextToken(expected) {
    if (expected !== lexemes[pointer + 1]?.type) {
        throw new Error(`Expected ${expected}. Received ${lexemes[pointer + 1]?.type}`);
    }
    pointer++;
}

function assertCurrentToken(expected) {
    if (expected !== lexemes[pointer]?.type) {
        throw new Error(`Expected ${expected}. Received ${lexemes[pointer]?.type}`);
    }
}

function peekToken() {
    return lexemes[pointer + 1];
}

function getNextToken() {
    return lexemes[++pointer];
}

function createVariableDeclaratorNode(node, token) {
    node.declarator = node.declarator || {};
    const branch = node.declarator.left ? 'right' : 'left';

    node.declarator[branch] = {
        type: token.type === tokenTypes.ID ? 'Identifier' : 'Literal',
        value: symbolTable[token.value] ?? token.value
    };

    if (token.type === tokenTypes.ID) {
        node.declarator[branch].name = token.value;
    }

    node.declarator.result = node.declarator.result || node.declarator.left.value;
    // if RHS, then LHS must exist -> therefore, calculate result
    if (node.declarator.right) {
        node.declarator.result = node.operator === '+'
            ? node.declarator.result + node.declarator.right.value
            : node.declarator.result - node.declarator.right.value
    }

    symbolTable[node.name] = node.declarator.result;
}

function primary(node) {
    /* ID, INTLITERAL, PLUSOP, MINUSOP */
    const token = getNextToken();

    switch (token.type) {
        case tokenTypes.LPAREN:
            assertCurrentToken(tokenTypes.LPAREN);
            expression();
            assertNextToken(tokenTypes.RPAREN);

            break;

        case tokenTypes.ID:
            assertCurrentToken(tokenTypes.ID);
            createVariableDeclaratorNode(node, token);
            break;

        case tokenTypes.INTLITERAL:
            assertCurrentToken(tokenTypes.INTLITERAL);
            createVariableDeclaratorNode(node, token);
            break;

        default:
            throw new Error(`Unexpected token type: ${token.type}`);
    }
}

function arithmeticOperator(node) {
    /* + or - */
    const {type} = getNextToken();

    if (type !== tokenTypes.PLUSOP && type !== tokenTypes.MINUSOP) {
        throw new Error(`Expected plus or minus operator. Received ${lexemes[pointer]?.type}`);
    }
    node.operator = type === tokenTypes.PLUSOP ? '+' : '-';
}

function expression(node) {
    /* <primary> {<arithmetic op> <primary>} */
    primary(node);

    for (let token = peekToken(); token.type === tokenTypes.PLUSOP || token.type === tokenTypes.MINUSOP; token = peekToken()) {
        arithmeticOperator(node);
        primary(node);
    }
}

function statement(ast) {
    const {type, value} = getNextToken();
    let node;

    switch (type) {
        case tokenTypes.ID:
            /* ID = <expresion> */
            node = {
                type: 'VariableDeclaration',
                name: value
            }

            assertCurrentToken(tokenTypes.ID);
            assertNextToken(tokenTypes.ASSIGNOP);
            expression(node);
            assertNextToken(tokenTypes.SEMICOLON);

            ast.push(node);
            break;

        case tokenTypes.WRITE:
            /* write( <expression> ) */
            node = {
                type: 'ExpressionStatement',
                callee: 'write'
            }

            assertCurrentToken(tokenTypes.WRITE);
            assertNextToken(tokenTypes.LPAREN);
            expression(node);
            assertNextToken(tokenTypes.RPAREN);
            assertNextToken(tokenTypes.SEMICOLON);

            ast.push(node);
            break;

        default:
            throw new Error(`Syntax error: ${value}`);
    }
}

function statementList(ast) {
    /* <statement> {<statement>} */
    statement(ast);

    while (true) {
        switch (peekToken()?.type) {
            case tokenTypes.ID:
            case tokenTypes.WRITE:
                statement(ast);
                break;
            default:
                return;
        }
    }
}

function program(ast) {
    /**
     * program should start with 'begin' keyword
     * and end with 'end' keyword
     * begin <statement list> end
     */
    assertNextToken(tokenTypes.BEGIN);
    statementList(ast);
    assertNextToken(tokenTypes.END);
    assertEOF();
}

module.exports = function parser(tokens) {
    lexemes.push(...tokens);

    const ast = {
        type: 'program',
        body: []
    };

    program(ast.body);
    return ast;
}