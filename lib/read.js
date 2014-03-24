
/**
 * stream2 for co 
 * @param  {ReadStream} res
 * @return {Function}
 */
module.exports = function read(res) {
  return function(done){

    function onreadable() {
      // got a "readable" event, try to read a Buffer
      cleanup();
      check();
    }

    function onend() {
      // got an "end" event, send `null` as the value to signify "EOS"
      cleanup();
      done(null, null);
    }

    function onerror(err) {
      // got an "error" event while reading, pass it upstream...
      cleanup();
      done(err);
    }

    function cleanup() {
      res.removeListener('readable', onreadable);
      res.removeListener('end', onend);
      res.removeListener('error', onerror);
    }

    function check() {
      var buf = res.read();
      if (buf) {
        // got a Buffer, send it!
        done(null, buf);
      } else {
        // otherwise, wait for any of a "readable", "end", or "error" event...
        // wow, streams2 kinda sucks, doesn't it?
        res.on('readable', onreadable);
        res.on('end', onend);
        res.on('error', onerror);
      }
    }

    // kick things off...
    check();
  };
}