import MongooseRepository from './mongooseRepository';
import MongooseQueryUtils from '../utils/mongooseQueryUtils';
import AuditLogRepository from './auditLogRepository';
import Error404 from '../../errors/Error404';
import { IRepositoryOptions } from './IRepositoryOptions';
import lodash from 'lodash';
import Customer from '../models/customer';
import UserRepository from './userRepository';
import Order from '../models/order';
import Pet from '../models/pet';
import ServiceReservation from '../models/serviceReservation';

class CustomerRepository {
  
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    const [record] = await Customer(
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
      Customer(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await Customer(options.database).updateOne(
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
      Customer(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await Customer(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(
      AuditLogRepository.DELETE,
      id,
      record,
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Order(options.database),
      'customer',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Pet(options.database),
      'customerId',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      ServiceReservation(options.database),
      'customerId',
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

    const records = await Customer(options.database)
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
      Customer(options.database).countDocuments({
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
      Customer(options.database)
        .findOne({_id: id, tenant: currentTenant.id})
      .populate('businessId')
      .populate('userId'),
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

      if (filter.businessId) {
        criteriaAnd.push({
          businessId: MongooseQueryUtils.uuid(
            filter.businessId,
          ),
        });
      }

      if (filter.source) {
        criteriaAnd.push({
          source: filter.source
        });
      }

      if (filter.userId) {
        criteriaAnd.push({
          userId: MongooseQueryUtils.uuid(
            filter.userId,
          ),
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

      if (filter.surname) {
        criteriaAnd.push({
          surname: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.surname,
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

      if (filter.gender) {
        criteriaAnd.push({
          gender: filter.gender
        });
      }

      if (filter.whatsApp) {
        criteriaAnd.push({
          whatsApp: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.whatsApp,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.phoneNumber) {
        criteriaAnd.push({
          phoneNumber: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.phoneNumber,
            ),
            $options: 'i',
          },
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

      if (filter.zipCode) {
        criteriaAnd.push({
          zipCode: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.zipCode,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.city) {
        criteriaAnd.push({
          city: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.city,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.state) {
        criteriaAnd.push({
          state: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.state,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.country) {
        criteriaAnd.push({
          country: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.country,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.billingAddressStreet) {
        criteriaAnd.push({
          billingAddressStreet: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.billingAddressStreet,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.billingAddressCity) {
        criteriaAnd.push({
          billingAddressCity: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.billingAddressCity,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.billingAddressState) {
        criteriaAnd.push({
          billingAddressState: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.billingAddressState,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.billingAddressZipCode) {
        criteriaAnd.push({
          billingAddressZipCode: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.billingAddressZipCode,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.billingAddressCountry) {
        criteriaAnd.push({
          billingAddressCountry: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.billingAddressCountry,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.shippingAddressStreet) {
        criteriaAnd.push({
          shippingAddressStreet: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.shippingAddressStreet,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.shippingAddressCity) {
        criteriaAnd.push({
          shippingAddressCity: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.shippingAddressCity,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.shippingAddressState) {
        criteriaAnd.push({
          shippingAddressState: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.shippingAddressState,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.shippingAddressZipCode) {
        criteriaAnd.push({
          shippingAddressZipCode: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.shippingAddressZipCode,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.shippingAddressCountry) {
        criteriaAnd.push({
          shippingAddressCountry: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.shippingAddressCountry,
            ),
            $options: 'i',
          },
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

    let rows = await Customer(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate('businessId')
      .populate('userId');

    const count = await Customer(
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

    const records = await Customer(options.database)
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
        entityName: Customer(options.database).modelName,
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



    output.userId = UserRepository.cleanupForRelationships(output.userId);

    return output;
  }
}

export default CustomerRepository;
