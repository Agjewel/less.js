var path = require('path'),
    fs = require('fs'),
    sys = require('sys');

require.paths.unshift(__dirname, path.join(__dirname, '..'),
                      path.join(__dirname, 'vendor', 'vows'));

var vows = require('lib/vows');
var less = require('lib/less/adapters/server');

fs.readdirSync('test/less').forEach(function (file) {
    toCSS('test/less/' + file, function (err, less) {
        read(path.join('test/css', path.basename(file, '.less')) + '.css', function (e, css) {
            sys.print("- " + file + ": ")
            if (less === css) { sys.print('OK') }
            else if (err) {
                sys.print("!\n  " + (err && err.message));
            } else {
                sys.print("=/=");
            }
            sys.puts("");
        });
    });
});

function toCSS(path, callback) {
    var tree;
    read(path, function (e, str) {
        if (e) { return callback(e) }

        tree = less.parser.parse(str);

        if (less.parser.error) {
            callback(less.parser.error);
        } else {
            callback(null, tree.toCSS([], {frames: []}));
        }
    });
}

function read(path, callback) {
    fs.stat(path, function (e, stats) {
        if (e) return callback(e);
        fs.open(path, process.O_RDONLY, stats.mode, function (e, fd) {
            fs.read(fd, stats.size, 0, "utf8", function (e, data) {
                callback(null, data);
            });
        });
    });
}


vows.tell('LeSS', function () {});



