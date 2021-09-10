"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('challengesCategories');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const ChallengesCategoriesSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        language: {
            type: Schema.Types.ObjectId,
            ref: 'languages',
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
    ChallengesCategoriesSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    ChallengesCategoriesSchema.index({ name: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            name: { $type: 'string' },
        },
    });
    ChallengesCategoriesSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    ChallengesCategoriesSchema.set('toJSON', {
        getters: true,
    });
    ChallengesCategoriesSchema.set('toObject', {
        getters: true,
    });
    return database.model('challengesCategories', ChallengesCategoriesSchema);
};
//# sourceMappingURL=challengesCategories.js.map