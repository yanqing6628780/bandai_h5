let mongoose = require('mongoose');
let fs = require('fs');
let configs = require('../../config');
let path = require('path');
let tableName = 'articles';
let ObjectId = mongoose.Types.ObjectId;
// Schema 结构
let Schema = mongoose.Schema;
let schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    cids: [{
        type: Schema.Types.ObjectId,
        ref: 'categorys'
    }],
    desc: {
        type: String
    },
    content: {
        type: String
    },
    url: {
        type: String
    },
    cover_pic: {
        type: String
    },
    is_top: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});

schema.path('cover_pic').set(function (v) {
    if (v) {
        let filePath = path.join(configs.path.public, v);
        if (!fs.existsSync(filePath)) {
            v = "";
        }
        return v;
    }
});

const Model = mongoose.model(tableName, schema);

// return Promise
// Promise data data[0]总数据量 data[1]文章数据
Model.pagination = (where, page, limit, sort) => {
    let cids = where.cids ? where.cids : undefined;
    delete where.cids;
    let p = Model.find(where);
    if (typeof cids === 'object') {
        let and_where = [];
        for (const cid of cids) {
            and_where.push({ cids: ObjectId(cid)});
        }
        p.and(and_where);
    } else {
        if(cids) {
            p.where('cids', ObjectId(cids));
        }
    }
    p = p.limit(limit).skip(page);
    if(sort) {
        p.sort(sort);
    }
    return Promise.all([
        Model.find(p.getQuery()).count(),
        p
    ]);
};

module.exports = Model;
