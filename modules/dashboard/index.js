var path = require('path');

var dashboardApiRoutes = require('./routes/dashboardApiRoutes');
var dashboardViewRoutes = require('./routes/dashboardViewRoutes');

exports.dashboardApiRoutes = dashboardApiRoutes;
exports.dashboardViewRoutes = dashboardViewRoutes;

exports.mainView = path.join(__dirname, 'views/index');
