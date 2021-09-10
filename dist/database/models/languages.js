"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('languages');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const LanguagesSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        active: {
            type: Boolean,
            default: false
        },
        languageCode: {
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
    LanguagesSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    LanguagesSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    LanguagesSchema.set('toJSON', {
        getters: true,
    });
    LanguagesSchema.set('toObject', {
        getters: true,
    });
    return database.model('languages', LanguagesSchema);
};
//# sourceMappingURL=languages.js.map