let mongoose = require('mongoose');
let fn = require('../utils/fn.js');
let ObjectId = mongoose.Types.ObjectId;
module.exports = function (app) {
    let exports = {},
        articleM = app.models.articles,
        categoryM = app.models.categorys;
    exports.detail = (req, res, next) => {
        let id;
        try {
            id = mongoose.Types.ObjectId(req.params.id);
        } catch (error) {
            return app.notFound(req, res, next);
        }
        articleM.findOne({
                _id: id
            })
            .populate('cids')
            .exec()
            .then((rs) => {
                if (!rs) return app.notFound(req, res, next);
                return rs
            })
            .then((data) => {
                res.render('detail', {
                    title: data.name,
                    article: data
                });
            });
    };

    return exports;
};
