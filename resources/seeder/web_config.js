module.exports = function (db) {
    var Model = db.web_config; // 注意修改表名称
    var modelName = Model.modelName;
    var exports = {};

    exports.run = function () {
        var data = [
            {
                key: "web_name",
                name: "网站名称",
                value: "Bandi"
            },
            {
                key: "web_keywords",
                name: "网站关键词",
                value: "Bandi"
            },
            {
                key: "web_description",
                name: "网站描述",
                value: "Bandi"
            }
            // {
            //     key: "web_notice",
            //     name: "网站公告",
            //     value: "Bandi"
            // },
            // {
            //     key: "web_copyright",
            //     name: "网站版权信息",
            //     type: 'editor',
            //     value: "©BIRD STUDIO/SHUEISHA,TOEI ANIMATION"
            // }
        ];
        return Model.remove()
            .then(() => {
                return Model.create(data)
                    .then(function (docs) {
                        // console.log(modelName, docs);
                        console.log(modelName + ' insert success.');
                        return docs;
                    })
                    .catch(function (err) {
                        console.log(modelName + ' insert failed.err:');
                        console.log(err);
                    });
            })
            .catch((err) => {
                if (err) console.log('remove error', err);
            });
    };


    return exports;
};
