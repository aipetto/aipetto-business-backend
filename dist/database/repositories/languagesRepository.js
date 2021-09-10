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
const languages_1 = __importDefault(require("../models/languages"));
const product_1 = __importDefault(require("../models/product"));
const breed_1 = __importDefault(require("../models/breed"));
const petTypes_1 = __importDefault(require("../models/petTypes"));
const business_1 = __importDefault(require("../models/business"));
const businessServicesTypes_1 = __importDefault(require("../models/businessServicesTypes"));
const messages_1 = __importDefault(require("../models/messages"));
const businessCategory_1 = __importDefault(require("../models/businessCategory"));
const providers_1 = __importDefault(require("../models/providers"));
const placeType_1 = __importDefault(require("../models/placeType"));
const posts_1 = __importDefault(require("../models/posts"));
const postCategories_1 = __importDefault(require("../models/postCategories"));
const challengesCategories_1 = __importDefault(require("../models/challengesCategories"));
const productCategory_1 = __importDefault(require("../models/productCategory"));
const questions_1 = __importDefault(require("../models/questions"));
const answers_1 = __importDefault(require("../models/answers"));
const petExamination_1 = __importDefault(require("../models/petExamination"));
const contacts_1 = __importDefault(require("../models/contacts"));
class LanguagesRepository {
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const [record] = yield languages_1.default(options.database).create([
                Object.assign(Object.assign({}, data), { tenant: currentTenant.id, createdBy: currentUser.id, updatedBy: currentUser.id })
            ], options);
            yield this._createAuditLog(auditLogRepository_1.default.CREATE, record.id, data, options);
            return this.findById(record.id, options);
        });
    }
    static update(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(languages_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield languages_1.default(options.database).updateOne({ _id: id }, Object.assign(Object.assign({}, data), { updatedBy: mongooseRepository_1.default.getCurrentUser(options).id }), options);
            yield this._createAuditLog(auditLogRepository_1.default.UPDATE, id, data, options);
            record = yield this.findById(id, options);
            return record;
        });
    }
    static destroy(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(languages_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield languages_1.default(options.database).deleteOne({ _id: id }, options);
            yield this._createAuditLog(auditLogRepository_1.default.DELETE, id, record, options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, product_1.default(options.database), 'language', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, breed_1.default(options.database), 'language', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, petTypes_1.default(options.database), 'language', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, business_1.default(options.database), 'language', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, businessServicesTypes_1.default(options.database), 'language', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, messages_1.default(options.database), 'language', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, businessCategory_1.default(options.database), 'language', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, providers_1.default(options.database), 'language', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, placeType_1.default(options.database), 'language', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, posts_1.default(options.database), 'language', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, postCategories_1.default(options.database), 'language', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, challengesCategories_1.default(options.database), 'language', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, productCategory_1.default(options.database), 'language', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, questions_1.default(options.database), 'language', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, answers_1.default(options.database), 'language', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, petExamination_1.default(options.database), 'language', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, contacts_1.default(options.database), 'language', options);
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
            const records = yield languages_1.default(options.database)
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
            return mongooseRepository_1.default.wrapWithSessionIfExists(languages_1.default(options.database).countDocuments(Object.assign(Object.assign({}, filter), { tenant: currentTenant.id })), options);
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(languages_1.default(options.database)
                .findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            return this._mapRelationshipsAndFillDownloadUrl(record);
        });
    }
    static findAndCountAll({ filter, limit = 0, offset = 0, orderBy = '' }, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let criteriaAnd = [];
            criteriaAnd.push({});
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
                if (filter.active === true ||
                    filter.active === 'true' ||
                    filter.active === false ||
                    filter.active === 'false') {
                    criteriaAnd.push({
                        active: filter.active === true ||
                            filter.active === 'true',
                    });
                }
                if (filter.languageCode) {
                    criteriaAnd.push({
                        languageCode: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.languageCode),
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
            let rows = yield languages_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort);
            const count = yield languages_1.default(options.database).countDocuments(criteria);
            rows = yield Promise.all(rows.map(this._mapRelationshipsAndFillDownloadUrl));
            return { rows, count };
        });
    }
    static findAllAutocomplete(search, limit, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let criteriaAnd = [{}];
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
            const records = yield languages_1.default(options.database)
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
                entityName: languages_1.default(options.database).modelName,
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
            return output;
        });
    }
}
exports.default = LanguagesRepository;
//# sourceMappingURL=languagesRepository.js.map