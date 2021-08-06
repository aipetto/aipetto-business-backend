import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import BusinessRepository from '../database/repositories/businessRepository';
import BusinessServicesTypesRepository from '../database/repositories/businessServicesTypesRepository';
import BusinessCategoryRepository from '../database/repositories/businessCategoryRepository';
import CityRepository from '../database/repositories/cityRepository';
import StateRepository from '../database/repositories/stateRepository';
import CountryRepository from '../database/repositories/countryRepository';
import LanguagesRepository from '../database/repositories/languagesRepository';
import CurrencyRepository from '../database/repositories/currencyRepository';

export default class BusinessService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.services = await BusinessServicesTypesRepository.filterIdsInTenant(data.services, { ...this.options, session });
      data.categories = await BusinessCategoryRepository.filterIdsInTenant(data.categories, { ...this.options, session });
      data.city = await CityRepository.filterIdInTenant(data.city, { ...this.options, session });
      data.state = await StateRepository.filterIdInTenant(data.state, { ...this.options, session });
      data.country = await CountryRepository.filterIdInTenant(data.country, { ...this.options, session });
      data.language = await LanguagesRepository.filterIdInTenant(data.language, { ...this.options, session });
      data.currency = await CurrencyRepository.filterIdInTenant(data.currency, { ...this.options, session });

      const record = await BusinessRepository.create(data, {
        ...this.options,
        session,
      });

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);

      MongooseRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'business',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.services = await BusinessServicesTypesRepository.filterIdsInTenant(data.services, { ...this.options, session });
      data.categories = await BusinessCategoryRepository.filterIdsInTenant(data.categories, { ...this.options, session });
      data.city = await CityRepository.filterIdInTenant(data.city, { ...this.options, session });
      data.state = await StateRepository.filterIdInTenant(data.state, { ...this.options, session });
      data.country = await CountryRepository.filterIdInTenant(data.country, { ...this.options, session });
      data.language = await LanguagesRepository.filterIdInTenant(data.language, { ...this.options, session });
      data.currency = await CurrencyRepository.filterIdInTenant(data.currency, { ...this.options, session });

      const record = await BusinessRepository.update(
        id,
        data,
        {
          ...this.options,
          session,
        },
      );

      await MongooseRepository.commitTransaction(session);

      return record;
    } catch (error) {
      await MongooseRepository.abortTransaction(session);

      MongooseRepository.handleUniqueFieldError(
        error,
        this.options.language,
        'business',
      );

      throw error;
    }
  }

  async destroyAll(ids) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      for (const id of ids) {
        await BusinessRepository.destroy(id, {
          ...this.options,
          session,
        });
      }

      await MongooseRepository.commitTransaction(session);
    } catch (error) {
      await MongooseRepository.abortTransaction(session);
      throw error;
    }
  }

  async findById(id) {
    return BusinessRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return BusinessRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return BusinessRepository.findAndCountAll(
      args,
      this.options,
    );
  }

  async import(data, importHash) {
    if (!importHash) {
      throw new Error400(
        this.options.language,
        'importer.errors.importHashRequired',
      );
    }

    if (await this._isImportHashExistent(importHash)) {
      throw new Error400(
        this.options.language,
        'importer.errors.importHashExistent',
      );
    }

    const dataToCreate = {
      ...data,
      importHash,
    };

    return this.create(dataToCreate);
  }

  async _isImportHashExistent(importHash) {
    const count = await BusinessRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
