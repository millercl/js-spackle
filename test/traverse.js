var test = require( 'tape' )
var unit = require( '../traverse' )
var has = unit.has
var path = unit.path
var pick = unit.pick
var prune = unit.prune
var s = unit.s

var spec_ex_09 = require( './assets/src/spec_ex_09.json' )
var spec_ex_09a = require( './assets/src/spec_ex_09a.json' )

test( 'has( undefined ) throws TypeError'
  , function ( t ) {
      t.throws(
          function ( t ) {
            has( undefined )
          }
        , TypeError
      )
      t.end()
    }
)
test( 'has( null ) throws TypeError'
  , function ( t ) {
      t.throws(
          function ( t ) {
            has( null )
          }
        , TypeError
      )
      t.end()
    }
)
test( 'has( {} ) throws TypeError'
  , function ( t ) {
      t.throws(
          function ( t ) {
            has( {} )
          }
        , TypeError
      )
      t.end()
    }
)
test( 'path( { a: 0, b: 1 }, has( "a" ) ) == { a: 0 }'
  , function ( t ) {
      t.deepEqual( path( { a: 0, b: 1 }, has( 'a' ) ), { a: null } )
      t.end()
    }
)
test( 'path( { a: 0, b: 1 }, has( "c" ) ) == {}'
  , function ( t ) {
      t.deepEqual( path( { a: 0, b: 1 }, has( 'c' ) ), {} )
      t.end()
    }
)
test( 'path( { a: 0, b: 1 }, has( "a", 0 ) ) == { a: null }'
  , function ( t ) {
      t.deepEqual( path( { a: 0, b: 1 }, has( 'a', 0 ) ), { a: null } )
      t.end()
    }
)
test( 'path( { a: 0, b: 1 }, has( "a", 1 ) ) == {}'
  , function ( t ) {
      t.deepEqual( path( { a: 0, b: 1 }, has( 'a', 1 ) ), {} )
      t.end()
    }
)
test( 'path( [ "a", "b" ], has( 0, "a" ) ) == { 0: null }'
  , function ( t ) {
      t.deepEqual( path( [ 'a', 'b' ], has( 0, 'a' ) ), { 0: null } )
      t.end()
    }
)
test( 'path( [ "a", "b" ], has( 0, "b" ) ) == {}'
  , function ( t ) {
      t.deepEqual( path( [ 'a', 'b' ], has( 0, 'b' ) ), {} )
      t.end()
    }
)
test( 'path( [ "a", "b" ], has( [ 0, 1 ] ) ) == { 0: null, 1: null }'
  , function ( t ) {
      t.deepEqual( path( [ 'a', 'b' ], has( [ 0, 1 ] ) ), { 0: null, 1: null } )
      t.end()
    }
)
test( 'path( [ "a", "b" ], has( [ 0, 1 ], "a" ) ) == { 0: null }'
  , function ( t ) {
      t.deepEqual( path( [ 'a', 'b' ], has( [ 0, 1 ], 'a' ) ), { 0: null } )
      t.end()
    }
)
test( 'prune( spec_ex_09, "@graph", has( /.*/, "@id", /0/ ), "@id" )'
  + ' == { "@graph": [ { "@id": "_:b0" } ] }'
  , function ( t ) {
      t.deepEqual(
        prune( spec_ex_09, '@graph', has( /.*/, '@id', /0/ ), '@id' )
        , { '@graph': [ { '@id': '_:b0' } ] }
      )
      t.end()
    }
)

test( 'path( undefined ) == undefined'
  , function ( t ) {
      t.equal( undefined === path( undefined ), true )
      t.end()
    }
)
test( 'path( {} ) == null'
  , function ( t ) {
      t.deepEqual( path( {} ), null )
      t.end()
    }
)
test( 'path( { a: 0 }, "a" ) == { a: null }'
  , function ( t ) {
      t.deepEqual( path( { a: 0 }, 'a' ), { a: null } )
      t.end()
    }
)
test( 'path( { a: 0, ab: 1 }, /a/ ) == { a: null, ab: null }'
  , function ( t ) {
      t.deepEqual(
          path( { a: 0, ab: 1 }, /a/ )
        , { a: null, ab: null }
      )
      t.end()
    }
)
test( 'path( { a: 0, ab: 1 }, [ "a", "ab" ] ) == { a: null, ab: null }'
  , function ( t ) {
      t.deepEqual(
          path( { a: 0, ab: 1 }, [ 'a', 'ab' ] )
        , { a: null, ab: null }
      )
      t.end()
    }
)
test( 'path( spec_ex_09, "@graph", /.*/ )'
  + ' == { "@graph": { 0: null, 1: null } }'
  , function ( t ) {
      t.deepEqual(
          path( spec_ex_09, '@graph', /.*/ )
        , { '@graph': { 0: null, 1: null } }
      )
      t.end()
    }
)
test( 'path( spec_ex_09.json, "@graph", s( /b0/ ) )'
  + ' == { "@graph": { 0: null } }'
  , function ( t ) {
      t.deepEqual(
          path( spec_ex_09, '@graph', s( /b0/ ) )
        , { '@graph': { 0: null } }
      )
      t.end()
    }
)
test( 'path( [ "a", "b" ], 0 ) == { 0: null }'
  , function ( t ) {
      t.deepEqual( path( [ 'a', 'b' ], 0 ), { 0: null } )
      t.end()
    }
)
test( 'path( [ "a", "b" ], 0, "a" ) == { 0: { "a": null } }'
  , function ( t ) {
      t.deepEqual( path( [ 'a', 'b' ], 0, 'a' ), { 0: { 'a': null } } )
      t.end()
    }
)

test( 'pick( undefined ) === undefined'
  , function ( t ) {
      t.equal( undefined === pick( undefined ), true )
      t.end()
    }
)
test( 'pick( [] ) == []'
  , function ( t ) {
      t.deepEqual( pick( [] ), [] )
      t.end()
    }
)
test( 'pick( 0 ) == 0'
  , function ( t ) {
      t.equal( pick( 0 ), 0 )
      t.end()
    }
)
test( 'pick( {} ) == {}'
  , function ( t ) {
      t.deepEqual( pick( {} ), {} )
      t.end()
    }
)
test( 'pick( "string" ) == "string"'
  , function ( t ) {
      t.equal( pick( 'string' ), 'string' )
      t.end()
    }
)
test( 'pick( 0, 0 ) == undefined'
  , function ( t ) {
      t.equal( pick( 0, 0 ), undefined )
      t.end()
    }
)
test( 'pick( 0, /a/ ) == undefined'
  , function ( t ) {
      t.equal( pick( 0, /a/ ), undefined )
      t.end()
    }
)
test( 'pick( 0, [] ) == undefined'
  , function ( t ) {
      t.equal( pick( 0, [] ), undefined )
      t.end()
    }
)
test( 'pick( { a: [ 1, 2 ] }, "a" ) == [ 1, 2 ]'
  , function ( t ) {
      t.deepEqual( pick( { a: [ 1, 2 ] }, 'a' ), [ 1, 2 ] )
      t.end()
    }
)
test( 'pick( { a: { b: { [ 1, 2 ] } }, "a", "b" ) == [ 1, 2 ]'
  , function ( t ) {
      t.deepEqual(
          pick( { a: { b: [ 1, 2 ] } }, 'a', 'b' )
        , [ 1, 2 ]
      )
      t.end()
    }
)
test( 'pick( [ 1, 2 ], 0 ) == 1'
  , function ( t ) {
      t.equal(
          pick( [ 1, 2 ], 0 )
        , 1
      )
      t.end()
    }
)
test( 'pick( { a: [ 1, 2 ] }, "a", 0 ) == 1'
  , function ( t ) {
      t.equal(
          pick( { a: [ 1, 2 ] }, 'a', 0 )
        , 1
      )
      t.end()
    }
)
test( 'pick( { a: [ 1, 2 ] }, /a/ ) == [ 1, 2 ]'
  , function ( t ) {
      t.deepEqual(
          pick( { a: [ 1, 2 ] }, /a/ )
        , [ 1, 2 ]
      )
      t.end()
    }
)
test( 'pick( { a: [ 1, 2 ], ab: [ 3, 4] }, /a/ ) == [ 1, 2, 3, 4 ]'
  , function ( t ) {
      t.deepEqual(
          pick( { a: [ 1, 2 ], ab: [ 3, 4 ] }, /a/ )
        , [ 1, 2, 3, 4 ]
      )
      t.end()
    }
)
test( 'pick( [ 1, 2 ], /.*/ ) == [ 1, 2 ]'
  , function ( t ) {
      t.deepEqual(
          pick( [ 1, 2 ], /.*/ )
        , [ 1, 2 ]
      )
      t.end()
    }
)
test( 'pick( [ -1, 0, 1 ]'
    + ', fn ( v, a, k ) { return c <= 0 } ) == [ -1, 0 ]'
  , function ( t ) {
      var input = [ -1, 0, 1 ]
      var fn = function ( v, a, k ) {
        return v <= 0
      }
      var expected = [ -1, 0 ]
      t.deepEqual(
          pick( input, fn )
        , expected
      )
      t.end()
    }
)

test( 'prune( undefined ) === undefined'
  , function ( t ) {
      t.equal( undefined === prune( undefined ), true )
      t.end()
    } )
test( 'prune( [] ) == []'
  , function ( t ) {
    t.deepEqual( prune( [] ), [] )
    t.end()
  } )
test( 'prune( 0 ) == 0'
  , function ( t ) {
    t.equal( prune( 0 ), 0 )
    t.end()
  } )
test( 'prune( {} ) == {}'
  , function ( t ) {
    t.deepEqual( prune( {} ), {} )
    t.end()
  } )
test( 'prune( "string" ) == "string"'
  , function ( t ) {
    t.equal( prune( 'string' ), 'string' )
    t.end()
  } )
test( 'prune( "string", "string" ) == "string"'
  , function ( t ) {
    t.equal( prune( 'string', 'string' ), 'string' )
    t.end()
  } )
test( 'prune( "string", "str" ) === undefined'
  , function ( t ) {
    t.equal( undefined === prune( 'string', 'str' ), true )
    t.end()
  } )
test( 'prune( true ) === true'
  , function ( t ) {
    t.equal( prune( true ), true )
    t.end()
  } )
test( 'prune( false ) === false'
  , function ( t ) {
    t.equal( false === prune( false ), true )
    t.end()
  } )
test( 'prune( null ) === null'
  , function ( t ) {
    t.equal( prune( null ), null )
    t.end()
  } )
test( 'prune( { a:0, b:1 }, /a/ ) == { a:0 }'
  , function ( t ) {
    t.deepEqual( prune( { a:0, b:1 }, /a/ ), { a:0 } )
    t.end()
  } )
test( 'prune( { a:0, b:1 }, "a" ) == { a:0 }'
  , function ( t ) {
    t.deepEqual( prune( { a:0, b:1 }, 'a' ), { a:0 } )
    t.end()
  } )
test( 'prune( { "0":0, "1":1 }, 0 ) == { "0":0 }'
  , function ( t ) {
    t.deepEqual( prune( { '0':0, '1':1 }, 0 ), { '0':0 } )
    t.end()
  } )
test( 'prune( { a:0, b:1, c:2 }, [ "a", "b" ] ) == { a:0, b:1 }'
  , function ( t ) {
    t.deepEqual( prune( { a:0, b:1, c:1 }, [ 'a', 'b' ] ), { a:0, b:1 } )
    t.end()
  } )
test( 'prune( [ "a", "b" ], /0/ ) == [ "a" ]'
  , function ( t ) {
    t.deepEqual( prune( [ 'a', 'b' ], /0/ ), [ 'a' ] )
    t.end()
  } )
test( 'prune( [ "a", "b" ], "0" ) == [ "a" ]'
  , function ( t ) {
    t.deepEqual( prune( [ 'a', 'b' ], '0' ), [ 'a' ] )
    t.end()
  } )
test( 'prune( [ "a", "b" ], 0 ) == [ "a" ]'
  , function ( t ) {
    t.deepEqual( prune( [ 'a', 'b' ], 0 ), [ 'a' ] )
    t.end()
  } )
test( 'prune( { a: { d:0 }, ab: { c:1 } }, /a/, /c/ ) == { ab: { c:1 } }'
  , function ( t ) {
    var expected = { ab: { c:1 } }
    var actual = prune( { a: { d:0 }, ab: { c:1 } }, /a/, /c/ )
    t.deepEqual( actual, expected )
    t.notEqual( !!actual.a, 'actual["a"] is defined' )
    t.end()
  } )
test( 'prune( [ "a", [ "b", "c" ] ], /.*/, /0/ ) == [ "a", [ "b" ] ]'
  , function ( t ) {
    t.deepEqual( prune( [ 'a', [ 'b', 'c' ] ], /.*/, /0/  ), [ [ 'b' ] ] )
    t.end()
  } )
test( 'prune( spec_ex_09.json, "@graph", /.*/, "@id" )'
  , function ( t ) {
      var spec_ex_09 = require( './assets/src/spec_ex_09.json' )
      var expected = {
        '@graph': [
            { '@id': '_:b0' }
          , { '@id': 'http://me.markus-lanthaler.com/' }
        ]
      }
      t.deepEqual(
          prune( spec_ex_09, '@graph', /.*/, '@id'  )
        , expected
      )
      t.end()
    }
)
test( 'prune( [ -1, 0, 1 ]'
      + ', fn ( v, a, k ) { return c <= 0 } ) == [ -1, 0 ]'
  , function ( t ) {
      var input = [ -1, 0, 1 ]
      var fn = function ( v, a, k ) {
        return v <= 0
      }
      function _id( term ) {
        return function ( v ) {
          return v['@id'] == term
        }
      }
      var expected = [ -1, 0 ]
      t.deepEqual(
          prune( input, fn )
        , expected
      )
      t.end()
    }
  )
test( 'prune( spec_ex_09.json, "@graph", _id( "_:b0" ) )'
  , function ( t ) {
      var spec_ex_09 = require( './assets/src/spec_ex_09.json' )
      var expected = {
        '@graph': [
            {
              '@id': '_:b0'
              , name: 'Dave Longley'
            }
        ]
      }
      function _id( term ) {
        return function ( v, a, k ) {
          return v['@id'] == term
        }
      }
      t.deepEqual(
          prune( spec_ex_09, '@graph', _id( '_:b0' ) )
        , expected
      )
      t.end()
    }
  )

test( 's( [ "_:b0", /.com/ ] )'
  , function ( t ) {
      var expected = {
        '@graph': [
           {
              '@id': '_:b0'
              , name: 'Dave Longley'
            }
           , {
              '@id': 'http://me.markus-lanthaler.com/'
              , knows: {
                  '@id': '_:b0'
                }
              , name: 'Markus Lanthaler'
            }
          ]
      }
      var actual = prune( spec_ex_09, '@graph', s( [ '_:b0', /.com/ ] ) )
      t.deepEqual(
        actual
        , expected
      )
      t.end()
    }
)
test( 's( null ) throws TypeError'
  , function ( t ) {
      t.throws(
          function ( t ) {
            prune( spec_ex_09, '@graph', s( null ) )
          }
        , TypeError
      )
      t.end()
    }
)
test( 's( {} ) throws TypeError'
  , function ( t ) {
      t.throws(
          function ( t ) {
            prune( spec_ex_09, '@graph', s( {} ) )
          }
        , TypeError
      )
      t.end()
    }
)
test( 's( /_:b.*/ )'
  , function ( t ) {
      var expected = {
        '@graph': [
          {
            '@id': '_:b0'
            , name: 'Dave Longley'
          }
        ]
      }
      t.deepEqual(
          prune( spec_ex_09, '@graph', s( /_:b.*/ ) )
        , expected
      )
      t.end()
    }
)
test( 's( "_:b0" )'
  , function ( t ) {
      var expected = {
        '@graph': [
          {
            '@id': '_:b0'
            , name: 'Dave Longley'
          }
        ]
      }
      t.deepEqual(
          prune( spec_ex_09, '@graph', s( '_:b0' ) )
        , expected
      )
      t.end()
    }
)
test( 's( undefined ) throws TypeError'
  , function ( t ) {
      t.throws(
          function ( t ) {
            prune( spec_ex_09, '@graph', s( undefined ) )
          }
        , TypeError
      )
      t.end()
    }
)
test( 's( /b0/, spec_ex_09a )'
  , function ( t ) {
      var expected = {
        '_graph': [
          {
            '_id': '_:b0'
            , name: 'Dave Longley'
          }
        ]
      }
      t.deepEqual(
          prune( spec_ex_09a, '_graph', s( /b0/, spec_ex_09a ) )
        , expected
      )
      t.end()
    }
)
test( 's( "_:b0", spec_ex_09a )'
  , function ( t ) {
      var expected = {
        '_graph': [
          {
            '_id': '_:b0'
            , name: 'Dave Longley'
          }
        ]
      }
      t.deepEqual(
          prune( spec_ex_09a, '_graph', s( '_:b0', spec_ex_09a ) )
        , expected
      )
      t.end()
    }
)
