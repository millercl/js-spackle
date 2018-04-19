( function ( root ) {

  var at = {
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

  function alias( context, keyword ) {
    if ( context && context['@context'] ) {
      context = context['@context']
    }
    var aliases = []
    var keys = Object.keys( context )
    var keywords = _values( at )
    keys.forEach( function ( element ) {
      if ( context[element] === keyword ) {
        aliases.push( element )
      }
    } )
    return aliases
  }

  function term( context, slug ) {
    if ( context && context['@context'] ) {
      context = context['@context']
    }
    if ( context[slug] ) {
      return slug
    }
    var keys = Object.keys( context )
    for ( var i=0; i<keys.length; i++ ) {
      if ( context[keys[i]] === slug ) {
        return keys[i]
      }
    }
    return undefined
  }

  function _values( object ) {
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
          return {
            alias: alias
            , term: term
          }
        }
    )
  } else if ( typeof exports === 'object' ) {
    module.exports = {
      alias: alias
      , term: term
    }
  } else {
    root.curie = {
      alias: alias
      , term: term
    }
  }

} )( this )
