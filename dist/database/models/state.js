"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('state');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const StateSchema = new Schema({
        name: {
            type: String,
        },
        country: {
            type: Schema.Types.ObjectId,
            ref: 'country',
        },
        initials: {
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
    StateSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    StateSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    StateSchema.set('toJSON', {
        getters: true,
    });
    StateSchema.set('toObject', {
        getters: true,
    });
    return database.model('state', StateSchema);
};
//# sourceMappingURL=state.js.map