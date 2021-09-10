"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('wallet');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const WalletSchema = new Schema({
        totalCredits: {
            type: Number,
            min: 0,
        },
        aipettoPoints: {
            type: Number,
            min: 0,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
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
    WalletSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    WalletSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    WalletSchema.set('toJSON', {
        getters: true,
    });
    WalletSchema.set('toObject', {
        getters: true,
    });
    return database.model('wallet', WalletSchema);
};
//# sourceMappingURL=wallet.js.map