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
        return database.model('order');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const OrderSchema = new Schema({
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'customer',
            required: true,
        },
        products: [{
                type: Schema.Types.ObjectId,
                ref: 'product',
                required: true,
                min: 1,
            }],
        employee: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        delivered: {
            type: Boolean,
            default: false
        },
        attachments: [fileSchema_1.default],
        businessId: {
            type: Schema.Types.ObjectId,
            ref: 'business',
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
    OrderSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    OrderSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    OrderSchema.set('toJSON', {
        getters: true,
    });
    OrderSchema.set('toObject', {
        getters: true,
    });
    return database.model('order', OrderSchema);
};
//# sourceMappingURL=order.js.map