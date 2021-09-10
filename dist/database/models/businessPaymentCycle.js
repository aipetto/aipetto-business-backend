"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('businessPaymentCycle');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const BusinessPaymentCycleSchema = new Schema({
        businessID: {
            type: Schema.Types.ObjectId,
            ref: 'business',
        },
        cycleStart: {
            type: String,
        },
        cycleEnd: {
            type: String,
        },
        statusPayment: {
            type: String,
            enum: [
                "requires_payment_method",
                "requires_confirmation",
                "requires_action",
                "processing",
                "requires_capture",
                "canceled",
                "succeeded",
                null
            ],
        },
        totalBusinessServiceReservationPeriod: {
            type: Number,
        },
        totalCommisionCalculated: {
            type: Number,
        },
        commisionRateUsedOnCalculation: {
            type: Number,
        },
        businessServiceReservationsUsed: [{
                type: Schema.Types.ObjectId,
                ref: 'serviceReservation',
            }],
        statusCyclePayment: {
            type: String,
            required: true,
            enum: [
                "opened",
                "closed",
                "canceled"
            ],
        },
        customerID: {
            type: Schema.Types.ObjectId,
            ref: 'customer',
        },
        paymentMethod: {
            type: String,
            enum: [
                "acss_debit",
                "afterpay_clearpay",
                "alipay",
                "au_becs_debit",
                "bacs_debit",
                "bancontact",
                "boleto",
                "card",
                "card_present",
                "eps",
                "fpx",
                "giropay",
                "grabpay",
                "ideal",
                "interac_present",
                "oxxo",
                "p24",
                "sepa_debit",
                "sofort",
                "wechat_pay",
                null
            ],
        },
        paymentGatewayReferenceCode: {
            type: String,
        },
        paymentGatewayType: {
            type: String,
            enum: [
                "mercadopago",
                "stripe",
                "paypal",
                null
            ],
        },
        country: {
            type: Schema.Types.ObjectId,
            ref: 'country',
        },
        currency: {
            type: Schema.Types.ObjectId,
            ref: 'currency',
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
    BusinessPaymentCycleSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    BusinessPaymentCycleSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    BusinessPaymentCycleSchema.set('toJSON', {
        getters: true,
    });
    BusinessPaymentCycleSchema.set('toObject', {
        getters: true,
    });
    return database.model('businessPaymentCycle', BusinessPaymentCycleSchema);
};
//# sourceMappingURL=businessPaymentCycle.js.map