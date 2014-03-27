var level = require('./index')
  , memdown = function (l) { return new (require('memdown'))(l) }
  , co = require('co')
  , wrapStream = require('co-from-stream')

var db = level('db', { db: memdown, type: 'json' })

describe('sublevel-co', function () {

  describe('db', function () {
    it('should define the property _odb', function () {
      db._db.should.be.defined;
    })

    it('should have [put, get, del]', function () {
      db.put.should.be.a.Function;
      db.get.should.be.a.Function;
      db.del.should.be.a.Function;
    })
  })

  describe('thunkification', function() {
    it('should wrap [put, get, del]', function (done) {

      db.put('x').should.be.a.Function;
      db.get('x').should.be.a.Function;
      db.del('x').should.be.a.Function;
      done()
    });
  })

  describe('inside co', function(){
    it('should run as a thunk', function(done){

      co(function *() {
        var res = yield db.put('foo', 'bar');
        var res = yield db.get('foo');
        yield db.del('foo');

        res.should.be.exactly('bar');

        return res;
      })(done);
    })
  })

  describe('#sublevel', function () {
    var sub = db.sublevel('s');

    it('should be a function', function () {
      db.sublevel.should.be.a.Function;
    })

    it('should define the property _odb', function () {
      db._db.should.be.defined;
    })

    it('should return a co compatible db', function () {
      sub.get.should.be.a.Function;
      sub.get('x').should.be.a.Function;
    })

    it('should operate inside a co generator', function (done) {
      co(function *() {
        yield sub.put('x', 'y');
        var res = yield sub.get('x');

        res.should.be.exactly('y');
      })(done);
    })
  })

  describe('#readStream', function () {
    it('should yield values from a stream', function (done) {
      co(function *() {
        yield db.put('a', 'b');
        yield db.put('c', 'd');

        var read = wrapStream(db.readStream());

        var data = [], buf;
        while (buf = yield read()) {
          data.push({}[buf.key] = buf.value);
        }

        data.should.be.a.Array;
        data.length.should.be.exactly(2);
        data[0].should.be.exactly('b');
      })(done);
    });
  });
});
