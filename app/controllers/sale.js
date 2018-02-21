let lodash = require('lodash')
module.exports = function (app) {
    let exports = {},
        ArticleM = app.models.articles,
        CategoryM = app.models.categorys;
    let category_home = (rs, req, res, next) => {
        let p = [];
        let nameArr = [];
        try {
            let resData = {
                title: rs.display_name,
                category: rs
            };
            resData.article = lodash.find(rs.articles, {name: '销售渠道'})
            return res.render('sale', resData);
        } catch (err) {
            console.log(err);
            return app.notFound(req, res, next);
        }
    };
    exports.index = (req, res, next) => {
        CategoryM.findOne({
            name: req.params.name
        })
        .populate('articles')
        .then((rs) => {
            if (!rs) return app.notFound(req, res, next);
            return rs;
        })
        .then((rs) => {
            return category_home(rs, req, res, next);
        });
    };
    return exports;
};
