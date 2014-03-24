'use strict';

/**
 * Dependencies
 */
var levelup = require('levelup')
  , sublevel = require('level-sublevel')
  , wrap = require('co-level');

/**
 *
 * @return {[type]} [description]
 */
module.exports = function () {
  var db = sublevel(levelup.apply(null, arguments));
  var wrapped = wrap(db);
  wrapped._db = db;

  wrapped.sublevel = function() {
    var sub = db.sublevel.apply(db, arguments);
    var wrapped = wrap(sub);
    wrapped._db = sub;
    return wrapped;
  }

  return wrapped;
}

/**
 * readableStream for co
 */
module.exports.read = require('./lib/read');

