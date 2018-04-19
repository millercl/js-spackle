var test = require( 'tape' )
var unit = require( '../curie' )
var alias = unit.alias
var term = unit.term

var spec_ex_03 = require( './assets/src/spec_ex_03.json' )
var spec_ex_09 = require( './assets/src/spec_ex_09.json' )
var spec_ex_53 = require( './assets/src/spec_ex_53.json' )

test( 'alias( spec_ex_53, "@id" ) == [ "url" ] '
  , function ( t ) {
      t.deepEqual( alias( spec_ex_53, '@id' ), [ 'url' ] )
      t.end()
    }
)
test( 'alias( spec_ex_53["@context"], "@id" ) == [ "url" ] '
  , function ( t ) {
      t.deepEqual( alias( spec_ex_53['@context'], '@id' ), [ 'url' ] )
      t.end()
    }
)
test( 'term( spec_ex_09, "notdefined" ) == undefined'
  , function ( t ) {
      t.equal( term( spec_ex_09, 'notdefined' ), undefined )
      t.end()
    }
)

test( 'term( spec_ex_09, "name" ) == "name"'
  , function ( t ) {
      t.equal( term( spec_ex_09, 'name' ), 'name' )
      t.end()
    }
)
test( 'term( spec_ex_09["@context"], "name" ) == "name"'
  , function ( t ) {
      t.equal( term( spec_ex_09['@context'], 'name' ), 'name' )
      t.end()
    }
)
test( 'term( spec_ex_03, "http://schema.org/name" ) == "name"'
  , function ( t ) {
      t.equal( term( spec_ex_03, 'http://schema.org/name' ), 'name' )
      t.end()
    }
)
