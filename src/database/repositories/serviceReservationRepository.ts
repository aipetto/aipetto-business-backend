import MongooseRepository from './mongooseRepository';
import MongooseQueryUtils from '../utils/mongooseQueryUtils';
import AuditLogRepository from './auditLogRepository';
import Error404 from '../../errors/Error404';
import { IRepositoryOptions } from './IRepositoryOptions';
import lodash from 'lodash';
import ServiceReservation from '../models/serviceReservation';
import FileRepository from './fileRepository';
import BusinessPaymentCycle from '../models/businessPaymentCycle';

class ServiceReservationRepository {
  
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    const [record] = await ServiceReservation(
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
      ServiceReservation(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await ServiceReservation(options.database).updateOne(
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
      ServiceReservation(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await ServiceReservation(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(
      AuditLogRepository.DELETE,
      id,
      record,
      options,
    );

    await MongooseRepository.destroyRelationToMany(
      id,
      BusinessPaymentCycle(options.database),
      'businessServiceReservationsUsed',
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

    const records = await ServiceReservation(options.database)
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
      ServiceReservation(options.database).countDocuments({
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
      ServiceReservation(options.database)
        .findOne({_id: id, tenant: currentTenant.id})
      .populate('businessId')
      .populate('customerId')
      .populate('pet')
      .populate('serviceType')
      .populate('serviceProviderIDs')
      .populate('place')
      .populate('discountCode')
      .populate('currency')
      .populate('country'),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    return this._mapRelationshipsAndFillDownloadUrl(record);
  }

  static async findByIdAndCustomerId(id, customerTenantId, options: IRepositoryOptions) {

    let record = await MongooseRepository.wrapWithSessionIfExists(
        ServiceReservation(options.database)
            .findOne({_id: id, customerTenant: customerTenantId})
            .populate('businessId')
            .populate('customerId')
            .populate('serviceType')
            .populate('serviceProviderIDs')
            .populate('place')
            .populate('discountCode')
            .populate('currency')
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

      if (filter.dateRange) {
        const [start, end] = filter.dateRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            date: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            date: {
              $lte: end,
            },
          });
        }
      }

      if (filter.businessId) {
        criteriaAnd.push({
          businessId: MongooseQueryUtils.uuid(
            filter.businessId,
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

      if (filter.pet) {
        criteriaAnd.push({
          pet: MongooseQueryUtils.uuid(
              filter.pet,
          ),
        });
      }

      if (filter.time) {
        criteriaAnd.push({
          time: filter.time
        });
      }

      if (
        filter.needTransportation === true ||
        filter.needTransportation === 'true' ||
        filter.needTransportation === false ||
        filter.needTransportation === 'false'
      ) {
        criteriaAnd.push({
          needTransportation:
            filter.needTransportation === true ||
            filter.needTransportation === 'true',
        });
      }

      if (filter.place) {
        criteriaAnd.push({
          place: MongooseQueryUtils.uuid(
            filter.place,
          ),
        });
      }

      if (filter.status) {
        criteriaAnd.push({
          status: filter.status
        });
      }

      if (filter.totalPriceRange) {
        const [start, end] = filter.totalPriceRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            totalPrice: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            totalPrice: {
              $lte: end,
            },
          });
        }
      }

      if (filter.totalPriceWithDiscountRange) {
        const [start, end] = filter.totalPriceWithDiscountRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            totalPriceWithDiscount: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            totalPriceWithDiscount: {
              $lte: end,
            },
          });
        }
      }

      if (filter.discountCode) {
        criteriaAnd.push({
          discountCode: MongooseQueryUtils.uuid(
            filter.discountCode,
          ),
        });
      }

      if (filter.currency) {
        criteriaAnd.push({
          currency: MongooseQueryUtils.uuid(
            filter.currency,
          ),
        });
      }

      if (filter.totalPriceTransportartionRange) {
        const [start, end] = filter.totalPriceTransportartionRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            totalPriceTransportartion: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            totalPriceTransportartion: {
              $lte: end,
            },
          });
        }
      }

      if (filter.ratingFromCustomerRange) {
        const [start, end] = filter.ratingFromCustomerRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            ratingFromCustomer: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            ratingFromCustomer: {
              $lte: end,
            },
          });
        }
      }

      if (filter.country) {
        criteriaAnd.push({
          country: MongooseQueryUtils.uuid(
            filter.country,
          ),
        });
      }

      if (filter.source) {
        criteriaAnd.push({
          source: filter.source
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

      if (filter.customerQuestions) {
        criteriaAnd.push({
          customerQuestions: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.customerQuestions,
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

    let rows = await ServiceReservation(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate('businessId')
      .populate('customerId')
      .populate('pet')
      .populate('serviceType')
      .populate('serviceProviderIDs')
      .populate('place')
      .populate('discountCode')
      .populate('currency')
      .populate('country');

    const count = await ServiceReservation(
      options.database,
    ).countDocuments(criteria);

    rows = await Promise.all(
      rows.map(this._mapRelationshipsAndFillDownloadUrl),
    );

    return { rows, count };
  }

  static async findAndCountCustomersAllReservations(
      { filter, limit = 0, offset = 0, orderBy = '' },
      options: IRepositoryOptions,
  ) {

    let criteriaAnd: any = [];

    if (filter) {
      if (filter.id) {
        criteriaAnd.push({
          ['_id']: MongooseQueryUtils.uuid(filter.id),
        });
      }

      if (filter.dateRange) {
        const [start, end] = filter.dateRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            date: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            date: {
              $lte: end,
            },
          });
        }
      }

      if (filter.customerTenant) {
        criteriaAnd.push({
          customerTenant:
          filter.customerTenant,
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

    let rows = await ServiceReservation(options.database)
        .find(criteria)
        .skip(skip)
        .limit(limitEscaped)
        .sort(sort)
        .populate('serviceType')
        .populate('serviceProviderIDs')
        .populate('place')
        .populate('discountCode')

    const count = await ServiceReservation(
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
          
        ],
      });
    }

    const sort = MongooseQueryUtils.sort('id_ASC');
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    const records = await ServiceReservation(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record.id,
    }));
  }

  static async _createAuditLog(action, id, data, options: IRepositoryOptions) {
    await AuditLogRepository.log(
      {
        entityName: ServiceReservation(options.database).modelName,
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

    output.digitalReservationDoc = await FileRepository.fillDownloadUrl(
      output.digitalReservationDoc,
    );



    return output;
  }
}

export default ServiceReservationRepository;
