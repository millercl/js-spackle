var gulp = require( 'gulp' )
var del = require( 'del' )
var jscs = require( 'gulp-jscs' )
var jshint = require( 'gulp-jshint' )
var jsonlint = require( 'gulp-jsonlint' )
var runSequence = require( 'run-sequence' )
var stylish_jshint = require( 'jshint-stylish' )
var stylish_jscs = require( 'gulp-jscs-stylish' )

var paths = {
    js: [ '*.js', 'lib/*.js', 'test/*.js' ]
    , json: 'package.json'
    , src: 'test/assets/src/*.json'
  }

gulp.task( 'default'
  , function () {
      runSequence( 'src' )
    }
)

gulp.task( 'src'
           , function () {
              runSequence( 'lint', 'style' )
            }
         )

gulp.task( 'lint'
           , function () {
              gulp.src( [ paths.json, paths.src ] )
                .pipe( jsonlint() )
                .pipe( jsonlint.reporter() )
                .pipe( jsonlint.failAfterError() )
            }
         )

gulp.task( 'style'
           , function () {
              gulp.src( paths.js, { base: './' } )
                .pipe( jshint() )
                .pipe( jshint.reporter( 'jshint-stylish' ) )
                .pipe( jscs( { fix: false } ) )
                .pipe( stylish_jscs() )
                .pipe( gulp.dest( './' ) )
            }
         )

function log_json() {
  var o = JSON.stringify( arguments[0], null, 2 )
  console.log( o )
}
