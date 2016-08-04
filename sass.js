var fs = require('fs'),
    rd = require('readdirp'),
    watch = require('node-watch');


// ********** SASS Compiler config
var $theme = 'aqua', // name of your stylesheet or theme.
    $sasssrc = 'src/scss/' + $theme + '.scss', // set root sass file here relative to sass.js
    $sassdest = 'src/css/' + $theme + '.css', // set target file for sass compilation relative to sass.js
    $outputstyle = 'nested'; // Default: nested Values: nested, expanded, compact, compressed

// ********************************************************

var compile = function () {
    var sc = require('node-sass');
    sc.render({
            file: $sasssrc,
            outFile: $sassdest,
            outputStyle: $outputstyle,
            includePaths: ['./src/libs/foundation/scss'], // additional include paths relative to sass.js
            sourceMap: 'source.map',
            sourceMapEmbed: true
        },
        function (error, result) {
            if (error) {
                console.log('# ERROR: ---------- \n' + error + '\n ---------------');
            }
            else {
                fs.writeFile($sassdest, result.css, function (fserror) {
                    if (fserror) {
                        console.log('# FILESYSTEM ERROR: ---------- \n' + fserror + '\n # -------------------------');
                    }
                    else {
                        console.log('  >  ' + $sassdest + ' updated');
                    }
                });
            }
        });
};


// Benutzereingaben abfertigen
var stdin = process.openStdin();
stdin.addListener("data", function (d) {
    // note:  d is an object, and when converted to a string it will end with a linefeed.
    // so we (rather crudely) account for that with toString() and then substring()
    var cmd = d.toString().trim();
    if (cmd == "c" || cmd == "compile") compile();
    else if (cmd == "1" || cmd == "--nested") $outputstyle = 'nested';
    else if (cmd == "2" || cmd == "--expanded") $outputstyle = 'expanded';
    else if (cmd == "3" || cmd == "--compact") $outputstyle = 'compact';
    else if (cmd == "4" || cmd == "--compressed") $outputstyle = 'compressed';
    else {
        console.log('');
        console.log('  type "c" or "compile" to compile files');
        console.log('');
        console.log('  output style: ' + $outputstyle);
        console.log('');
        console.log("  output style options:");
        console.log('');
        console.log('     --nested       (1)');
        console.log('     --expanded     (2)');
        console.log('     --compact      (3)');
        console.log('     --compressed   (4)');
        console.log('');
    }
});

console.log('');
console.log(' --- sass compiler started. press ctrl+c to stop ---');
console.log('');
console.log('   sass source: ' + $sasssrc);
console.log('   css file: ' + $sassdest);
console.log('   output style: ' + $outputstyle);
console.log('');

// file and directory watchers
watch("src/scss/", function (filename) {
    var ext = filename.split('.')[1];
    if (ext == 'scss' || ext == 'sass') {
        fs.stat("./" + filename, function (err, stat) {
            if (err !== null) return;

            console.log('     ' + filename + ' was changed');
            compile();
        });
    }
});
