( function ( root ) {

  function alias( context, keyword ) {
    if ( context && context['@context'] ) {
      context = context['@context']
    }
    var aliases = []
    var c = Object.keys( context )
    var k = values( keywords )
    c.forEach( function ( element ) {
      if ( context[element] === keyword ) {
        aliases.push( element )
      }
    } )
    if ( aliases.length == 0 ) {
      aliases.push( keyword )
    }
    return aliases.sort()[0]
  }

  var keywords = {
    context: '@context'
    , id: '@id'
    , value: '@value'
    , language: '@language'
    , type: '@type'
    , container: '@container'
    , list: '@list'
    , set: '@set'
    , reverse: '@reverse'
    , index: '@index'
    , base: '@base'
    , vocab: '@vocab'
    , graph: '@graph'
  }

  var symbols = {
    at: function ( context ) {
      if ( context ) {
        var o = {}
        for ( var key in keywords ) {
          o[key] = alias( context, keywords[key] )
        }
        return o
      }
      return keywords
    }
  }

  function values( object ) {
    var keys = Object.keys( object )
    var values = []
    keys.forEach( function ( element ) {
      values.push( object[element] )
    } )
    return values
  }

  /* istanbul ignore next */
  if ( typeof define === 'function' && define.amd ) {
    define( []
      , function () {
          return symbols
        }
    )
  } else if ( typeof exports === 'object' ) {
    module.exports = symbols
  } else {
    root.symbol = symbols
  }

} )( this )
