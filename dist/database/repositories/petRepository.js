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
const pet_1 = __importDefault(require("../models/pet"));
const userRepository_1 = __importDefault(require("./userRepository"));
const fileRepository_1 = __importDefault(require("./fileRepository"));
const petPhotos_1 = __importDefault(require("../models/petPhotos"));
const petExamination_1 = __importDefault(require("../models/petExamination"));
class PetRepository {
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(options);
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const [record] = yield pet_1.default(options.database).create([
                Object.assign(Object.assign({}, data), { tenant: currentTenant.id, createdBy: currentUser.id, updatedBy: currentUser.id })
            ], options);
            yield this._createAuditLog(auditLogRepository_1.default.CREATE, record.id, data, options);
            return this.findById(record.id, options);
        });
    }
    static createWithTenantAndCurrentUserFromRequest(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const [record] = yield pet_1.default(options.database).create([
                Object.assign({}, data)
            ], options);
            yield this._createAuditLog(auditLogRepository_1.default.CREATE, record.id, data, options);
            return this.findById(record.id, options);
        });
    }
    static update(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(pet_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield pet_1.default(options.database).updateOne({ _id: id }, Object.assign(Object.assign({}, data), { updatedBy: mongooseRepository_1.default.getCurrentUser(options).id }), options);
            yield this._createAuditLog(auditLogRepository_1.default.UPDATE, id, data, options);
            record = yield this.findById(id, options);
            return record;
        });
    }
    static destroy(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(pet_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield pet_1.default(options.database).deleteOne({ _id: id }, options);
            yield this._createAuditLog(auditLogRepository_1.default.DELETE, id, record, options);
            yield mongooseRepository_1.default.destroyRelationToMany(id, pet_1.default(options.database), 'matches', options);
            yield mongooseRepository_1.default.destroyRelationToMany(id, pet_1.default(options.database), 'petFriends', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, petPhotos_1.default(options.database), 'petId', options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, petExamination_1.default(options.database), 'petID', options);
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
            const records = yield pet_1.default(options.database)
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
            return mongooseRepository_1.default.wrapWithSessionIfExists(pet_1.default(options.database).countDocuments(Object.assign(Object.assign({}, filter), { tenant: currentTenant.id })), options);
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(pet_1.default(options.database)
                .findOne({ _id: id, tenant: currentTenant.id })
                .populate('breed')
                .populate('secondBreedMixed')
                .populate('type')
                .populate('customerId')
                .populate('petOwners')
                .populate('photos')
                .populate('vaccines')
                .populate('usersAuthorized')
                .populate('businessAuthorized')
                .populate('diseases')
                .populate('matches')
                .populate('petFriends'), options);
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
                if (filter.nickname) {
                    criteriaAnd.push({
                        nickname: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.nickname),
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
                if (filter.ageRange) {
                    const [start, end] = filter.ageRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            age: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            age: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.color) {
                    criteriaAnd.push({
                        color: filter.color
                    });
                }
                if (filter.secondColor) {
                    criteriaAnd.push({
                        secondColor: filter.secondColor
                    });
                }
                if (filter.thirdColor) {
                    criteriaAnd.push({
                        thirdColor: filter.thirdColor
                    });
                }
                if (filter.sex) {
                    criteriaAnd.push({
                        sex: filter.sex
                    });
                }
                if (filter.breed) {
                    criteriaAnd.push({
                        breed: mongooseQueryUtils_1.default.uuid(filter.breed),
                    });
                }
                if (filter.secondBreedMixed) {
                    criteriaAnd.push({
                        secondBreedMixed: mongooseQueryUtils_1.default.uuid(filter.secondBreedMixed),
                    });
                }
                if (filter.type) {
                    criteriaAnd.push({
                        type: mongooseQueryUtils_1.default.uuid(filter.type),
                    });
                }
                if (filter.customerId) {
                    criteriaAnd.push({
                        customerId: mongooseQueryUtils_1.default.uuid(filter.customerId),
                    });
                }
                if (filter.maturitySize) {
                    criteriaAnd.push({
                        maturitySize: filter.maturitySize
                    });
                }
                if (filter.furLength) {
                    criteriaAnd.push({
                        furLength: filter.furLength
                    });
                }
                if (filter.hasBeenVaccinated === true ||
                    filter.hasBeenVaccinated === 'true' ||
                    filter.hasBeenVaccinated === false ||
                    filter.hasBeenVaccinated === 'false') {
                    criteriaAnd.push({
                        hasBeenVaccinated: filter.hasBeenVaccinated === true ||
                            filter.hasBeenVaccinated === 'true',
                    });
                }
                if (filter.hasBeenDewormed === true ||
                    filter.hasBeenDewormed === 'true' ||
                    filter.hasBeenDewormed === false ||
                    filter.hasBeenDewormed === 'false') {
                    criteriaAnd.push({
                        hasBeenDewormed: filter.hasBeenDewormed === true ||
                            filter.hasBeenDewormed === 'true',
                    });
                }
                if (filter.hasBeenSterilizedSpayed === true ||
                    filter.hasBeenSterilizedSpayed === 'true' ||
                    filter.hasBeenSterilizedSpayed === false ||
                    filter.hasBeenSterilizedSpayed === 'false') {
                    criteriaAnd.push({
                        hasBeenSterilizedSpayed: filter.hasBeenSterilizedSpayed === true ||
                            filter.hasBeenSterilizedSpayed === 'true',
                    });
                }
                if (filter.health) {
                    criteriaAnd.push({
                        health: filter.health
                    });
                }
                if (filter.isLost === true ||
                    filter.isLost === 'true' ||
                    filter.isLost === false ||
                    filter.isLost === 'false') {
                    criteriaAnd.push({
                        isLost: filter.isLost === true ||
                            filter.isLost === 'true',
                    });
                }
                if (filter.isLookingForMatch === true ||
                    filter.isLookingForMatch === 'true' ||
                    filter.isLookingForMatch === false ||
                    filter.isLookingForMatch === 'false') {
                    criteriaAnd.push({
                        isLookingForMatch: filter.isLookingForMatch === true ||
                            filter.isLookingForMatch === 'true',
                    });
                }
                if (filter.isGuideDog === true ||
                    filter.isGuideDog === 'true' ||
                    filter.isGuideDog === false ||
                    filter.isGuideDog === 'false') {
                    criteriaAnd.push({
                        isGuideDog: filter.isGuideDog === true ||
                            filter.isGuideDog === 'true',
                    });
                }
                if (filter.numberOfLikesRange) {
                    const [start, end] = filter.numberOfLikesRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            numberOfLikes: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            numberOfLikes: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.governmentUniqueID) {
                    criteriaAnd.push({
                        governmentUniqueID: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.governmentUniqueID),
                            $options: 'i',
                        },
                    });
                }
                if (filter.bloodType) {
                    criteriaAnd.push({
                        bloodType: filter.bloodType
                    });
                }
                if (filter.hasMicrochip === true ||
                    filter.hasMicrochip === 'true' ||
                    filter.hasMicrochip === false ||
                    filter.hasMicrochip === 'false') {
                    criteriaAnd.push({
                        hasMicrochip: filter.hasMicrochip === true ||
                            filter.hasMicrochip === 'true',
                    });
                }
                if (filter.weightRange) {
                    const [start, end] = filter.weightRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            weight: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            weight: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.weightUnit) {
                    criteriaAnd.push({
                        weightUnit: filter.weightUnit
                    });
                }
                if (filter.heightRange) {
                    const [start, end] = filter.heightRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            height: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            height: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.heightUnit) {
                    criteriaAnd.push({
                        heightUnit: filter.heightUnit
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
            let rows = yield pet_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort)
                .populate('breed')
                .populate('secondBreedMixed')
                .populate('type')
                .populate('customerId')
                .populate('petOwners')
                .populate('photos')
                .populate('vaccines')
                .populate('usersAuthorized')
                .populate('businessAuthorized')
                .populate('diseases')
                .populate('matches')
                .populate('petFriends');
            const count = yield pet_1.default(options.database).countDocuments(criteria);
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
            const records = yield pet_1.default(options.database)
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
                entityName: pet_1.default(options.database).modelName,
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
            output.profileImage = yield fileRepository_1.default.fillDownloadUrl(output.profileImage);
            output.petOwners = userRepository_1.default.cleanupForRelationships(output.petOwners);
            output.usersAuthorized = userRepository_1.default.cleanupForRelationships(output.usersAuthorized);
            return output;
        });
    }
}
exports.default = PetRepository;
//# sourceMappingURL=petRepository.js.map