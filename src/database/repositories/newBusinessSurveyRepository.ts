import MongooseRepository from './mongooseRepository';
import MongooseQueryUtils from '../utils/mongooseQueryUtils';
import AuditLogRepository from './auditLogRepository';
import Error404 from '../../errors/Error404';
import { IRepositoryOptions } from './IRepositoryOptions';
import lodash from 'lodash';
import NewBusinessSurvey from '../models/newBusinessSurvey';

class NewBusinessSurveyRepository {
  
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    const [record] = await NewBusinessSurvey(
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
      NewBusinessSurvey(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await NewBusinessSurvey(options.database).updateOne(
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
      NewBusinessSurvey(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await NewBusinessSurvey(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(
      AuditLogRepository.DELETE,
      id,
      record,
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

    const records = await NewBusinessSurvey(options.database)
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
      NewBusinessSurvey(options.database).countDocuments({
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
      NewBusinessSurvey(options.database)
        .findOne({_id: id, tenant: currentTenant.id}),
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

      if (filter.nameBusiness) {
        criteriaAnd.push({
          nameBusiness: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.nameBusiness,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.numberOfPlaces) {
        criteriaAnd.push({
          numberOfPlaces: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.numberOfPlaces,
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

      if (filter.contactEmail) {
        criteriaAnd.push({
          contactEmail: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.contactEmail,
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

      if (filter.cellphoneForSMS) {
        criteriaAnd.push({
          cellphoneForSMS: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.cellphoneForSMS,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.digitalNetworks) {
        criteriaAnd.push({
          digitalNetworks: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.digitalNetworks,
            ),
            $options: 'i',
          },
        });
      }

      if (
        filter.allowReceiveNotifications === true ||
        filter.allowReceiveNotifications === 'true' ||
        filter.allowReceiveNotifications === false ||
        filter.allowReceiveNotifications === 'false'
      ) {
        criteriaAnd.push({
          allowReceiveNotifications:
            filter.allowReceiveNotifications === true ||
            filter.allowReceiveNotifications === 'true',
        });
      }

      if (filter.services) {
        criteriaAnd.push({
          services: { $all: filter.services },
        });
      }

      if (filter.address) {
        criteriaAnd.push({
          address: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.address,
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

    let rows = await NewBusinessSurvey(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort);

    const count = await NewBusinessSurvey(
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
            nameBusiness: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: 'i',
            }
          },          
        ],
      });
    }

    const sort = MongooseQueryUtils.sort('nameBusiness_ASC');
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    const records = await NewBusinessSurvey(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record.nameBusiness,
    }));
  }

  static async _createAuditLog(action, id, data, options: IRepositoryOptions) {
    await AuditLogRepository.log(
      {
        entityName: NewBusinessSurvey(options.database).modelName,
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





    return output;
  }
}

export default NewBusinessSurveyRepository;
