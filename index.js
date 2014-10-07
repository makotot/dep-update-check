var latestVersion = require('latest-version'),
  semver = require('semver'),
  async = require('async'),
  _ = require('underscore');

var path = require('path');

var pkgJson = require('./package.json');

var deps = _.union(_.keys(pkgJson.dependencies), _.keys(pkgJson.devDependencies));


module.exports = function (done) {

  var versionList = [];

  async.each(deps, function (dep, callback) {
    latestVersion(dep, function (err, latest) {
      if (err) {
        throw err;
      }

      var current = require(path.resolve(process.cwd(), 'node_modules', dep, 'package.json')).version;

      if (semver.lt(current, latest)) {
        versionList.push({
          name: dep,
          current: current,
          latest: latest
        });
      }

      callback();
    });

  }, function (err) {
    if (err) {
      throw err;
    }

    return done(versionList);
  });

};

