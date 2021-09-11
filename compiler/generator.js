module.exports = function generator(ast) {
    return ast.body.reduce((code, node) => {
        switch (node.type) {
            case 'VariableDeclaration':
                code += `var ${node.name} = ${node.declarator.result};\n`;
                break;

            case 'ExpressionStatement':
                if (node.callee === 'write') {
                    code += `console.log(${node.declarator.result});\n`;
                }
                break;
        }

        return code;
    }, '');
}
