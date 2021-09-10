"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('discounts');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const DiscountsSchema = new Schema({
        businessID: {
            type: Schema.Types.ObjectId,
            ref: 'business',
        },
        codeName: {
            type: String,
            required: true,
        },
        discountPercentage: {
            type: Number,
            min: 0.01,
        },
        expirationDate: {
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
    DiscountsSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    DiscountsSchema.index({ codeName: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            codeName: { $type: 'string' },
        },
    });
    DiscountsSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    DiscountsSchema.set('toJSON', {
        getters: true,
    });
    DiscountsSchema.set('toObject', {
        getters: true,
    });
    return database.model('discounts', DiscountsSchema);
};
//# sourceMappingURL=discounts.js.map