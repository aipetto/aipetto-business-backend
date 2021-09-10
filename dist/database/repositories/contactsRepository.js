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
const contacts_1 = __importDefault(require("../models/contacts"));
const fileRepository_1 = __importDefault(require("./fileRepository"));
class ContactsRepository {
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const [record] = yield contacts_1.default(options.database).create([
                Object.assign(Object.assign({}, data), { tenant: currentTenant.id, createdBy: currentUser.id, updatedBy: currentUser.id })
            ], options);
            yield this._createAuditLog(auditLogRepository_1.default.CREATE, record.id, data, options);
            return this.findById(record.id, options);
        });
    }
    static update(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(contacts_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield contacts_1.default(options.database).updateOne({ _id: id }, Object.assign(Object.assign({}, data), { updatedBy: mongooseRepository_1.default.getCurrentUser(options).id }), options);
            yield this._createAuditLog(auditLogRepository_1.default.UPDATE, id, data, options);
            record = yield this.findById(id, options);
            return record;
        });
    }
    static destroy(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(contacts_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield contacts_1.default(options.database).deleteOne({ _id: id }, options);
            yield this._createAuditLog(auditLogRepository_1.default.DELETE, id, record, options);
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
            const records = yield contacts_1.default(options.database)
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
            return mongooseRepository_1.default.wrapWithSessionIfExists(contacts_1.default(options.database).countDocuments(Object.assign(Object.assign({}, filter), { tenant: currentTenant.id })), options);
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(contacts_1.default(options.database)
                .findOne({ _id: id, tenant: currentTenant.id })
                .populate('country')
                .populate('customerID')
                .populate('businessID')
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
                if (filter.firstName) {
                    criteriaAnd.push({
                        firstName: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.firstName),
                            $options: 'i',
                        },
                    });
                }
                if (filter.lastName) {
                    criteriaAnd.push({
                        lastName: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.lastName),
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
                if (filter.cellphone) {
                    criteriaAnd.push({
                        cellphone: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.cellphone),
                            $options: 'i',
                        },
                    });
                }
                if (filter.whatsapp) {
                    criteriaAnd.push({
                        whatsapp: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.whatsapp),
                            $options: 'i',
                        },
                    });
                }
                if (filter.source) {
                    criteriaAnd.push({
                        source: filter.source
                    });
                }
                if (filter.country) {
                    criteriaAnd.push({
                        country: mongooseQueryUtils_1.default.uuid(filter.country),
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
                if (filter.addressStreetName) {
                    criteriaAnd.push({
                        addressStreetName: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.addressStreetName),
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
                if (filter.addressStreetComplement) {
                    criteriaAnd.push({
                        addressStreetComplement: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.addressStreetComplement),
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
                if (filter.statusContact === true ||
                    filter.statusContact === 'true' ||
                    filter.statusContact === false ||
                    filter.statusContact === 'false') {
                    criteriaAnd.push({
                        statusContact: filter.statusContact === true ||
                            filter.statusContact === 'true',
                    });
                }
                if (filter.contactType) {
                    criteriaAnd.push({
                        contactType: filter.contactType
                    });
                }
                if (filter.businessID) {
                    criteriaAnd.push({
                        businessID: mongooseQueryUtils_1.default.uuid(filter.businessID),
                    });
                }
                if (filter.companyName) {
                    criteriaAnd.push({
                        companyName: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.companyName),
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
                if (filter.linkedinProfile) {
                    criteriaAnd.push({
                        linkedinProfile: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.linkedinProfile),
                            $options: 'i',
                        },
                    });
                }
                if (filter.instagramProfile) {
                    criteriaAnd.push({
                        instagramProfile: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.instagramProfile),
                            $options: 'i',
                        },
                    });
                }
                if (filter.facebookProfile) {
                    criteriaAnd.push({
                        facebookProfile: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.facebookProfile),
                            $options: 'i',
                        },
                    });
                }
                if (filter.isDeveloper === true ||
                    filter.isDeveloper === 'true' ||
                    filter.isDeveloper === false ||
                    filter.isDeveloper === 'false') {
                    criteriaAnd.push({
                        isDeveloper: filter.isDeveloper === true ||
                            filter.isDeveloper === 'true',
                    });
                }
                if (filter.isActive === true ||
                    filter.isActive === 'true' ||
                    filter.isActive === false ||
                    filter.isActive === 'false') {
                    criteriaAnd.push({
                        isActive: filter.isActive === true ||
                            filter.isActive === 'true',
                    });
                }
                if (filter.language) {
                    criteriaAnd.push({
                        language: mongooseQueryUtils_1.default.uuid(filter.language),
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
            let rows = yield contacts_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort)
                .populate('country')
                .populate('customerID')
                .populate('businessID')
                .populate('language');
            const count = yield contacts_1.default(options.database).countDocuments(criteria);
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
                    ],
                });
            }
            const sort = mongooseQueryUtils_1.default.sort('id_ASC');
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = { $and: criteriaAnd };
            const records = yield contacts_1.default(options.database)
                .find(criteria)
                .limit(limitEscaped)
                .sort(sort);
            return records.map((record) => ({
                id: record.id,
                label: record.id,
            }));
        });
    }
    static _createAuditLog(action, id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield auditLogRepository_1.default.log({
                entityName: contacts_1.default(options.database).modelName,
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
            output.contactProfilePhoto = yield fileRepository_1.default.fillDownloadUrl(output.contactProfilePhoto);
            return output;
        });
    }
}
exports.default = ContactsRepository;
//# sourceMappingURL=contactsRepository.js.map