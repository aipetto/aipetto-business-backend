import MongooseRepository from './mongooseRepository';
import MongooseQueryUtils from '../utils/mongooseQueryUtils';
import AuditLogRepository from './auditLogRepository';
import Error404 from '../../errors/Error404';
import { IRepositoryOptions } from './IRepositoryOptions';
import Discounts from '../models/discounts';
import ServiceReservation from '../models/serviceReservation';

class DiscountsRepository {
  
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    const [record] = await Discounts(
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
      Discounts(options.database).findById(id),
      options,
    );

    if (
      !record ||
      String(record.tenant) !== String(currentTenant.id)
    ) {
      throw new Error404();
    }

    await Discounts(options.database).updateOne(
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
      Discounts(options.database).findById(id),
      options,
    );

    if (
      !record ||
      String(record.tenant) !== String(currentTenant.id)
    ) {
      throw new Error404();
    }

    await Discounts(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(
      AuditLogRepository.DELETE,
      id,
      record,
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      ServiceReservation(options.database),
      'discountCode',
      options,
    );
  }

  static async count(filter, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    return MongooseRepository.wrapWithSessionIfExists(
      Discounts(options.database).countDocuments({
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
      Discounts(options.database)
        .findById(id),
      options,
    );

    if (
      !record ||
      String(record.tenant) !== String(currentTenant.id)
    ) {
      throw new Error404();
    }

    return this._fillFileDownloadUrls(record);
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

      if (filter.codeName) {
        criteriaAnd.push({
          codeName: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.codeName,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.discountPercentageRange) {
        const [start, end] = filter.discountPercentageRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            discountPercentage: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            discountPercentage: {
              $lte: end,
            },
          });
        }
      }

      if (filter.expirationDateRange) {
        const [start, end] = filter.expirationDateRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            expirationDate: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            expirationDate: {
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

    let rows = await Discounts(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort);

    const count = await Discounts(
      options.database,
    ).countDocuments(criteria);

    rows = await Promise.all(
      rows.map(this._fillFileDownloadUrls),
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
            codeName: {
              $regex: MongooseQueryUtils.escapeRegExp(search),
              $options: 'i',
            }
          },          
        ],
      });
    }

    const sort = MongooseQueryUtils.sort('codeName_ASC');
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    const records = await Discounts(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record.codeName,
    }));
  }

  static async _createAuditLog(action, id, data, options: IRepositoryOptions) {
    await AuditLogRepository.log(
      {
        entityName: Discounts(options.database).modelName,
        entityId: id,
        action,
        values: data,
      },
      options,
    );
  }

  static async _fillFileDownloadUrls(record) {
    if (!record) {
      return null;
    }

    const output = record.toObject
      ? record.toObject()
      : record;



    return output;
  }
}

export default DiscountsRepository;
