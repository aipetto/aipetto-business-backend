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
        return database.model('businessCategory');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const BusinessCategorySchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        language: {
            type: Schema.Types.ObjectId,
            ref: 'languages',
        },
        categoryImage: [fileSchema_1.default],
        pageUrl: {
            type: String,
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
    BusinessCategorySchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    BusinessCategorySchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    BusinessCategorySchema.set('toJSON', {
        getters: true,
    });
    BusinessCategorySchema.set('toObject', {
        getters: true,
    });
    return database.model('businessCategory', BusinessCategorySchema);
};
//# sourceMappingURL=businessCategory.js.map