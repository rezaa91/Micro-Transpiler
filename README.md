# MICRO COMPILER

## OVERVIEW
A transpiler for the Micro programming language.\
For educational purposes only.

For more educations resources:\
[https://www.youtube.com/channel/UCGPpiPgghR8uiaIIJuvKZtg](Youtube)\
[https://twitter.com/jrdev_](Twitter)

Inspired by "Crafting a Compiler in C" by Charles N. Fisher & Richard J. LeBlanc, Jr.

## MICRO SYNTAX (GRAMMAR)

| Production         | Rules                                         |
|--------------------|-----------------------------------------------|
|\<program>          |   begin \<statement list> end                 |
|\<statement list>   |   \<statement> {\<statement>}                 |
|\<statement>        |   ID = \<expression>;                         |
|\<statement>        |   write ( \<expression> );                    |
|\<expression>       |   \<primary> {\<arithmetic op> \<primary>}    |
|\<primary>          |   ID                                          |
|\<primary>          |   INTLITERAL                                  |
|\<arithmetic op>    |   PLUSOP                                      |
|\<arithmetic op>    |   MINUSOP                                     |


## HOW TO USE
1. update source code in source.micro

2. execute `npm run start` to transpile code

3. run `node ./output/app.js` to execute transpiled code
