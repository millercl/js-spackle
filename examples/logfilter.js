var traverse = require( '../traverse' )

function mycontextfilter( value, attribute, keys ) {
  console.log( 'call: mycontextfilter(', 'value=', value, 'attribute=', attribute, 'keys=', keys, ' )' )
  if ( attribute == '@context' ) {
    return true
  }
  return false
}

function mygraphfilter( value, attribute, keys ) {
  console.log( 'call: mygraphfilter(', 'value=', value, 'attribute=', attribute, 'keys=', keys, ' )' )
  if ( attribute == 0 ) {
    return true
  }
  return false
}

var spec_ex_9 = require( '../test/assets/src/spec_ex_9.json' )
console.log( 'input:', spec_ex_9 )
var o
o = traverse.prune( spec_ex_9, mycontextfilter )
console.log( 'output:', o )
o = traverse.prune( spec_ex_9, '@graph', mygraphfilter )
console.log( 'output:', o )

