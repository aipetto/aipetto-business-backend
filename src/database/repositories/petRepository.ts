import MongooseRepository from './mongooseRepository';
import MongooseQueryUtils from '../utils/mongooseQueryUtils';
import AuditLogRepository from './auditLogRepository';
import Error404 from '../../errors/Error404';
import { IRepositoryOptions } from './IRepositoryOptions';
import lodash from 'lodash';
import Pet from '../models/pet';
import UserRepository from './userRepository';
import FileRepository from './fileRepository';
import PetPhotos from '../models/petPhotos';
import PetExamination from '../models/petExamination';

class PetRepository {
  
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    const [record] = await Pet(
      options.database,
    ).create(
      [
        {
          ...data,
          tenant: currentTenant.id,
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
        }
      ],
      options,
    );

    await this._createAuditLog(
      AuditLogRepository.CREATE,
      record.id,
      data,
      options,
    );

    

    return this.findById(record.id, options);
  }

  static async update(id, data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Pet(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await Pet(options.database).updateOne(
      { _id: id },
      {
        ...data,
        updatedBy: MongooseRepository.getCurrentUser(
          options,
        ).id,
      },
      options,
    );

    await this._createAuditLog(
      AuditLogRepository.UPDATE,
      id,
      data,
      options,
    );

    record = await this.findById(id, options);
    return record;
  }

  static async destroy(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Pet(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await Pet(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(
      AuditLogRepository.DELETE,
      id,
      record,
      options,
    );

    await MongooseRepository.destroyRelationToMany(
      id,
      Pet(options.database),
      'matches',
      options,
    );

    await MongooseRepository.destroyRelationToMany(
      id,
      Pet(options.database),
      'petFriends',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      PetPhotos(options.database),
      'petId',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      PetExamination(options.database),
      'petID',
      options,
    );
  }

  static async filterIdInTenant(
    id,
    options: IRepositoryOptions,
  ) {
    return lodash.get(
      await this.filterIdsInTenant([id], options),
      '[0]',
      null,
    );
  }

  static async filterIdsInTenant(
    ids,
    options: IRepositoryOptions,
  ) {
    if (!ids || !ids.length) {
      return [];
    }

    const currentTenant =
      MongooseRepository.getCurrentTenant(options);

    const records = await Pet(options.database)
      .find({
        _id: { $in: ids },
        tenant: currentTenant.id,
      })
      .select(['_id']);

    return records.map((record) => record._id);
  }

  static async count(filter, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    return MongooseRepository.wrapWithSessionIfExists(
      Pet(options.database).countDocuments({
        ...filter,
        tenant: currentTenant.id,
      }),
      options,
    );
  }

  static async findById(id, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Pet(options.database)
        .findOne({_id: id, tenant: currentTenant.id})
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
      .populate('petFriends'),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    return this._mapRelationshipsAndFillDownloadUrl(record);
  }

  static async findAndCountAll(
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    let criteriaAnd: any = [];
    
    criteriaAnd.push({
      tenant: currentTenant.id,
    });

    if (filter) {
      if (filter.id) {
        criteriaAnd.push({
          ['_id']: MongooseQueryUtils.uuid(filter.id),
        });
      }

      if (filter.name) {
        criteriaAnd.push({
          name: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.name,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.nickname) {
        criteriaAnd.push({
          nickname: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.nickname,
            ),
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
          breed: MongooseQueryUtils.uuid(
            filter.breed,
          ),
        });
      }

      if (filter.secondBreedMixed) {
        criteriaAnd.push({
          secondBreedMixed: MongooseQueryUtils.uuid(
            filter.secondBreedMixed,
          ),
        });
      }

      if (filter.type) {
        criteriaAnd.push({
          type: MongooseQueryUtils.uuid(
            filter.type,
          ),
        });
      }

      if (filter.customerId) {
        criteriaAnd.push({
          customerId: MongooseQueryUtils.uuid(
            filter.customerId,
          ),
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

      if (
        filter.hasBeenVaccinated === true ||
        filter.hasBeenVaccinated === 'true' ||
        filter.hasBeenVaccinated === false ||
        filter.hasBeenVaccinated === 'false'
      ) {
        criteriaAnd.push({
          hasBeenVaccinated:
            filter.hasBeenVaccinated === true ||
            filter.hasBeenVaccinated === 'true',
        });
      }

      if (
        filter.hasBeenDewormed === true ||
        filter.hasBeenDewormed === 'true' ||
        filter.hasBeenDewormed === false ||
        filter.hasBeenDewormed === 'false'
      ) {
        criteriaAnd.push({
          hasBeenDewormed:
            filter.hasBeenDewormed === true ||
            filter.hasBeenDewormed === 'true',
        });
      }

      if (
        filter.hasBeenSterilizedSpayed === true ||
        filter.hasBeenSterilizedSpayed === 'true' ||
        filter.hasBeenSterilizedSpayed === false ||
        filter.hasBeenSterilizedSpayed === 'false'
      ) {
        criteriaAnd.push({
          hasBeenSterilizedSpayed:
            filter.hasBeenSterilizedSpayed === true ||
            filter.hasBeenSterilizedSpayed === 'true',
        });
      }

      if (filter.health) {
        criteriaAnd.push({
          health: filter.health
        });
      }

      if (
        filter.isLost === true ||
        filter.isLost === 'true' ||
        filter.isLost === false ||
        filter.isLost === 'false'
      ) {
        criteriaAnd.push({
          isLost:
            filter.isLost === true ||
            filter.isLost === 'true',
        });
      }

      if (
        filter.isLookingForMatch === true ||
        filter.isLookingForMatch === 'true' ||
        filter.isLookingForMatch === false ||
        filter.isLookingForMatch === 'false'
      ) {
        criteriaAnd.push({
          isLookingForMatch:
            filter.isLookingForMatch === true ||
            filter.isLookingForMatch === 'true',
        });
      }

      if (
        filter.isGuideDog === true ||
        filter.isGuideDog === 'true' ||
        filter.isGuideDog === false ||
        filter.isGuideDog === 'false'
      ) {
        criteriaAnd.push({
          isGuideDog:
            filter.isGuideDog === true ||
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
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.governmentUniqueID,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.bloodType) {
        criteriaAnd.push({
          bloodType: filter.bloodType
        });
      }

      if (
        filter.hasMicrochip === true ||
        filter.hasMicrochip === 'true' ||
        filter.hasMicrochip === false ||
        filter.hasMicrochip === 'false'
      ) {
        criteriaAnd.push({
          hasMicrochip:
            filter.hasMicrochip === true ||
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

        if (
          start !== undefined &&
          start !== null &&
          start !== ''
        ) {
          criteriaAnd.push({
            ['createdAt']: {
              $gte: start,
            },
          });
        }

        if (
          end !== undefined &&
          end !== null &&
          end !== ''
        ) {
          criteriaAnd.push({
            ['createdAt']: {
              $lte: end,
            },
          });
        }
      }
    }

    const sort = MongooseQueryUtils.sort(
      orderBy || 'createdAt_DESC',
    );

    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = criteriaAnd.length
      ? { $and: criteriaAnd }
      : null;

    let rows = await Pet(options.database)
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

    const count = await Pet(
      options.database,
    ).countDocuments(criteria);

    rows = await Promise.all(
      rows.map(this._mapRelationshipsAndFillDownloadUrl),
    );

    return { rows, count };
  }

  static async findAllAutocomplete(search, limit, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    let criteriaAnd: Array<any> = [{
      tenant: currentTenant.id,
    }];

    if (search) {
      criteriaAnd.push({
        $or: [
          {
            _id: MongooseQueryUtils.uuid(search),
          },
          {
            name: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: 'i',
            }
          },          
        ],
      });
    }

    const sort = MongooseQueryUtils.sort('name_ASC');
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    const records = await Pet(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }

  static async _createAuditLog(action, id, data, options: IRepositoryOptions) {
    await AuditLogRepository.log(
      {
        entityName: Pet(options.database).modelName,
        entityId: id,
        action,
        values: data,
      },
      options,
    );
  }

  static async _mapRelationshipsAndFillDownloadUrl(record) {
    if (!record) {
      return null;
    }

    const output = record.toObject
      ? record.toObject()
      : record;

    output.profileImage = await FileRepository.fillDownloadUrl(
      output.profileImage,
    );

    output.petOwners = UserRepository.cleanupForRelationships(output.petOwners);

    output.usersAuthorized = UserRepository.cleanupForRelationships(output.usersAuthorized);

    return output;
  }
}

export default PetRepository;
