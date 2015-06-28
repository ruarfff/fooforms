/* jshint -W079 */
var mockData = (function () {
    return {
        getMockSession: getMockSession
    };

    function getMockSession() {
        return {
            user: {
                displayName: 'test-user',
                organisations: [{
                    defaultFolder: {
                        forms: []
                    }
                }],
                defaultFolder: {
                    forms: []
                },
                teams: []
            }
        }
    }
})();
