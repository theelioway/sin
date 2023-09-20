require('jsdom-global')()
global.jQuery = require('jquery')
global.$ = global.jQuery
global.expect = require('chai').use(require('chai-dom')).expect
global.should = require('chai')
  .use(require('chai-dom'))
  .should()

exports.AdonTesterSuite = function(testname, script, html, tests) {
  describe(testname, function() {
    var mylib

    before(done => {
      mylib = require(script) || window.mylib
      done()
    })

    beforeEach(done => {
      document.body.innerHTML = html
      done()
    })

    tests()

    after(done => {
      // cleanup();
      done()
    })
  })
}
