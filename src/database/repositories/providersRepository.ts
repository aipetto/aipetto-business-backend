import MongooseRepository from './mongooseRepository';
import MongooseQueryUtils from '../utils/mongooseQueryUtils';
import AuditLogRepository from './auditLogRepository';
import Error404 from '../../errors/Error404';
import { IRepositoryOptions } from './IRepositoryOptions';
import lodash from 'lodash';
import Providers from '../models/providers';
import FileRepository from './fileRepository';
import ServiceReservation from '../models/serviceReservation';
import PetVaccines from '../models/petVaccines';
import PetExamination from '../models/petExamination';

class ProvidersRepository {
  
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    const [record] = await Providers(
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
      Providers(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await Providers(options.database).updateOne(
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
      Providers(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await Providers(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(
      AuditLogRepository.DELETE,
      id,
      record,
      options,
    );

    await MongooseRepository.destroyRelationToMany(
      id,
      ServiceReservation(options.database),
      'serviceProviderIDs',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      PetVaccines(options.database),
      'veterinarianID',
      options,
    );

    await MongooseRepository.destroyRelationToMany(
      id,
      PetExamination(options.database),
      'providersID',
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

    const records = await Providers(options.database)
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
      Providers(options.database).countDocuments({
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
      Providers(options.database)
        .findOne({_id: id, tenant: currentTenant.id})
      .populate('businessID')
      .populate('category')
      .populate('serviceTypes')
      .populate('city')
      .populate('state')
      .populate('country')
      .populate('currency')
      .populate('language'),
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

      if (filter.businessID) {
        criteriaAnd.push({
          businessID: MongooseQueryUtils.uuid(
            filter.businessID,
          ),
        });
      }

      if (filter.providerID) {
        criteriaAnd.push({
          providerID: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.providerID,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.contactName) {
        criteriaAnd.push({
          contactName: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.contactName,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.contactPhone) {
        criteriaAnd.push({
          contactPhone: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.contactPhone,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.contactWhatsApp) {
        criteriaAnd.push({
          contactWhatsApp: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.contactWhatsApp,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.addressStreet) {
        criteriaAnd.push({
          addressStreet: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.addressStreet,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.addressStreetNumber) {
        criteriaAnd.push({
          addressStreetNumber: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.addressStreetNumber,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.addressPostCode) {
        criteriaAnd.push({
          addressPostCode: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.addressPostCode,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.city) {
        criteriaAnd.push({
          city: MongooseQueryUtils.uuid(
            filter.city,
          ),
        });
      }

      if (filter.state) {
        criteriaAnd.push({
          state: MongooseQueryUtils.uuid(
            filter.state,
          ),
        });
      }

      if (filter.country) {
        criteriaAnd.push({
          country: MongooseQueryUtils.uuid(
            filter.country,
          ),
        });
      }

      if (filter.email) {
        criteriaAnd.push({
          email: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.email,
            ),
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

      if (filter.basePricePerServiceRange) {
        const [start, end] = filter.basePricePerServiceRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            basePricePerService: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            basePricePerService: {
              $lte: end,
            },
          });
        }
      }

      if (filter.currency) {
        criteriaAnd.push({
          currency: MongooseQueryUtils.uuid(
            filter.currency,
          ),
        });
      }

      if (filter.language) {
        criteriaAnd.push({
          language: MongooseQueryUtils.uuid(
            filter.language,
          ),
        });
      }

      if (
        filter.isIndependent === true ||
        filter.isIndependent === 'true' ||
        filter.isIndependent === false ||
        filter.isIndependent === 'false'
      ) {
        criteriaAnd.push({
          isIndependent:
            filter.isIndependent === true ||
            filter.isIndependent === 'true',
        });
      }

      if (filter.campaignTrackerID) {
        criteriaAnd.push({
          campaignTrackerID: {
            $regex: MongooseQueryUtils.escapeRegExp(
                filter.campaignTrackerID,
            ),
            $options: 'i',
          },
        });
      }

      if (
          filter.isAvailable === true ||
          filter.isAvailable === 'true' ||
          filter.isAvailable === false ||
          filter.isAvailable === 'false'
      ) {
        criteriaAnd.push({
          isAvailable:
              filter.isAvailable === true ||
              filter.isAvailable === 'true',
        });
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

    let rows = await Providers(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate('businessID')
      .populate('category')
      .populate('serviceTypes')
      .populate('city')
      .populate('state')
      .populate('country')
      .populate('currency')
      .populate('language');

    const count = await Providers(
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

    const records = await Providers(options.database)
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
        entityName: Providers(options.database).modelName,
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

    output.attachedDoc = await FileRepository.fillDownloadUrl(
      output.attachedDoc,
    );



    return output;
  }
}

export default ProvidersRepository;
