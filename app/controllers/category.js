let mongoose = require('mongoose');
module.exports = function (app) {
    let exports = {},
        ArticleM = app.models.articles,
        CategoryM = app.models.categorys;
    let category_home = (rs, req, res, next) => {
        let p = [];
        let nameArr = [];
        try {
            for (const x in rs.children) {
                const child = rs.children[x];
                let aP = ArticleM.find({ cids: child._id }).sort({
                    is_top: 'desc',
                    createdAt: 'desc'
                });
                if(child.name == 'news') {
                    aP.limit(4);
                } else {
                    aP.limit(9);
                }
                p.push(aP);
                nameArr.push(child.name);
            }
            Promise.all(p).then((data) => {
                let resData = {
                    title: rs.display_name,
                    category: rs
                };
                for (const x in data) {
                    resData[nameArr[x]] = data[x];
                    resData[nameArr[x]+'_id'] = rs.children[x]._id;
                }
                try {
                    return res.render('category_' + rs.name, resData);
                } catch (err) {
                    throw err;
                }
            }).catch((err) => {
                app.logger.error('查找分类首页数据失败：');
                app.logger.error(err);
                return app.notFound(req, res, next);
            });
        } catch (err) {
            console.log(err);
            return app.notFound(req, res, next);
        }
    };
    exports.index = (req, res, next) => {
        CategoryM.findOne({
            name: req.params.name
        })
        .populate('children')
        .then((rs) => {
            if (!rs) return app.notFound(req, res, next);
            return rs;
        })
        .then((rs) => {
            return category_home(rs, req, res, next);
        });
    };
    exports.id = (req, res, next) => {
        let id;
        try {
            id = mongoose.Types.ObjectId(req.params.id);
        } catch (error) {
            return app.notFound(req, res, next);
        }
        CategoryM.findOne({
            _id: id
        })
        .populate('parent_id')
        .populate({
            path: 'articles',
            options: { sort: { is_top: 'desc', 'createdAt': 'desc'} }
        })
        .exec().then((rs) => {
            if (!rs) return next(new Error('404'));
            return rs;
        }).then((rs) => {
            return res.render('list', {
                title: rs.display_name,
                rs: rs
            });
        });
    };


    return exports;
};
