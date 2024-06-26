import MongooseRepository from './mongooseRepository';
import MongooseQueryUtils from '../utils/mongooseQueryUtils';
import AuditLogRepository from './auditLogRepository';
import Error404 from '../../errors/Error404';
import { IRepositoryOptions } from './IRepositoryOptions';
import lodash from 'lodash';
import Place from '../models/place';
import FileRepository from './fileRepository';
import ServiceReservation from '../models/serviceReservation';
import BusinessPlaceServiceAvailability from '../models/businessPlaceServiceAvailability';
import PetVaccines from '../models/petVaccines';

class PlaceRepository {
  
  static async create(data, options: IRepositoryOptions) {
    const currentTenant = MongooseRepository.getCurrentTenant(
      options,
    );

    const currentUser = MongooseRepository.getCurrentUser(
      options,
    );

    const [record] = await Place(
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
      Place(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await Place(options.database).updateOne(
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
      Place(options.database).findOne({_id: id, tenant: currentTenant.id}),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    await Place(options.database).deleteOne({ _id: id }, options);

    await this._createAuditLog(
      AuditLogRepository.DELETE,
      id,
      record,
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      ServiceReservation(options.database),
      'place',
      options,
    );

    await MongooseRepository.destroyRelationToMany(
      id,
      BusinessPlaceServiceAvailability(options.database),
      'places',
      options,
    );

    await MongooseRepository.destroyRelationToOne(
      id,
      PetVaccines(options.database),
      'placeTaken',
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

    const records = await Place(options.database)
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
      Place(options.database).countDocuments({
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
      Place(options.database)
        .findOne({_id: id, tenant: currentTenant.id})
      .populate('placeType')
      .populate('businessId')
      .populate('services')
      .populate('categories')
      .populate('addressCountry'),
      options,
    );

    if (!record) {
      throw new Error404();
    }

    return this._mapRelationshipsAndFillDownloadUrl(record);
  }

  static async findAllPlacesAndCountAll(
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

      if (filter.businessId) {
        criteriaAnd.push({
          businessId: MongooseQueryUtils.uuid(
            filter.businessId,
          ),
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

      if (filter.addressNumber) {
        criteriaAnd.push({
          addressNumber: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.addressNumber,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.addressZipCode) {
        criteriaAnd.push({
          addressZipCode: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.addressZipCode,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.addressCity) {
        criteriaAnd.push({
          addressCity: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.addressCity,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.addressState) {
        criteriaAnd.push({
          addressState: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.addressState,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.addressCountry) {
        criteriaAnd.push({
          addressCountry: MongooseQueryUtils.uuid(
            filter.addressCountry,
          ),
        });
      }

      if (filter.openTime) {
        criteriaAnd.push({
          openTime: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.openTime,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.closeTime) {
        criteriaAnd.push({
          closeTime: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.closeTime,
            ),
            $options: 'i',
          },
        });
      }

      if (
        filter.is24hours === true ||
        filter.is24hours === 'true' ||
        filter.is24hours === false ||
        filter.is24hours === 'false'
      ) {
        criteriaAnd.push({
          is24hours:
            filter.is24hours === true ||
            filter.is24hours === 'true',
        });
      }

      if (filter.starsRange) {
        const [start, end] = filter.starsRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            stars: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            stars: {
              $lte: end,
            },
          });
        }
      }

      if (
        filter.isOpen === true ||
        filter.isOpen === 'true' ||
        filter.isOpen === false ||
        filter.isOpen === 'false'
      ) {
        criteriaAnd.push({
          isOpen:
            filter.isOpen === true ||
            filter.isOpen === 'true',
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

    let rows = await Place(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate('placeType')
      .populate('businessId')
      .populate('services')
      .populate('categories')
      .populate('addressCountry');

    const count = await Place(
      options.database,
    ).countDocuments(criteria);

    rows = await Promise.all(
      rows.map(this._mapRelationshipsAndFillDownloadUrl),
    );

    return { rows, count };
  }static async findAndCountAll(
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

      if (filter.addressNumber) {
        criteriaAnd.push({
          addressNumber: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.addressNumber,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.addressZipCode) {
        criteriaAnd.push({
          addressZipCode: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.addressZipCode,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.addressCity) {
        criteriaAnd.push({
          addressCity: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.addressCity,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.addressState) {
        criteriaAnd.push({
          addressState: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.addressState,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.addressCountry) {
        criteriaAnd.push({
          addressCountry: MongooseQueryUtils.uuid(
            filter.addressCountry,
          ),
        });
      }

      if (filter.openTime) {
        criteriaAnd.push({
          openTime: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.openTime,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.closeTime) {
        criteriaAnd.push({
          closeTime: {
            $regex: MongooseQueryUtils.escapeRegExp(
              filter.closeTime,
            ),
            $options: 'i',
          },
        });
      }

      if (
        filter.is24hours === true ||
        filter.is24hours === 'true' ||
        filter.is24hours === false ||
        filter.is24hours === 'false'
      ) {
        criteriaAnd.push({
          is24hours:
            filter.is24hours === true ||
            filter.is24hours === 'true',
        });
      }

      if (filter.starsRange) {
        const [start, end] = filter.starsRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            stars: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            stars: {
              $lte: end,
            },
          });
        }
      }

      if (
        filter.isOpen === true ||
        filter.isOpen === 'true' ||
        filter.isOpen === false ||
        filter.isOpen === 'false'
      ) {
        criteriaAnd.push({
          isOpen:
            filter.isOpen === true ||
            filter.isOpen === 'true',
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

    let rows = await Place(options.database)
      .find(criteria)
      .skip(skip)
      .limit(limitEscaped)
      .sort(sort)
      .populate('placeType')
      .populate('businessId')
      .populate('services')
      .populate('categories')
      .populate('addressCountry');

    const count = await Place(
      options.database,
    ).countDocuments(criteria);

    rows = await Promise.all(
      rows.map(this._mapRelationshipsAndFillDownloadUrl),
    );

    return { rows, count };
  }

  static async findPlacesNearby(
      { filter, limit = 0, offset = 0, orderBy = '' },
      options: IRepositoryOptions,
  ) {

    let criteriaAnd: any = [];

    criteriaAnd.push({});

    if (filter) {
      console.log(filter);

      if (filter.longitude !== undefined &&
          filter.latitude !== undefined &&
          filter.longitude !== null &&
          filter.longitude !== '' &&
          filter.latitude !== null &&
          filter.latitude !== '') {
        criteriaAnd.push({
          location: {
            "$near": {
              "$geometry": {
                "type": "Point",
                "coordinates": [
                  parseFloat(filter.longitude),
                  parseFloat(filter.latitude)
                ]
              },
              "$maxDistance": 10000
            }
          }
        });
      }
      /**
      if (filter.id) {
        criteriaAnd.push({
          ['_id']: MongooseQueryUtils.uuid(filter.id),
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



      if (filter.addressNumber) {
        criteriaAnd.push({
          addressNumber: {
            $regex: MongooseQueryUtils.escapeRegExp(
                filter.addressNumber,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.addressZipCode) {
        criteriaAnd.push({
          addressZipCode: {
            $regex: MongooseQueryUtils.escapeRegExp(
                filter.addressZipCode,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.addressCity) {
        criteriaAnd.push({
          addressCity: {
            $regex: MongooseQueryUtils.escapeRegExp(
                filter.addressCity,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.addressState) {
        criteriaAnd.push({
          addressState: {
            $regex: MongooseQueryUtils.escapeRegExp(
                filter.addressState,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.addressCountry) {
        criteriaAnd.push({
          addressCountry: MongooseQueryUtils.uuid(
              filter.addressCountry,
          ),
        });
      }

      if (filter.openTime) {
        criteriaAnd.push({
          openTime: {
            $regex: MongooseQueryUtils.escapeRegExp(
                filter.openTime,
            ),
            $options: 'i',
          },
        });
      }

      if (filter.closeTime) {
        criteriaAnd.push({
          closeTime: {
            $regex: MongooseQueryUtils.escapeRegExp(
                filter.closeTime,
            ),
            $options: 'i',
          },
        });
      }

      if (
          filter.is24hours === true ||
          filter.is24hours === 'true' ||
          filter.is24hours === false ||
          filter.is24hours === 'false'
      ) {
        criteriaAnd.push({
          is24hours:
              filter.is24hours === true ||
              filter.is24hours === 'true',
        });
      }

      if (filter.starsRange) {
        const [start, end] = filter.starsRange;

        if (start !== undefined && start !== null && start !== '') {
          criteriaAnd.push({
            stars: {
              $gte: start,
            },
          });
        }

        if (end !== undefined && end !== null && end !== '') {
          criteriaAnd.push({
            stars: {
              $lte: end,
            },
          });
        }
      }

      if (
          filter.isOpen === true ||
          filter.isOpen === 'true' ||
          filter.isOpen === false ||
          filter.isOpen === 'false'
      ) {
        criteriaAnd.push({
          isOpen:
              filter.isOpen === true ||
              filter.isOpen === 'true',
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
      **/
    }

    const sort = MongooseQueryUtils.sort(
        orderBy || 'createdAt_DESC',
    );

    const skip = Number(offset || 0) || undefined;
    const limitEscaped = Number(limit || 0) || undefined;
    const criteria = criteriaAnd.length
        ? { $and: criteriaAnd }
        : null;

    let rows = await Place(options.database)
        .find(criteria)
        .skip(skip)
        .limit(limitEscaped)
        .sort(sort)
        .populate('placeType')
        .populate('businessId')
        .populate('services')
        .populate('categories')
        .populate('addressCountry');

    const count = await Place(
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

    const records = await Place(options.database)
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
        entityName: Place(options.database).modelName,
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

    output.photoLogo = await FileRepository.fillDownloadUrl(
      output.photoLogo,
    );

    output.photoStore = await FileRepository.fillDownloadUrl(
      output.photoStore,
    );



    return output;
  }
}

export default PlaceRepository;
