const uuid = require('node-uuid');
const crypto = require('crypto');

function random() {
    var uid = uuid.v1();
    var md5 = crypto.createHash('md5');
    md5.update(uid);
    return md5.digest('hex');
}

function md5ByString(str) {
    var md5 = crypto.createHash('md5');
    md5.update(str);
    return md5.digest('hex');
}

function md5ByFile(filePath) {
    var crypto = require('crypto');
    var fs = require('fs');

    return new Promise(function (resolve) {
        var stream = fs.createReadStream(filePath);
        var fsHash = crypto.createHash('md5');

        stream.on('data', function (d) {
            fsHash.update(d);
        });

        stream.on('end', function () {
            var md5 = fsHash.digest('hex');
            resolve(md5);
        });
    });
}

module.exports = {random: random, md5ByFile: md5ByFile, md5ByString: md5ByString};