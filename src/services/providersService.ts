import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import ProvidersRepository from '../database/repositories/providersRepository';
import BusinessRepository from '../database/repositories/businessRepository';
import BusinessCategoryRepository from '../database/repositories/businessCategoryRepository';
import BusinessServicesTypesRepository from '../database/repositories/businessServicesTypesRepository';
import CityRepository from '../database/repositories/cityRepository';
import StateRepository from '../database/repositories/stateRepository';
import CountryRepository from '../database/repositories/countryRepository';
import CurrencyRepository from '../database/repositories/currencyRepository';
import LanguagesRepository from '../database/repositories/languagesRepository';

export default class ProvidersService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.businessID = await BusinessRepository.filterIdInTenant(data.businessID, { ...this.options, session });
      data.category = await BusinessCategoryRepository.filterIdsInTenant(data.category, { ...this.options, session });
      data.serviceTypes = await BusinessServicesTypesRepository.filterIdsInTenant(data.serviceTypes, { ...this.options, session });
      data.city = await CityRepository.filterIdInTenant(data.city, { ...this.options, session });
      data.state = await StateRepository.filterIdInTenant(data.state, { ...this.options, session });
      data.country = await CountryRepository.filterIdInTenant(data.country, { ...this.options, session });
      data.currency = await CurrencyRepository.filterIdInTenant(data.currency, { ...this.options, session });

      const record = await ProvidersRepository.create(data, {
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
        'providers',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.businessID = await BusinessRepository.filterIdInTenant(data.businessID, { ...this.options, session });
      data.category = await BusinessCategoryRepository.filterIdsInTenant(data.category, { ...this.options, session });
      data.serviceTypes = await BusinessServicesTypesRepository.filterIdsInTenant(data.serviceTypes, { ...this.options, session });
      data.city = await CityRepository.filterIdInTenant(data.city, { ...this.options, session });
      data.state = await StateRepository.filterIdInTenant(data.state, { ...this.options, session });
      data.country = await CountryRepository.filterIdInTenant(data.country, { ...this.options, session });
      data.currency = await CurrencyRepository.filterIdInTenant(data.currency, { ...this.options, session });

      const record = await ProvidersRepository.update(
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
        'providers',
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
        await ProvidersRepository.destroy(id, {
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
    return ProvidersRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return ProvidersRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return ProvidersRepository.findAndCountAll(
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
    const count = await ProvidersRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
