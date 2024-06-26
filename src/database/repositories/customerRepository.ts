import MongooseRepository from './mongooseRepository';
import MongooseQueryUtils from '../utils/mongooseQueryUtils';
import AuditLogRepository from './auditLogRepository';
import Error404 from '../../errors/Error404';
import { IRepositoryOptions } from './IRepositoryOptions';
import lodash from 'lodash';
import Customer from '../models/customer';
import UserRepository from './userRepository';
import FileRepository from './fileRepository';
import Order from '../models/order';
import Pet from '../models/pet';
import ServiceReservation from '../models/serviceReservation';
import Deals from '../models/deals';
import BusinessPaymentCycle from '../models/businessPaymentCycle';
import Contacts from '../models/contacts';

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

    await MongooseRepository.destroyRelationToMany(
      id,
      Pet(options.database),
      'customerIds',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      ServiceReservation(options.database),
      'customerId',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Deals(options.database),
      'customer',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      BusinessPaymentCycle(options.database),
      'customerID',
      options,
    );

    await MongooseRepository.destroyRelationToMany(
      id,
      Contacts(options.database),
      'customerID',
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
      .populate('userId')
      .populate('country')
      .populate('currency')
      .populate('language')
      .populate('pets'),
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

      if (filter.uniqueCustomIdentifier) {
        criteriaAnd.push({
          uniqueCustomIdentifier: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.uniqueCustomIdentifier,
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

      if (filter.businessId) {
        criteriaAnd.push({
          businessId: MongooseQueryUtils.uuid(
            filter.businessId,
          ),
        });
      }

      if (filter.userId) {
        criteriaAnd.push({
          userId: MongooseQueryUtils.uuid(
            filter.userId,
          ),
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

      if (filter.smsPhoneNumber) {
        criteriaAnd.push({
          smsPhoneNumber: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.smsPhoneNumber,
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
          country: MongooseQueryUtils.uuid(
            filter.country,
          ),
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

      if (
        filter.wantToReceiveNotifications === true ||
        filter.wantToReceiveNotifications === 'true' ||
        filter.wantToReceiveNotifications === false ||
        filter.wantToReceiveNotifications === 'false'
      ) {
        criteriaAnd.push({
          wantToReceiveNotifications:
            filter.wantToReceiveNotifications === true ||
            filter.wantToReceiveNotifications === 'true',
        });
      }

      if (filter.currency) {
        criteriaAnd.push({
          currency: MongooseQueryUtils.uuid(
            filter.currency,
          ),
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
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.shippingAddressStreetNumber,
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

      if (filter.billingAddressStreetNumber) {
        criteriaAnd.push({
          billingAddressStreetNumber: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.billingAddressStreetNumber,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.addressStreetComplement) {
        criteriaAnd.push({
          addressStreetComplement: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.addressStreetComplement,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.billingAddressStreetComplement) {
        criteriaAnd.push({
          billingAddressStreetComplement: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.billingAddressStreetComplement,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.shippingAddressStreetComplement) {
        criteriaAnd.push({
          shippingAddressStreetComplement: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.shippingAddressStreetComplement,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.facebook) {
        criteriaAnd.push({
          facebook: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.facebook,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.linkedin) {
        criteriaAnd.push({
          linkedin: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.linkedin,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.instagram) {
        criteriaAnd.push({
          instagram: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.instagram,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.website) {
        criteriaAnd.push({
          website: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.website,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.language) {
        criteriaAnd.push({
          language: MongooseQueryUtils.uuid(
            filter.language,
          ),
        });
      }

      if (filter.notes) {
        criteriaAnd.push({
          notes: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.notes,
            ),
            $options: 'i',
          },
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
      .populate('userId')
      .populate('country')
      .populate('currency')
      .populate('language')
      .populate('pets');

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
            uniqueCustomIdentifier: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: 'i',
            }
          },          
        ],
      });
    }

    const sort = MongooseQueryUtils.sort('uniqueCustomIdentifier_ASC');
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    const records = await Customer(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record.uniqueCustomIdentifier,
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

    output.customerProfileImage = await FileRepository.fillDownloadUrl(
      output.customerProfileImage,
    );

    output.userId = UserRepository.cleanupForRelationships(output.userId);

    return output;
  }
}

export default CustomerRepository;
