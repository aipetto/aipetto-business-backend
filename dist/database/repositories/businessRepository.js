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
const business_1 = __importDefault(require("../models/business"));
const fileRepository_1 = __importDefault(require("./fileRepository"));
const customer_1 = __importDefault(require("../models/customer"));
const product_1 = __importDefault(require("../models/product"));
const order_1 = __importDefault(require("../models/order"));
const pet_1 = __importDefault(require("../models/pet"));
const place_1 = __importDefault(require("../models/place"));
const serviceReservation_1 = __importDefault(require("../models/serviceReservation"));
const businessPlaceServiceAvailability_1 = __importDefault(require("../models/businessPlaceServiceAvailability"));
const messages_1 = __importDefault(require("../models/messages"));
const professionalsServiceAvailability_1 = __importDefault(require("../models/professionalsServiceAvailability"));
const discounts_1 = __importDefault(require("../models/discounts"));
const providers_1 = __importDefault(require("../models/providers"));
const petVaccines_1 = __importDefault(require("../models/petVaccines"));
const businessServicesPrices_1 = __importDefault(require("../models/businessServicesPrices"));
const deals_1 = __importDefault(require("../models/deals"));
const businessPaymentCycle_1 = __importDefault(require("../models/businessPaymentCycle"));
const petExamination_1 = __importDefault(require("../models/petExamination"));
const contacts_1 = __importDefault(require("../models/contacts"));
class BusinessRepository {
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const [record] = yield business_1.default(options.database).create([
                Object.assign(Object.assign({}, data), { tenant: currentTenant.id, createdBy: currentUser.id, updatedBy: currentUser.id })
            ], options);
            yield this._createAuditLog(auditLogRepository_1.default.CREATE, record.id, data, options);
            return this.findById(record.id, options);
        });
    }
    static update(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(business_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield business_1.default(options.database).updateOne({ _id: id }, Object.assign(Object.assign({}, data), { updatedBy: mongooseRepository_1.default.getCurrentUser(options).id }), options);
            yield this._createAuditLog(auditLogRepository_1.default.UPDATE, id, data, options);
            record = yield this.findById(id, options);
            return record;
        });
    }
    static destroy(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(business_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield business_1.default(options.database).deleteOne({ _id: id }, options);
            yield this._createAuditLog(auditLogRepository_1.default.DELETE, id, record, options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, customer_1.default(options.database), 'businessId', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, product_1.default(options.database), 'businessId', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, order_1.default(options.database), 'businessId', options);
            yield mongooseRepository_1.default.destroyRelationToMany(id, pet_1.default(options.database), 'businessAuthorized', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, place_1.default(options.database), 'businessId', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, serviceReservation_1.default(options.database), 'businessId', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, businessPlaceServiceAvailability_1.default(options.database), 'businessId', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, messages_1.default(options.database), 'businessId', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, professionalsServiceAvailability_1.default(options.database), 'businessId', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, discounts_1.default(options.database), 'businessID', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, providers_1.default(options.database), 'businessID', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, petVaccines_1.default(options.database), 'businessID', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, businessServicesPrices_1.default(options.database), 'businessId', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, deals_1.default(options.database), 'businessID', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, businessPaymentCycle_1.default(options.database), 'businessID', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, petExamination_1.default(options.database), 'businessID', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, contacts_1.default(options.database), 'businessID', options);
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
            const records = yield business_1.default(options.database)
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
            return mongooseRepository_1.default.wrapWithSessionIfExists(business_1.default(options.database).countDocuments(Object.assign(Object.assign({}, filter), { tenant: currentTenant.id })), options);
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(business_1.default(options.database)
                .findOne({ _id: id, tenant: currentTenant.id })
                .populate('services')
                .populate('categories')
                .populate('city')
                .populate('state')
                .populate('country')
                .populate('language')
                .populate('currency'), options);
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
                if (filter.businessID) {
                    criteriaAnd.push({
                        businessID: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.businessID),
                            $options: 'i',
                        },
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
                if (filter.contactName) {
                    criteriaAnd.push({
                        contactName: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.contactName),
                            $options: 'i',
                        },
                    });
                }
                if (filter.contactPhone) {
                    criteriaAnd.push({
                        contactPhone: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.contactPhone),
                            $options: 'i',
                        },
                    });
                }
                if (filter.contactWhatsApp) {
                    criteriaAnd.push({
                        contactWhatsApp: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.contactWhatsApp),
                            $options: 'i',
                        },
                    });
                }
                if (filter.contactEmail) {
                    criteriaAnd.push({
                        contactEmail: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.contactEmail),
                            $options: 'i',
                        },
                    });
                }
                if (filter.addressStreet) {
                    criteriaAnd.push({
                        addressStreet: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.addressStreet),
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
                if (filter.streetComplement) {
                    criteriaAnd.push({
                        streetComplement: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.streetComplement),
                            $options: 'i',
                        },
                    });
                }
                if (filter.addressPostCode) {
                    criteriaAnd.push({
                        addressPostCode: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.addressPostCode),
                            $options: 'i',
                        },
                    });
                }
                if (filter.city) {
                    criteriaAnd.push({
                        city: mongooseQueryUtils_1.default.uuid(filter.city),
                    });
                }
                if (filter.state) {
                    criteriaAnd.push({
                        state: mongooseQueryUtils_1.default.uuid(filter.state),
                    });
                }
                if (filter.country) {
                    criteriaAnd.push({
                        country: mongooseQueryUtils_1.default.uuid(filter.country),
                    });
                }
                if (filter.latitude) {
                    criteriaAnd.push({
                        latitude: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.latitude),
                            $options: 'i',
                        },
                    });
                }
                if (filter.longitude) {
                    criteriaAnd.push({
                        longitude: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.longitude),
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
                if (filter.notes) {
                    criteriaAnd.push({
                        notes: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.notes),
                            $options: 'i',
                        },
                    });
                }
                if (filter.language) {
                    criteriaAnd.push({
                        language: mongooseQueryUtils_1.default.uuid(filter.language),
                    });
                }
                if (filter.currency) {
                    criteriaAnd.push({
                        currency: mongooseQueryUtils_1.default.uuid(filter.currency),
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
            let rows = yield business_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort)
                .populate('services')
                .populate('categories')
                .populate('city')
                .populate('state')
                .populate('country')
                .populate('language')
                .populate('currency');
            const count = yield business_1.default(options.database).countDocuments(criteria);
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
                            businessID: {
                                $regex: mongooseQueryUtils_1.default.escapeRegExp(search),
                                $options: 'i',
                            }
                        },
                    ],
                });
            }
            const sort = mongooseQueryUtils_1.default.sort('businessID_ASC');
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = { $and: criteriaAnd };
            const records = yield business_1.default(options.database)
                .find(criteria)
                .limit(limitEscaped)
                .sort(sort);
            return records.map((record) => ({
                id: record.id,
                label: record.businessID,
            }));
        });
    }
    static _createAuditLog(action, id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield auditLogRepository_1.default.log({
                entityName: business_1.default(options.database).modelName,
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
            output.businessLogo = yield fileRepository_1.default.fillDownloadUrl(output.businessLogo);
            return output;
        });
    }
}
exports.default = BusinessRepository;
//# sourceMappingURL=businessRepository.js.map