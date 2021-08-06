import MongooseRepository from './mongooseRepository';
import MongooseQueryUtils from '../utils/mongooseQueryUtils';
import AuditLogRepository from './auditLogRepository';
import Error404 from '../../errors/Error404';
import { IRepositoryOptions } from './IRepositoryOptions';
import lodash from 'lodash';
import BusinessPaymentCycle from '../models/businessPaymentCycle';

class BusinessPaymentCycleRepository {
  
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    const [record] = await BusinessPaymentCycle(
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
      BusinessPaymentCycle(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await BusinessPaymentCycle(options.database).updateOne(
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
      BusinessPaymentCycle(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await BusinessPaymentCycle(options.database).deleteOne({ _id: id }, options);

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

    const records = await BusinessPaymentCycle(options.database)
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
      BusinessPaymentCycle(options.database).countDocuments({
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
      BusinessPaymentCycle(options.database)
        .findOne({_id: id, tenant: currentTenant.id})
      .populate('businessID')
      .populate('businessServiceReservationsUsed')
      .populate('customerID')
      .populate('country')
      .populate('currency'),
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
          businessID: MongooseQueryUtils.uuid(
            filter.businessID,
          ),
        });
      }

      if (filter.cycleStartRange) {
        const [start, end] = filter.cycleStartRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            cycleStart: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            cycleStart: {
              $lte: end,
            },
          });
        }
      }

      if (filter.cycleEndRange) {
        const [start, end] = filter.cycleEndRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            cycleEnd: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            cycleEnd: {
              $lte: end,
            },
          });
        }
      }

      if (filter.statusPayment) {
        criteriaAnd.push({
          statusPayment: filter.statusPayment
        });
      }

      if (filter.totalBusinessServiceReservationPeriodRange) {
        const [start, end] = filter.totalBusinessServiceReservationPeriodRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            totalBusinessServiceReservationPeriod: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            totalBusinessServiceReservationPeriod: {
              $lte: end,
            },
          });
        }
      }

      if (filter.totalCommisionCalculatedRange) {
        const [start, end] = filter.totalCommisionCalculatedRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            totalCommisionCalculated: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            totalCommisionCalculated: {
              $lte: end,
            },
          });
        }
      }

      if (filter.commisionRateUsedOnCalculationRange) {
        const [start, end] = filter.commisionRateUsedOnCalculationRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            commisionRateUsedOnCalculation: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            commisionRateUsedOnCalculation: {
              $lte: end,
            },
          });
        }
      }

      if (filter.statusCyclePayment) {
        criteriaAnd.push({
          statusCyclePayment: filter.statusCyclePayment
        });
      }

      if (filter.customerID) {
        criteriaAnd.push({
          customerID: MongooseQueryUtils.uuid(
            filter.customerID,
          ),
        });
      }

      if (filter.paymentMethod) {
        criteriaAnd.push({
          paymentMethod: filter.paymentMethod
        });
      }

      if (filter.paymentGatewayReferenceCode) {
        criteriaAnd.push({
          paymentGatewayReferenceCode: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.paymentGatewayReferenceCode,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.paymentGatewayType) {
        criteriaAnd.push({
          paymentGatewayType: filter.paymentGatewayType
        });
      }

      if (filter.country) {
        criteriaAnd.push({
          country: MongooseQueryUtils.uuid(
            filter.country,
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

    let rows = await BusinessPaymentCycle(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate('businessID')
      .populate('businessServiceReservationsUsed')
      .populate('customerID')
      .populate('country')
      .populate('currency');

    const count = await BusinessPaymentCycle(
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

    const records = await BusinessPaymentCycle(options.database)
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
        entityName: BusinessPaymentCycle(options.database).modelName,
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

export default BusinessPaymentCycleRepository;
