var emails = require('../lib/emails');
var log = require('fooforms-logging').LOG;

describe.skip('sending hello world email', function () {
    it('sends an email', function (done) {
        this.timeout(10000); // This takes ages for some reason
        emails.send(function (err, response) {
            log.info(response);
            done(err);
        });
    });
});
