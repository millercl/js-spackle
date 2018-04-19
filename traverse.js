( function ( root ) {

  var curie = require( './curie' )

  if ( !Array.from ) {
    Array.from = function ( object ) {
      return [].slice.call( object )
    }
  }

  function has( traversal ) {
    _types.apply( this, arguments )
    var cdr = _rest( arguments )
    return function ( v, a, k ) {
      function vak( f ) {
        return f( v, a, k )
      }
      function or( a, b ) {
        return a || b
      }
      function andcdr( e ) {
        return [e].concat( cdr )
      }
      function applyhas( e ) {
        return has.apply( this, e )
      }
      var value
      if ( _is_array( traversal ) ) {
        var every = traversal
          .map( andcdr )
          .map( applyhas )
          .map( vak )
        value = every.concat( false ).reduce( or )
      }
      else if ( _is_function( traversal ) ) {
        value = traversal( v )
      }
      else if ( _is_number( traversal ) ) {
        value = traversal == a
      }
      else if ( _is_regexp( traversal ) ) {
        value = traversal.test( a )
      }
      else if ( _is_string( traversal ) ) {
        value = traversal == a
      }
      var child = true
      if ( value && cdr.length > 0 ) {
        var next = has.apply( this, cdr )
        var keys
        if ( _is_number( v ) || _is_regexp( v ) || _is_string( v ) ) {
          child = next( null, v, null )
        }
        else if ( _is_undefined( v ) || _is_null( v ) ) {
          child = true
        }
        else if ( _is_array( v ) || _is_object( v ) ) {
          keys = Object.keys( v )
          var hits = keys.filter( _is( next, v ) ) || []
          child = hits.length > 0
        }
      }
      return value && child
    }
  }

  function path( json, traversal ) {
    if ( json === undefined ) {
      return undefined
    }
    var traversals = _rest( arguments )
    if ( 0 >= traversals.length ) {
      return null
    }
    var ret, sel
    if ( _is_array( json ) || _is_object( json ) ) {
      var keys = Object.keys( json )
      var hits = keys.filter( _is( traversal, json ) ) || []
      sel = hits.map( function ( hit ) {
        var sub = path.apply(
            this
          , [ json[ hit ] ].concat( _rest( traversals ) )
        )
        return { k: hit, v: sub }
      } )
      ret = _object( sel.map( _values ) )
      return ret
    }
    else if (
         _is_number( json )
      || _is_string( json )
      || _is_boolean( json ) ) {
      ret = {}
      if ( _is_regexp( traversal ) ) {
        ret[json] = null
        return ret
      }
      else {
        ret[json] = null
        return ret
      }
    }
  }

  function pick( json, traversal ) {
    if ( json === undefined ) {
      return undefined
    }
    var traversals = _rest( arguments )
    _types.apply( this, traversals )
    if ( 0 >= traversals.length ) {
      return json
    }
    var ret, sel
    if ( _is_array( json ) || _is_object( json ) ) {
      var keys = Object.keys( json )
      var hits = keys.filter( _is( traversal, json ) ) || []
      sel = hits.map( function ( hit ) {
        return pick.apply(
            this
          , [ json[ hit ] ].concat( _rest( traversals ) )
        )
      } )
      if ( sel.length <= 1 ) {
        ret = sel[0]
      }
      else if ( sel.every( _is_array ) ) {
        ret = []
        ret = ret.concat.apply( ret, sel )
      }
      else {
        ret = sel
      }
      return ret
    }
  }

  function prune( json, traversal ) {
    if ( json === undefined ) {
      return undefined
    }
    var traversals = _rest( arguments )
    _types.apply( this, traversals )
    if ( 0 >= traversals.length ) {
      return json
    }
    var ret, sel
    if ( _is_array( json ) || _is_object( json ) ) {
      var keys = Object.keys( json )
      var hits = keys.filter( _is( traversal, json ) ) || []
      if ( 0 >= hits.length ) {
        return undefined
      }
      var sub = _zip( json, hits )
      if ( _is_array( sub ) ) {
        ret = []
        for ( var i = 0; i < sub.length; i++ ) {
          sel = prune.apply( this, [ sub[i] ].concat( _rest( traversals ) ) )
          if ( sel !== undefined ) {
            ret.push( sel )
          }
        }
      }
      else if ( _is_object( sub ) ) {
        ret = {}
        for ( var k in sub ) {
          sel = prune.apply( this, [ sub[k] ].concat( _rest( traversals ) ) )
          if ( sel !== undefined ) {
            ret[k] = sel
          }
        }
      }
      return ret
    }
    else {
      return _eq( json, traversal )
    }
  }

  function s( exp, context ) {
    _types( exp )
    var aliases
    if ( context ) {
      aliases = curie.alias( context, '@id' )
    }
    return function ( v, a, k ) {
      function vak( f ) {
        return f( v, a, k )
      }
      function or( a, b ) {
        return a || b
      }
      function regexid( id ) {
        return exp.test( v[id] )
      }
      function eqid( id ) {
        return exp == v[id]
      }
      function currycontext( t ) {
        return s( t, context )
      }
      if ( _is_array( exp ) ) {
        var every = exp.map( currycontext ).map( vak )
        return every.concat( false ).reduce( or )
      }
      else if ( _is_null( exp ) ) {
        return true
      }
      else if ( _is_regexp( exp ) ) {
        if ( context ) {
          return aliases.map( regexid ).reduce( or )
        }
        return exp.test( v['@id'] )
      }
      else if ( _is_string( exp ) || _is_number( exp ) ) {
        if ( context ) {
          return aliases.map( eqid ).reduce( or )
        }
        return v['@id'] == exp
      }
      else if ( _is_undefined( exp ) ) {
        return true
      }
    }
  }

  function _eq( v, exp ) {
    if ( _is_boolean( exp ) ) {
      var not_v = !v
      var not_exp = !exp
      if ( v === exp || not_v === not_exp ) {
        return v
      }
      else {
        return undefined
      }
    }
    else if ( _is_string( exp ) ) {
      if ( v === exp ) {
        return v
      }
      else {
        return undefined
      }
    }
    else if ( _is_function( exp ) ) {
      if ( exp( v ) ) {
        return v
      }
      else {
        return undefined
      }
    }
    else if ( _is_regexp( exp ) ) {
      if ( exp.test( v ) ) {
        return v
      }
      else {
        return undefined
      }
    }
    else if ( _is_number( exp ) ) {
      if ( v === exp ) {
        return v
      }
      else {
        return undefined
      }
    }
    throw new TypeError( exp )
  }

  function _is( traversal, origin ) {
    if ( _is_array( traversal ) ) {
      return function ( element, index, array ) {
        var has = traversal.indexOf( element )
        if ( has > -1 ) {
          return true
        }
        else {
          return false
        }
      }
    }
    else if ( _is_function( traversal ) ) {
      return function ( element, index, array ) {
        return traversal( origin[element], element, array )
      }
    }
    else if ( _is_number( traversal ) ) {
      return function ( element, index, array ) {
        return element == traversal
      }
    }
    else if ( _is_regexp( traversal ) ) {
      return function ( element, index, array ) {
        return traversal.test( element )
      }
    }
    else if ( _is_string( traversal ) ) {
      return function ( element, index, array ) {
        return element === traversal
      }
    }
    return function ( element, index, array ) {
      return true
    }
  }

  function _is_array() {
    return Array.isArray( arguments[0] )
  }

  function _is_boolean() {
    return typeof arguments[0] === 'boolean'
  }

  function _is_function() {
    return typeof arguments[0] === 'function'
  }

  function _is_null() {
    return arguments[0] === null
  }

  function _is_number() {
    return typeof arguments[0] === 'number'
  }

  function _is_object() {
    return typeof arguments[0] === 'object'
  }

  function _is_regexp() {
    return arguments[0] instanceof RegExp
  }

  function _is_string() {
    return typeof arguments[0] === 'string'
  }

  function _is_undefined() {
    return arguments[0] === undefined
  }

  function _object( arrayofarrays ) {
    var ret = {}
    arrayofarrays.forEach( function ( array ) {
      ret[array[0]] = array[1]
    } )
    return ret
  }

  function _rest( a ) {
    return Array.from( a ).slice( 1, a.length )
  }

  function _types() {
    function and( a, b ) {
      return a && b
    }
    function types( argument, index ) {
      if ( _is_null( argument ) ) {
        throw new TypeError( 'invalid argument type: null at ' + index )
      }
      else if ( _is_function( argument ) ) {
        return true
      }
      else if ( _is_number( argument ) ) {
        return true
      }
      else if ( _is_object( argument ) ) {
        if ( _is_array( argument ) ) {
          return true
        }
        if ( _is_regexp( argument ) ) {
          return true
        }
        throw new TypeError( 'invalid argument type: object at ' + index )
      }
      else if ( _is_string( argument ) ) {
        return true
      }
      else if ( _is_undefined( argument ) ) {
        throw new TypeError( 'invalid argument type: undefined at ' + index )
      }
    }
    return Array.from( arguments ).map( types ).concat( true ).reduce( and )
  }

  function _values( object ) {
    var ret
    var keys = Object.keys( object )
    function value( key ) {
      return object[key]
    }
    ret = keys.map( value )
    return ret
  }

  function _zip( src, keys ) {
    keys = [].concat( keys )
    var r
    if ( _is_array( src ) ) {
      r = []
      keys.forEach( function ( key ) {
        if ( src[key] !== undefined ) {
          r.push( src[key] )
        }
      } )
    }
    else if ( _is_object( src ) ) {
      r = {}
      keys.forEach( function ( key ) {
        if ( src[key] !== undefined ) {
          r[key] = src[key]
        }
      } )
    }
    return r
  }

  if ( typeof define === 'function' && define.amd ) {
    define( []
      , function () {
          return {
            has: has
            , path: path
            , pick: pick
            , prune: prune
            , s: s
          }
        }
    )
  } else if ( typeof exports === 'object' ) {
    module.exports = {
      has: has
      , path: path
      , pick: pick
      , prune: prune
      , s: s
    }
  } else {
    root.traverse = {
      has: has
      , path: path
      , pick: pick
      , prune: prune
      , s: s
    }
  }

} )( this )
