var test = require( 'tape' )
var unit = require( '../symbol' )
var at = unit.at

var spec_ex_59 = require( './assets/src/spec_ex_53.json' )

test( 'at().id == "@id"'
  , function ( t ) {
      t.equal( at().id, '@id' )
      t.end()
    }
)

test( 'at( spec_ex_59 ).id == "url"'
  , function ( t ) {
      t.equal( at( spec_ex_59 ).id, 'url' )
      t.end()
    }
)
