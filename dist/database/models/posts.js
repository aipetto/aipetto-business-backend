"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fileSchema_1 = __importDefault(require("./schemas/fileSchema"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('posts');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const PostsSchema = new Schema({
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        postHeaderImage: [fileSchema_1.default],
        postDocRelated: [fileSchema_1.default],
        postUrl: {
            type: String,
        },
        authors: [{
                type: Schema.Types.ObjectId,
                ref: 'user',
            }],
        postCategory: [{
                type: Schema.Types.ObjectId,
                ref: 'postCategories',
            }],
        comments: [{
                type: Schema.Types.ObjectId,
                ref: 'postComments',
            }],
        source: {
            type: String,
        },
        language: {
            type: Schema.Types.ObjectId,
            ref: 'languages',
        },
        country: {
            type: Schema.Types.ObjectId,
            ref: 'country',
        },
        tenant: {
            type: Schema.Types.ObjectId,
            ref: 'tenant',
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        importHash: { type: String },
    }, { timestamps: true });
    PostsSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    PostsSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    PostsSchema.set('toJSON', {
        getters: true,
    });
    PostsSchema.set('toObject', {
        getters: true,
    });
    return database.model('posts', PostsSchema);
};
//# sourceMappingURL=posts.js.map