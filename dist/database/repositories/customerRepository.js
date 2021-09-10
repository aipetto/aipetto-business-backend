"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongooseRepository_1 = __importDefault(require("./mongooseRepository"));
const mongooseQueryUtils_1 = __importDefault(require("../utils/mongooseQueryUtils"));
const auditLogRepository_1 = __importDefault(require("./auditLogRepository"));
const Error404_1 = __importDefault(require("../../errors/Error404"));
const lodash_1 = __importDefault(require("lodash"));
const customer_1 = __importDefault(require("../models/customer"));
const userRepository_1 = __importDefault(require("./userRepository"));
const fileRepository_1 = __importDefault(require("./fileRepository"));
const order_1 = __importDefault(require("../models/order"));
const pet_1 = __importDefault(require("../models/pet"));
const serviceReservation_1 = __importDefault(require("../models/serviceReservation"));
const deals_1 = __importDefault(require("../models/deals"));
const businessPaymentCycle_1 = __importDefault(require("../models/businessPaymentCycle"));
const contacts_1 = __importDefault(require("../models/contacts"));
class CustomerRepository {
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const [record] = yield customer_1.default(options.database).create([
                Object.assign(Object.assign({}, data), { tenant: currentTenant.id, createdBy: currentUser.id, updatedBy: currentUser.id })
            ], options);
            yield this._createAuditLog(auditLogRepository_1.default.CREATE, record.id, data, options);
            return this.findById(record.id, options);
        });
    }
    static update(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(customer_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield customer_1.default(options.database).updateOne({ _id: id }, Object.assign(Object.assign({}, data), { updatedBy: mongooseRepository_1.default.getCurrentUser(options).id }), options);
            yield this._createAuditLog(auditLogRepository_1.default.UPDATE, id, data, options);
            record = yield this.findById(id, options);
            return record;
        });
    }
    static destroy(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(customer_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield customer_1.default(options.database).deleteOne({ _id: id }, options);
            yield this._createAuditLog(auditLogRepository_1.default.DELETE, id, record, options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, order_1.default(options.database), 'customer', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, pet_1.default(options.database), 'customerId', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, serviceReservation_1.default(options.database), 'customerId', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, deals_1.default(options.database), 'customer', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, businessPaymentCycle_1.default(options.database), 'customerID', options);
            yield mongooseRepository_1.default.destroyRelationToMany(id, contacts_1.default(options.database), 'customerID', options);
        });
    }
    static filterIdInTenant(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return lodash_1.default.get(yield this.filterIdsInTenant([id], options), '[0]', null);
        });
    }
    static filterIdsInTenant(ids, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ids || !ids.length) {
                return [];
            }
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const records = yield customer_1.default(options.database)
                .find({
                _id: { $in: ids },
                tenant: currentTenant.id,
            })
                .select(['_id']);
            return records.map((record) => record._id);
        });
    }
    static count(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            return mongooseRepository_1.default.wrapWithSessionIfExists(customer_1.default(options.database).countDocuments(Object.assign(Object.assign({}, filter), { tenant: currentTenant.id })), options);
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(customer_1.default(options.database)
                .findOne({ _id: id, tenant: currentTenant.id })
                .populate('businessId')
                .populate('userId')
                .populate('country')
                .populate('currency')
                .populate('language'), options);
            if (!record) {
                throw new Error404_1.default();
            }
            return this._mapRelationshipsAndFillDownloadUrl(record);
        });
    }
    static findAndCountAll({ filter, limit = 0, offset = 0, orderBy = '' }, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let criteriaAnd = [];
            criteriaAnd.push({
                tenant: currentTenant.id,
            });
            if (filter) {
                if (filter.id) {
                    criteriaAnd.push({
                        ['_id']: mongooseQueryUtils_1.default.uuid(filter.id),
                    });
                }
                if (filter.name) {
                    criteriaAnd.push({
                        name: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.name),
                            $options: 'i',
                        },
                    });
                }
                if (filter.businessId) {
                    criteriaAnd.push({
                        businessId: mongooseQueryUtils_1.default.uuid(filter.businessId),
                    });
                }
                if (filter.uniqueCustomIdentifier) {
                    criteriaAnd.push({
                        uniqueCustomIdentifier: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.uniqueCustomIdentifier),
                            $options: 'i',
                        },
                    });
                }
                if (filter.userId) {
                    criteriaAnd.push({
                        userId: mongooseQueryUtils_1.default.uuid(filter.userId),
                    });
                }
                if (filter.source) {
                    criteriaAnd.push({
                        source: filter.source
                    });
                }
                if (filter.surname) {
                    criteriaAnd.push({
                        surname: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.surname),
                            $options: 'i',
                        },
                    });
                }
                if (filter.birthdateRange) {
                    const [start, end] = filter.birthdateRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            birthdate: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            birthdate: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.gender) {
                    criteriaAnd.push({
                        gender: filter.gender
                    });
                }
                if (filter.whatsApp) {
                    criteriaAnd.push({
                        whatsApp: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.whatsApp),
                            $options: 'i',
                        },
                    });
                }
                if (filter.smsPhoneNumber) {
                    criteriaAnd.push({
                        smsPhoneNumber: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.smsPhoneNumber),
                            $options: 'i',
                        },
                    });
                }
                if (filter.phoneNumber) {
                    criteriaAnd.push({
                        phoneNumber: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.phoneNumber),
                            $options: 'i',
                        },
                    });
                }
                if (filter.address) {
                    criteriaAnd.push({
                        address: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.address),
                            $options: 'i',
                        },
                    });
                }
                if (filter.email) {
                    criteriaAnd.push({
                        email: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.email),
                            $options: 'i',
                        },
                    });
                }
                if (filter.zipCode) {
                    criteriaAnd.push({
                        zipCode: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.zipCode),
                            $options: 'i',
                        },
                    });
                }
                if (filter.city) {
                    criteriaAnd.push({
                        city: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.city),
                            $options: 'i',
                        },
                    });
                }
                if (filter.state) {
                    criteriaAnd.push({
                        state: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.state),
                            $options: 'i',
                        },
                    });
                }
                if (filter.country) {
                    criteriaAnd.push({
                        country: mongooseQueryUtils_1.default.uuid(filter.country),
                    });
                }
                if (filter.billingAddressStreet) {
                    criteriaAnd.push({
                        billingAddressStreet: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.billingAddressStreet),
                            $options: 'i',
                        },
                    });
                }
                if (filter.billingAddressCity) {
                    criteriaAnd.push({
                        billingAddressCity: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.billingAddressCity),
                            $options: 'i',
                        },
                    });
                }
                if (filter.billingAddressState) {
                    criteriaAnd.push({
                        billingAddressState: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.billingAddressState),
                            $options: 'i',
                        },
                    });
                }
                if (filter.billingAddressZipCode) {
                    criteriaAnd.push({
                        billingAddressZipCode: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.billingAddressZipCode),
                            $options: 'i',
                        },
                    });
                }
                if (filter.billingAddressCountry) {
                    criteriaAnd.push({
                        billingAddressCountry: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.billingAddressCountry),
                            $options: 'i',
                        },
                    });
                }
                if (filter.shippingAddressStreet) {
                    criteriaAnd.push({
                        shippingAddressStreet: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.shippingAddressStreet),
                            $options: 'i',
                        },
                    });
                }
                if (filter.shippingAddressCity) {
                    criteriaAnd.push({
                        shippingAddressCity: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.shippingAddressCity),
                            $options: 'i',
                        },
                    });
                }
                if (filter.shippingAddressState) {
                    criteriaAnd.push({
                        shippingAddressState: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.shippingAddressState),
                            $options: 'i',
                        },
                    });
                }
                if (filter.shippingAddressZipCode) {
                    criteriaAnd.push({
                        shippingAddressZipCode: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.shippingAddressZipCode),
                            $options: 'i',
                        },
                    });
                }
                if (filter.shippingAddressCountry) {
                    criteriaAnd.push({
                        shippingAddressCountry: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.shippingAddressCountry),
                            $options: 'i',
                        },
                    });
                }
                if (filter.latitudeRange) {
                    const [start, end] = filter.latitudeRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            latitude: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            latitude: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.longitudeRange) {
                    const [start, end] = filter.longitudeRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            longitude: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            longitude: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.prospectStatus) {
                    criteriaAnd.push({
                        prospectStatus: filter.prospectStatus
                    });
                }
                if (filter.customerStatus) {
                    criteriaAnd.push({
                        customerStatus: filter.customerStatus
                    });
                }
                if (filter.wantToReceiveNotifications === true ||
                    filter.wantToReceiveNotifications === 'true' ||
                    filter.wantToReceiveNotifications === false ||
                    filter.wantToReceiveNotifications === 'false') {
                    criteriaAnd.push({
                        wantToReceiveNotifications: filter.wantToReceiveNotifications === true ||
                            filter.wantToReceiveNotifications === 'true',
                    });
                }
                if (filter.currency) {
                    criteriaAnd.push({
                        currency: mongooseQueryUtils_1.default.uuid(filter.currency),
                    });
                }
                if (filter.balanceRange) {
                    const [start, end] = filter.balanceRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            balance: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            balance: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.shippingAddressStreetNumber) {
                    criteriaAnd.push({
                        shippingAddressStreetNumber: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.shippingAddressStreetNumber),
                            $options: 'i',
                        },
                    });
                }
                if (filter.addressStreetNumber) {
                    criteriaAnd.push({
                        addressStreetNumber: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.addressStreetNumber),
                            $options: 'i',
                        },
                    });
                }
                if (filter.billingAddressStreetNumber) {
                    criteriaAnd.push({
                        billingAddressStreetNumber: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.billingAddressStreetNumber),
                            $options: 'i',
                        },
                    });
                }
                if (filter.addressStreetComplement) {
                    criteriaAnd.push({
                        addressStreetComplement: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.addressStreetComplement),
                            $options: 'i',
                        },
                    });
                }
                if (filter.billingAddressStreetComplement) {
                    criteriaAnd.push({
                        billingAddressStreetComplement: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.billingAddressStreetComplement),
                            $options: 'i',
                        },
                    });
                }
                if (filter.shippingAddressStreetComplement) {
                    criteriaAnd.push({
                        shippingAddressStreetComplement: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.shippingAddressStreetComplement),
                            $options: 'i',
                        },
                    });
                }
                if (filter.facebook) {
                    criteriaAnd.push({
                        facebook: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.facebook),
                            $options: 'i',
                        },
                    });
                }
                if (filter.linkedin) {
                    criteriaAnd.push({
                        linkedin: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.linkedin),
                            $options: 'i',
                        },
                    });
                }
                if (filter.instagram) {
                    criteriaAnd.push({
                        instagram: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.instagram),
                            $options: 'i',
                        },
                    });
                }
                if (filter.website) {
                    criteriaAnd.push({
                        website: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.website),
                            $options: 'i',
                        },
                    });
                }
                if (filter.language) {
                    criteriaAnd.push({
                        language: mongooseQueryUtils_1.default.uuid(filter.language),
                    });
                }
                if (filter.notes) {
                    criteriaAnd.push({
                        notes: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.notes),
                            $options: 'i',
                        },
                    });
                }
                if (filter.createdAtRange) {
                    const [start, end] = filter.createdAtRange;
                    if (start !== undefined &&
                        start !== null &&
                        start !== '') {
                        criteriaAnd.push({
                            ['createdAt']: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined &&
                        end !== null &&
                        end !== '') {
                        criteriaAnd.push({
                            ['createdAt']: {
                                $lte: end,
                            },
                        });
                    }
                }
            }
            const sort = mongooseQueryUtils_1.default.sort(orderBy || 'createdAt_DESC');
            const skip = Number(offset || 0) || undefined;
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = criteriaAnd.length
                ? { $and: criteriaAnd }
                : null;
            let rows = yield customer_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort)
                .populate('businessId')
                .populate('userId')
                .populate('country')
                .populate('currency')
                .populate('language');
            const count = yield customer_1.default(options.database).countDocuments(criteria);
            rows = yield Promise.all(rows.map(this._mapRelationshipsAndFillDownloadUrl));
            return { rows, count };
        });
    }
    static findAllAutocomplete(search, limit, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let criteriaAnd = [{
                    tenant: currentTenant.id,
                }];
            if (search) {
                criteriaAnd.push({
                    $or: [
                        {
                            _id: mongooseQueryUtils_1.default.uuid(search),
                        },
                        {
                            name: {
                                $regex: mongooseQueryUtils_1.default.escapeRegExp(search),
                                $options: 'i',
                            }
                        },
                    ],
                });
            }
            const sort = mongooseQueryUtils_1.default.sort('name_ASC');
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = { $and: criteriaAnd };
            const records = yield customer_1.default(options.database)
                .find(criteria)
                .limit(limitEscaped)
                .sort(sort);
            return records.map((record) => ({
                id: record.id,
                label: record.name,
            }));
        });
    }
    static _createAuditLog(action, id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield auditLogRepository_1.default.log({
                entityName: customer_1.default(options.database).modelName,
                entityId: id,
                action,
                values: data,
            }, options);
        });
    }
    static _mapRelationshipsAndFillDownloadUrl(record) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!record) {
                return null;
            }
            const output = record.toObject
                ? record.toObject()
                : record;
            output.customerProfileImage = yield fileRepository_1.default.fillDownloadUrl(output.customerProfileImage);
            output.userId = userRepository_1.default.cleanupForRelationships(output.userId);
            return output;
        });
    }
}
exports.default = CustomerRepository;
//# sourceMappingURL=customerRepository.js.map