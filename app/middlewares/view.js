var lodash = require('lodash');
module.exports = function (app) {
    let exports = {},
        webCfgM = app.models.web_config;
    exports.getCommonData = function (req, res, next) {
        app.locals.moment = require('moment');
        Promise.all([
            webCfgM.find()
        ]).then((data) => {
            res.locals.web_cfg = lodash.keyBy(data[0], 'key');
            return next();
        });
    };

    return exports;
};
