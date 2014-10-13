var signupRoutes = require('./routes/signupRoutes');
var loginRoutes = require('./routes/loginRoutes');
var userViewRoutes = require('./routes/userViewRoutes');
var userApiRoutes = require('./routes/userApiRoutes');
var organisationViewRoutes = require('./routes/organisationViewRoutes');
var organisationApiRoutes = require('./routes/organisationApiRoutes');
var teamViewRoutes = require('./routes/teamViewRoutes');
var teamApiRoutes = require('./routes/teamApiRoutes');
var passport = require('./passportConfig');

exports.signupRoutes = signupRoutes;
exports.loginRoutes = loginRoutes;
exports.userViewRoutes = userViewRoutes;
exports.userApiRoutes = userApiRoutes;
exports.organisationViewRoutes = organisationViewRoutes;
exports.organisationApiRoutes = organisationApiRoutes;
exports.teamViewRoutes = teamViewRoutes;
exports.teamApiRoutes = teamApiRoutes;
exports.passport = passport;

