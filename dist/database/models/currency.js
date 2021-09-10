"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('currency');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const CurrencySchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        symbol: {
            type: String,
        },
        active: {
            type: Boolean,
            default: false
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
    CurrencySchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    CurrencySchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    CurrencySchema.set('toJSON', {
        getters: true,
    });
    CurrencySchema.set('toObject', {
        getters: true,
    });
    return database.model('currency', CurrencySchema);
};
//# sourceMappingURL=currency.js.map