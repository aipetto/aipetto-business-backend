import MongooseRepository from './mongooseRepository';
import MongooseQueryUtils from '../utils/mongooseQueryUtils';
import AuditLogRepository from './auditLogRepository';
import Error404 from '../../errors/Error404';
import { IRepositoryOptions } from './IRepositoryOptions';
import lodash from 'lodash';
import Business from '../models/business';
import Customer from '../models/customer';
import Product from '../models/product';
import Order from '../models/order';
import Pet from '../models/pet';
import Place from '../models/place';
import ServiceReservation from '../models/serviceReservation';
import BusinessPlaceServiceAvailability from '../models/businessPlaceServiceAvailability';
import Messages from '../models/messages';
import ProfessionalsServiceAvailability from '../models/professionalsServiceAvailability';
import Discounts from '../models/discounts';
import Providers from '../models/providers';
import PetVaccines from '../models/petVaccines';
import BusinessServicesPrices from '../models/businessServicesPrices';

class BusinessRepository {
  
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    const [record] = await Business(
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
      Business(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await Business(options.database).updateOne(
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
      Business(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await Business(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(
      AuditLogRepository.DELETE,
      id,
      record,
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Customer(options.database),
      'businessId',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Product(options.database),
      'businessId',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Order(options.database),
      'businessId',
      options,
    );

    await MongooseRepository.destroyRelationToMany(
      id,
      Pet(options.database),
      'businessAuthorized',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Place(options.database),
      'businessId',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      ServiceReservation(options.database),
      'businessId',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      BusinessPlaceServiceAvailability(options.database),
      'businessId',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Messages(options.database),
      'businessId',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      ProfessionalsServiceAvailability(options.database),
      'businessId',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Discounts(options.database),
      'businessID',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Providers(options.database),
      'businessID',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      PetVaccines(options.database),
      'businessID',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      BusinessServicesPrices(options.database),
      'businessId',
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

    const records = await Business(options.database)
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
      Business(options.database).countDocuments({
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
      Business(options.database)
        .findOne({_id: id, tenant: currentTenant.id})
      .populate('services')
      .populate('categories')
      .populate('city')
      .populate('state')
      .populate('country'),
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

      if (filter.businessID) {
        criteriaAnd.push({
          businessID: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.businessID,
            ),
            $options: 'i',
          },
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

    let rows = await Business(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate('services')
      .populate('categories')
      .populate('city')
      .populate('state')
      .populate('country');

    const count = await Business(
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
            businessID: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: 'i',
            }
          },          
        ],
      });
    }

    const sort = MongooseQueryUtils.sort('businessID_ASC');
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    const records = await Business(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record.businessID,
    }));
  }

  static async _createAuditLog(action, id, data, options: IRepositoryOptions) {
    await AuditLogRepository.log(
      {
        entityName: Business(options.database).modelName,
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

export default BusinessRepository;
