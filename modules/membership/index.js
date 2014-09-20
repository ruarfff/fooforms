var signupRoutes = require('./routes/signupRoutes');
var loginRoutes = require('./routes/loginRoutes');
var userRoutes = require('./routes/userRoutes');
var passport = require('./passportConfig');

exports.signupRoutes = signupRoutes;
exports.loginRoutes = loginRoutes;
exports.userRoutes = userRoutes;
exports.passport = passport;

