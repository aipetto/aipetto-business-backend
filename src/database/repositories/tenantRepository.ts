import MongooseRepository from './mongooseRepository';
import MongooseQueryUtils from '../utils/mongooseQueryUtils';
import AuditLogRepository from './auditLogRepository';
import User from '../models/user';
import Tenant from '../models/tenant';
import Settings from '../models/settings';
import Error404 from '../../errors/Error404';
import Customer from '../models/customer';
import Product from '../models/product';
import Order from '../models/order';
import Pet from '../models/pet';
import Breed from '../models/breed';
import PetTypes from '../models/petTypes';
import Business from '../models/business';
import Place from '../models/place';
import BusinessServicesTypes from '../models/businessServicesTypes';
import ServiceReservation from '../models/serviceReservation';
import BusinessPlaceServiceAvailability from '../models/businessPlaceServiceAvailability';
import Country from '../models/country';
import City from '../models/city';
import State from '../models/state';
import Messages from '../models/messages';
import ProfessionalsServiceAvailability from '../models/professionalsServiceAvailability';
import Languages from '../models/languages';
import Currency from '../models/currency';
import Discounts from '../models/discounts';
import Wallet from '../models/wallet';
import BusinessCategory from '../models/businessCategory';
import Providers from '../models/providers';
import VaccineTypes from '../models/vaccineTypes';
import PetVaccines from '../models/petVaccines';
import PlaceType from '../models/placeType';
import LandingSurvey from '../models/landingSurvey';
import NewBusinessSurvey from '../models/newBusinessSurvey';
import PetPhotos from '../models/petPhotos';
import PetDiseases from '../models/petDiseases';
import BusinessServicesPrices from '../models/businessServicesPrices';
import Posts from '../models/posts';
import PostCategories from '../models/postCategories';
import PostComments from '../models/postComments';
import PointsChallenges from '../models/pointsChallenges';
import ChallengesCategories from '../models/challengesCategories';
import ProductCategory from '../models/productCategory';
import Error400 from '../../errors/Error400';
import { v4 as uuid } from 'uuid';
import { isUserInTenant } from '../utils/userTenantUtils';
import SettingsRepository from './settingsRepository';
import { IRepositoryOptions } from './IRepositoryOptions';

const forbiddenTenantUrls = ['www'];

class TenantRepository {
  
  static async create(data, options: IRepositoryOptions) {
    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    // URL is required,
    // in case of multi tenant without subdomain
    // set a random uuid
    data.url = data.url || uuid();

    const existsUrl = Boolean(
      await this.count({ url: data.url }, options),
    );

    if (
      forbiddenTenantUrls.includes(data.url) ||
      existsUrl
    ) {
      throw new Error400(
        options.language,
        'tenant.url.exists',
      );
    }

    const [record] = await Tenant(options.database).create(
      [
        {
          ...data,
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
      {
        ...options,
        currentTenant: record,
      },
    );

    return this.findById(record.id, {
      ...options,
    });
  }

  static async update(
    id,
    data,
    options: IRepositoryOptions,
  ) {
    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    if (!isUserInTenant(currentUser, id)) {
      throw new Error404();
    }

    const record = await this.findById(id, options);

    // When not multi-with-subdomain, the
    // from passes the URL as undefined.
    // This way it's ensured that the URL will
    // remain the old one
    data.url = data.url || record.url;

    const existsUrl = Boolean(
      await this.count(
        { url: data.url, _id: { $ne: id } },
        options,
      ),
    );

    if (
      forbiddenTenantUrls.includes(data.url) ||
      existsUrl
    ) {
      throw new Error400(
        options.language,
        'tenant.url.exists',
      );
    }

    // Does not allow user to update the plan
    // only by updating the tenant
    delete data.plan;
    delete data.planStripeCustomerId;
    delete data.planUserId;
    delete data.planStatus;

    await Tenant(options.database).updateOne(
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

    return await this.findById(id, options);
  }

  /**
   * Updates the Tenant Plan user.
   */
  static async updatePlanUser(
    id,
    planStripeCustomerId,
    planUserId,
    options: IRepositoryOptions,
  ) {
    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    const data = {
      planStripeCustomerId,
      planUserId,
      updatedBy: currentUser.id,
    };

    await Tenant(options.database).updateOne(
      { _id: id },
      data,
      options,
    );

    await this._createAuditLog(
      AuditLogRepository.UPDATE,
      id,
      data,
      options,
    );

    return await this.findById(id, options);
  }

  static async updatePlanStatus(
    planStripeCustomerId,
    plan,
    planStatus,
    options: IRepositoryOptions,
  ) {
    const data = {
      plan,
      planStatus,
      updatedBy: null,
    };

    const record = await MongooseRepository.wrapWithSessionIfExists(
      Tenant(options.database).findOne({
        planStripeCustomerId,
      }),
      options,
    );

    await Tenant(options.database).updateOne(
      { _id: record.id },
      data,
      options,
    );

    await this._createAuditLog(
      AuditLogRepository.UPDATE,
      record.id,
      data,
      options,
    );

    return await this.findById(record.id, options);
  }
  
  static async destroy(id, options: IRepositoryOptions) {
    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    if (!isUserInTenant(currentUser, id)) {
      throw new Error404();
    }

    let record = await MongooseRepository.wrapWithSessionIfExists(
      Tenant(options.database).findById(id),
      options,
    );

    await Tenant(options.database).deleteOne(
      { _id: id },
      options,
    );

    await this._createAuditLog(
      AuditLogRepository.DELETE,
      id,
      record,
      options,
    );

    await Customer(options.database).deleteMany({ tenant: id }, options);

    await Product(options.database).deleteMany({ tenant: id }, options);

    await Order(options.database).deleteMany({ tenant: id }, options);

    await Pet(options.database).deleteMany({ tenant: id }, options);

    await Breed(options.database).deleteMany({ tenant: id }, options);

    await PetTypes(options.database).deleteMany({ tenant: id }, options);

    await Business(options.database).deleteMany({ tenant: id }, options);

    await Place(options.database).deleteMany({ tenant: id }, options);

    await BusinessServicesTypes(options.database).deleteMany({ tenant: id }, options);

    await ServiceReservation(options.database).deleteMany({ tenant: id }, options);

    await BusinessPlaceServiceAvailability(options.database).deleteMany({ tenant: id }, options);

    await Country(options.database).deleteMany({ tenant: id }, options);

    await City(options.database).deleteMany({ tenant: id }, options);

    await State(options.database).deleteMany({ tenant: id }, options);

    await Messages(options.database).deleteMany({ tenant: id }, options);

    await ProfessionalsServiceAvailability(options.database).deleteMany({ tenant: id }, options);

    await Languages(options.database).deleteMany({ tenant: id }, options);

    await Currency(options.database).deleteMany({ tenant: id }, options);

    await Discounts(options.database).deleteMany({ tenant: id }, options);

    await Wallet(options.database).deleteMany({ tenant: id }, options);

    await BusinessCategory(options.database).deleteMany({ tenant: id }, options);

    await Providers(options.database).deleteMany({ tenant: id }, options);

    await VaccineTypes(options.database).deleteMany({ tenant: id }, options);

    await PetVaccines(options.database).deleteMany({ tenant: id }, options);

    await PlaceType(options.database).deleteMany({ tenant: id }, options);

    await LandingSurvey(options.database).deleteMany({ tenant: id }, options);

    await NewBusinessSurvey(options.database).deleteMany({ tenant: id }, options);

    await PetPhotos(options.database).deleteMany({ tenant: id }, options);

    await PetDiseases(options.database).deleteMany({ tenant: id }, options);

    await BusinessServicesPrices(options.database).deleteMany({ tenant: id }, options);

    await Posts(options.database).deleteMany({ tenant: id }, options);

    await PostCategories(options.database).deleteMany({ tenant: id }, options);

    await PostComments(options.database).deleteMany({ tenant: id }, options);

    await PointsChallenges(options.database).deleteMany({ tenant: id }, options);

    await ChallengesCategories(options.database).deleteMany({ tenant: id }, options);

    await ProductCategory(options.database).deleteMany({ tenant: id }, options);

    await Settings(options.database).deleteMany(
      { tenant: id },
      options,
    );

    await User(options.database).updateMany(
      {},
      {
        $pull: {
          tenants: { tenant: id },
        },
      },
      options,
    );
  }

  static async count(filter, options: IRepositoryOptions) {
    return MongooseRepository.wrapWithSessionIfExists(
      Tenant(options.database).countDocuments(filter),
      options,
    );
  }

  static async findById(id, options: IRepositoryOptions) {
    const record = await MongooseRepository.wrapWithSessionIfExists(
      Tenant(options.database).findById(id),
      options,
    );

    if (!record) {
      return record;
    }

    const output = record.toObject
      ? record.toObject()
      : record;

    output.settings = await SettingsRepository.find({
      currentTenant: record,
      ...options,
    });

    return output;
  }

  static async findByUrl(url, options: IRepositoryOptions) {
    const record = await MongooseRepository.wrapWithSessionIfExists(
      Tenant(options.database).findOne({ url }),
      options,
    );

    if (!record) {
      return null;
    }

    const output = record.toObject
      ? record.toObject()
      : record;

    output.settings = await SettingsRepository.find({
      currentTenant: record,
      ...options,
    });

    return output;
  }

  static async findDefault(options: IRepositoryOptions) {
    return Tenant(options.database).findOne();
  }

  static async findAndCountAll(
    { filter, limit = 0, offset = 0, orderBy = '' },
    options: IRepositoryOptions,
  ) {
    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    let criteriaAnd: any = [];

    criteriaAnd.push({
      _id: {
        $in: currentUser.tenants
          .filter((userTenant) =>
            ['invited', 'active'].includes(
              userTenant.status,
            ),
          )
          .map((userTenant) => userTenant.tenant.id),
      },
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
      orderBy || 'name_ASC',
    );

    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = criteriaAnd.length
      ? { $and: criteriaAnd }
      : null;

    const rows = await Tenant(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort);

    const count = await Tenant(
      options.database,
    ).countDocuments(criteria);

    return { rows, count };
  }

  static async findAllAutocomplete(
    search,
    limit,
    options: IRepositoryOptions,
  ) {
    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    let criteriaAnd: Array<any> = [
      {
        _id: {
          $in: currentUser.tenants.map(
            (userTenant) => userTenant.tenant.id,
          ),
        },
      },
    ];

    if (search) {
      criteriaAnd.push({
        $or: [
          {
            _id: MongooseQueryUtils.uuid(search),
          },
          {
            name: {
              $regex: MongooseQueryUtils.escapeRegExp(
                search,
              ),
              $options: 'i',
            },
          },
        ],
      });
    }

    const sort = MongooseQueryUtils.sort('name_ASC');
    const limitEscaped = Number(limit || 0) || undefined;

    const criteria = { $and: criteriaAnd };

    const records = await Tenant(options.database)
      .find(criteria)
      .limit(limitEscaped)
      .sort(sort);

    return records.map((record) => ({
      id: record.id,
      label: record['name'],
    }));
  }

  static async _createAuditLog(
    action,
    id,
    data,
    options: IRepositoryOptions,
  ) {
    await AuditLogRepository.log(
      {
        entityName: Tenant(options.database).modelName,
        entityId: id,
        action,
        values: data,
      },
      options,
    );
  }

  static _isUserInTenant(user, tenantId) {
    if (!user || !user.tenants) {
      return false;
    }

    return user.tenants.some(
      (tenantUser) =>
        String(tenantUser.tenant.id) === String(tenantId),
    );
  }
}

export default TenantRepository;
