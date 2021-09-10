"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('messages');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const MessagesSchema = new Schema({
        from: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        to: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        businessId: {
            type: Schema.Types.ObjectId,
            ref: 'business',
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
    MessagesSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    MessagesSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    MessagesSchema.set('toJSON', {
        getters: true,
    });
    MessagesSchema.set('toObject', {
        getters: true,
    });
    return database.model('messages', MessagesSchema);
};
//# sourceMappingURL=messages.js.map