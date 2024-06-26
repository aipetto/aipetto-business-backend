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
        return database.model('contacts');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const ContactsSchema = new Schema({
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
        },
        cellphone: {
            type: String,
        },
        whatsapp: {
            type: String,
        },
        source: {
            type: String,
            enum: [
                "facebook",
                "twitter",
                "linkedin",
                "phone_call",
                "aipetto",
                "instagram",
                "email",
                "reddit",
                "in_person",
                "recommended_by_friend",
                "website",
                "youtube",
                "google",
                "whatsapp",
                null
            ],
        },
        country: {
            type: Schema.Types.ObjectId,
            ref: 'country',
        },
        city: {
            type: String,
        },
        addressStreetName: {
            type: String,
        },
        addressStreetNumber: {
            type: String,
        },
        addressStreetComplement: {
            type: String,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        statusContact: {
            type: Boolean,
            default: false
        },
        contactType: {
            type: String,
            enum: [
                "is_customer_prospect",
                "is_customer",
                "is_pet_professional_provider",
                "is_pet_owner",
                null
            ],
        },
        customerID: [{
                type: Schema.Types.ObjectId,
                ref: 'customer',
            }],
        businessID: {
            type: Schema.Types.ObjectId,
            ref: 'business',
        },
        companyName: {
            type: String,
        },
        website: {
            type: String,
        },
        linkedinProfile: {
            type: String,
        },
        instagramProfile: {
            type: String,
        },
        facebookProfile: {
            type: String,
        },
        isDeveloper: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: false
        },
        contactProfilePhoto: [fileSchema_1.default],
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
    ContactsSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    ContactsSchema.index({ location: '2dsphere' });
    ContactsSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    ContactsSchema.set('toJSON', {
        getters: true,
    });
    ContactsSchema.set('toObject', {
        getters: true,
    });
    return database.model('contacts', ContactsSchema);
};
//# sourceMappingURL=contacts.js.map