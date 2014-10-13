var gcloud = require('gcloud');

var project = gcloud({
    projectId: 'zippy-carving-731',
    credentials: {
        "private_key_id": "aa5fd3f38da21d610f498c91b24928787b6642ea",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAK4g7hZphCXXMgYL\nrglVvA/fDmKvbxOI7Gf35Tm1NkxqW576i1VNRKvtxC1LrWtuqRUeGnZcR0jg4AVa\nOUQiMF+L3k0yR6/4aTJQNSWv2fOL5dwI1V1LW/HcA24PPOoWmwgBOQaXuje3zjun\nssi2Y2lg5sgp5jCWUGN3tSJFIpN/AgMBAAECgYB2Z4X+T3nAkXg+jCqnxli/IhoS\nGOEbE3xNpk+E0ig+BgSPMicUthoAHwnLEy61YuYuqe2slksSz3cFrLhMEEN7VWEo\ny39JJ1Y9CaEG3Kkdvrzchk2tp5jLHP6uKI1BURenvqWDw35cNZMXSJ5+AVnOH59r\nhizAZcG2psMesAfp4QJBAOBk3IuSbYc4vmK6U1R4FOIiKGuCgX7W98zJWX5OSMHH\nJTeMYxHH98E3AZzX5kdlWX4bYoOijYtz6GMMKBTPSksCQQDGp50cN9Ff2B9eYfq+\nMErA3ZRM0YO9OZHduLfOvzFGtqcfiWBaKR+cPphM8/wOHhLdaKRHYrwNH7xQI/K/\nq9sdAkEA2gWls4amHMgpU0uuQ1gZEk4V779xiofbZIIODgaJ8p1Hr90bNN+R/Y0w\nZ+/tsljqxvhck4GQ/Xm0xOe+2dk+WQJAccHgBR2tpx3i8LBY3vpWhFUerFK6Buzl\nq7swfpMby6uizjtj0p2D/XwWyNJav1bXZLSchkhy+Wz38Eh1pO7rvQJAE7thftb9\nT8rHHLcHmzAUmUKrn/oJU+0wBBJ4odCksZcVMqg5SBjmKE3wws3KEwhZ8MpxKXK5\n3fWIQ4C6PZlcWQ\u003d\u003d\n-----END PRIVATE KEY-----\n",
        "client_email": "418935202925-h9s15gbkjghhulp7ko4r4pit1gqc62ah@developer.gserviceaccount.com",
        "client_id": "418935202925-h9s15gbkjghhulp7ko4r4pit1gqc62ah.apps.googleusercontent.com",
        "type": "service_account"
    }
});

var userFilesBucket = project.storage.bucket({
    bucketName: 'fooforms-user-files'
});

module.exports = userFilesBucket;
