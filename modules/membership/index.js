var signupRoutes = require('routes/signupRoutes');
var loginRoutes = require('routes/loginRoutes');

var Signup = function () {

    this.signupRoutes = signupRoutes;
    this.loginRoutes = loginRoutes;

};

module.exports = Signup;
