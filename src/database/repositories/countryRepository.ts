import MongooseRepository from './mongooseRepository';
import MongooseQueryUtils from '../utils/mongooseQueryUtils';
import AuditLogRepository from './auditLogRepository';
import Error404 from '../../errors/Error404';
import { IRepositoryOptions } from './IRepositoryOptions';
import lodash from 'lodash';
import Country from '../models/country';
import Customer from '../models/customer';
import Product from '../models/product';
import Business from '../models/business';
import Place from '../models/place';
import ServiceReservation from '../models/serviceReservation';
import City from '../models/city';
import State from '../models/state';
import Providers from '../models/providers';
import VaccineTypes from '../models/vaccineTypes';
import PetVaccines from '../models/petVaccines';
import LandingSurvey from '../models/landingSurvey';
import Posts from '../models/posts';
import PointsChallenges from '../models/pointsChallenges';
import Deals from '../models/deals';
import BusinessPaymentCycle from '../models/businessPaymentCycle';
import Questions from '../models/questions';
import Contacts from '../models/contacts';

class CountryRepository {
  
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    const [record] = await Country(
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
      Country(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await Country(options.database).updateOne(
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
      Country(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await Country(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(
      AuditLogRepository.DELETE,
      id,
      record,
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Customer(options.database),
      'country',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Product(options.database),
      'country',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Business(options.database),
      'country',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Place(options.database),
      'addressCountry',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      ServiceReservation(options.database),
      'country',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      City(options.database),
      'country',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      State(options.database),
      'country',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Providers(options.database),
      'country',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      VaccineTypes(options.database),
      'country',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      PetVaccines(options.database),
      'country',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      LandingSurvey(options.database),
      'country',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Posts(options.database),
      'country',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      PointsChallenges(options.database),
      'country',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Deals(options.database),
      'country',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      BusinessPaymentCycle(options.database),
      'country',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Questions(options.database),
      'country',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      Contacts(options.database),
      'country',
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

    const records = await Country(options.database)
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
      Country(options.database).countDocuments({
        ...filter,
        tenant: currentTenant.id,
      }),
      options,
    );
  }

  static async findById(id, options: IRepositoryOptions) {

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Country(options.database)
        .findOne({_id: id}),
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
    let criteriaAnd: any = [];
    
    criteriaAnd.push({});

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

      if (filter.initials) {
        criteriaAnd.push({
          initials: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.initials,
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

    let rows = await Country(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort);

    const count = await Country(
      options.database,
    ).countDocuments(criteria);

    rows = await Promise.all(
      rows.map(this._mapRelationshipsAndFillDownloadUrl),
    );

    return { rows, count };
  }

  static async findAllAutocomplete(search, limit, options: IRepositoryOptions) {
    let criteriaAnd: Array<any> = [{}];

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

    const records = await Country(options.database)
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
        entityName: Country(options.database).modelName,
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

export default CountryRepository;
