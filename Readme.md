# Co Sublevel

[![Build Status](https://travis-ci.org/aliem/co-sublevel.png?branch=master)](https://travis-ci.org/aliem/co-sublevel)

*level-sublevel* for *co*

Wraps a sublevel-wrapped levelup with [co-level](https://github.com/juliangruber/co-level) 

## usage

read the `test.js` for more examples.

```js
var level = require('co-sublevel')
  , memdown = function (l) { return new (require('memdown'))(l) }
  , co = require('co')

var db = level('db', { db: memdown, type: 'json' })

co(function *() {
  var sub = db.sublevel('s');

  yield sub.put('x', 'y');

  var res = yield sub.get('x');

  assert(res === 'y');
})();

```

### streams

You can yield a stream coming from levelup database using [co-from-stream](https://github.com/juliangruber/co-from-stream)

```
var wrapStream = require('co-from-stream')

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
})();
```

## License

MIT
