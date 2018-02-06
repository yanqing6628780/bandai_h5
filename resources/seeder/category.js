let lodash = require('lodash');

module.exports = function(db) {
    let Model = db.categorys;
    let modelName = Model.modelName;
    let exports = {};

    exports.run = function() {
        let data = [
            {
                display_name: "海贼王",
                name: "onepiece",
                parent_id: null
            },
            {
                display_name: "迪士尼",
                name: "disney",
                parent_id: null
            },
            {
                display_name: "龙珠",
                name: "dragonball",
                parent_id: null
            }
        ];
        let childrenData = [
            {
                display_name: "最新资讯",
                name: "news",
                parent_id: null
            },
            {
                display_name: "产品测评",
                name: "products",
                parent_id: null
            }
        ];
        return Model.remove().then(() => {
            return Model.create(data)
                .then(function (docs) {
                    // console.log(modelName, docs);
                    console.log(modelName + ' insert success.');
                    return docs;
                }).then(function (docs) {
                    let childrenArr = [];
                    docs.forEach((item) => {
                        let child = lodash.cloneDeep(childrenData);
                        child[0].parent_id = child[1].parent_id = item._id;
                        childrenArr = childrenArr.concat([], child);
                    });
                    return Model.create(childrenArr);
                })
                .catch(function (err) {
                    console.log(modelName + ' insert failed.err:');
                    console.log(err);
                });
        }).catch((err) => {
            if (err) console.log('remove error', err);
        });
    };

    return exports;
};
