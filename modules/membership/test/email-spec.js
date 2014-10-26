var emails = require('../lib/emails');
var log = require('fooforms-logging').LOG;

describe('sending hello world email', function () {
    it('sends an email', function (done) {
        this.timeout(5000);
        emails.send(function (err, response) {
            log.info(response);
            done(err);
        });
    });
});
