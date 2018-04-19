# spackle
## Similar Projects
 * [gremlin](https://github.com/tinkerpop/gremlin)
 * [jsonpath](http://goessner.net/articles/JsonPath/)
 * [jsoniq](http://www.jsoniq.org/)

## Modules/API
### curie
### alias( context, keyword )
where:
 * `keyword` is a [JSON-LD keyword](http://www.w3.org/TR/2014/REC-json-ld-20140116/#aliasing-keywords)

and returns
 * aliases as an `Array`

### term( context, slug )
where:
 * `slug` is an term, CURIE, or URL

and returns
 * term as `String`

### traverse
```js
var traverse = require( 'spackle/traverse' )
```

#### What are the JSON-LD rules on `null` and `undefined` values?
Some `null` values are allowed. `undefined` is not mentioned.
> The null value<strike>, which</strike> is typically used to clear or forget data.
> --[JSON-LD 1.0](http://www.w3.org/TR/2014/REC-json-ld-20140116/#dfn-null)

#### How does `traverse` compare with jsonpath?
jsonpath is derivative of XPath for JSON trees.
It is similar to [traverse.path]() and [traverse.prune]().

[jsonpath](https://www.npmjs.com/package/jsonpath)

Comparisons cannot be made using regular expressions or custom functions
because it uses [static-eval]() for script expressions.

---
**examples/jsonpath.js**
```js
var jsonpath = require( 'jsonpath' )
var spec_ex_09a = require( '../test/assets/src/spec_ex_09a.json' )
var b0 = jsonpath.query( spec_ex_09a, '$._graph[?(@._id=="_:b0")]' )
console.log( b0 )
```
```
[ { _id: '_:b0', name: 'Dave Longley' } ]
```

#### has( traversal [, traversal [, ... ] ] )
look ahead/deeper into a json composition
to determine presence of properties, indices, or values
which match the traversal expressions

where:
  * `traversal` is a
    * `String`
    * `Number`
    * `RegExp`
    * `Array` enumerating descrete values: `String` or `Number` for `Array.prototype.indexOf`
    * `Function` with a specific signature (see heading: [filter( value, attribute, keys )]())

and returns:
  * a filtering function of the traversals which returns Boolean

```
bool: f( value, attribute, keys )
```

#### path( json [, traversal [, ... ] ] )
discrete index, property, and value matches for the given traversals

where:
  * `json` is an instance composed of nested objects and arrays not necessarily jsonld
  * `traversal` is a
    * `String`
    * `Number`
    * `RegExp`
    * `Array` enumerating descrete values: `String` or `Number` for `Array.prototype.indexOf`
    * `Function` with a specific signature (see heading: [filter( value, attribute, keys )]())

and returns:
  * an `Object` tree with properties as matches, `Object` value as children, and `null` values as leaves

#### pick( json [, traversal [, ... ] ] )
select leaf values without preserving heirarchy

where:
  * `json` is an instance composed of nested objects and arrays not necessarily jsonld
  * `traversal` is a String, Number, RegExp, or Array composed of values thereof

and returns:
  * an array of values which may be compositions

how is `pick` different from `Array.prototype.map`?
`map` has a static return length while `pick` is variable.
`pick`'s selection branches as traversal terms permit and concatenates the tips.

#### prune( json [, traversal, [ ... ] ] )
creates a subtree with an equivalent root and depth/height equal to or less than the source

where:
  * `json` is an instance composed of nested objects and arrays; not necessarily JSON-LD
  * `traversal` is a
    * `String`
    * `Number`
    * `RegExp`
    * `Array` enumerating descrete values: `String` or `Number` for `Array.prototype.indexOf`
    * `Function` with a specific signature (see heading: [filter( element, index, array, child )]())

and returns:
  * either a top-level array or object: same as `json` argument

#### s( subject [, context ] )
subject filter expression: compares expression to the value of the '@id' property of graph elements


where:
  * `subject` is a String, RegExp, or Array of such elements
  * `context` is an optional JSON-LD context for aliased keywords

and returns:
  * a filtering function derived from the subject argument
```
bool: f( value, attribute, keys )
```
---
```json
{
  "@context": {
    "name": "http://xmlns.com/foaf/0.1/name",
    "knows": "http://xmlns.com/foaf/0.1/knows"
  },
  "@graph": [
    {
      "@id": "_:b0",
      "name": "Dave Longley"
    },
    {
      "@id": "http://me.markus-lanthaler.com/",
      "knows": {
        "@id": "_:b0"
      },
      "name": "Markus Lanthaler"
    }
  ]
}
```
```js
pick( spec_ex_9, '@graph', s( /b0/ ) )
```
```json
[ "_:b0" ]
```

#### filter( value, attribute, keys )
Traversal arguments may be a filtering function with a specific signature, returning a boolean.
The function is called for each entry in the source `Array` or `Object`.
The signature is similiar to the `Array.prototype.forEach` parameter
  except that because the source may not be an `Array`, `attribute` is not necessarily a numeric index.
Instead, it may be an `Object` property.
`keys` is always an `Array` from `Object.keys` on an `Array` or `Object` argument.

---
**examples/logfilter.js**
```js
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
```
```*
input: { '@context':
   { name: 'http://xmlns.com/foaf/0.1/name',
     knows: 'http://xmlns.com/foaf/0.1/knows' },
  '@graph':
   [ { '@id': '_:b0', name: 'Dave Longley' },
     { '@id': 'http://me.markus-lanthaler.com/',
       knows: [Object],
       name: 'Markus Lanthaler' } ] }
call: mycontextfilter( value= { name: 'http://xmlns.com/foaf/0.1/name',
  knows: 'http://xmlns.com/foaf/0.1/knows' } attribute= @context keys= [ '@context', '@graph' ]  )
call: mycontextfilter( value= [ { '@id': '_:b0', name: 'Dave Longley' },
  { '@id': 'http://me.markus-lanthaler.com/',
    knows: { '@id': '_:b0' },
    name: 'Markus Lanthaler' } ] attribute= @graph keys= [ '@context', '@graph' ]  )
output: { '@context':
   { name: 'http://xmlns.com/foaf/0.1/name',
     knows: 'http://xmlns.com/foaf/0.1/knows' } }
call: mygraphfilter( value= { '@id': '_:b0', name: 'Dave Longley' } attribute= 0 keys= [ '0', '1' ]  )
call: mygraphfilter( value= { '@id': 'http://me.markus-lanthaler.com/',
  knows: { '@id': '_:b0' },
  name: 'Markus Lanthaler' } attribute= 1 keys= [ '0', '1' ]  )
output: { '@graph': [ { '@id': '_:b0', name: 'Dave Longley' } ] }
```

