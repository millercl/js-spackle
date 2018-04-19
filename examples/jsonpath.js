var jsonpath = require( 'jsonpath' )
var spec_ex_09a = require( '../test/assets/src/spec_ex_09a.json' )
var b0 = jsonpath.query( spec_ex_09a, '$._graph[?(@._id=="_:b0")]' )
console.log( b0 )
