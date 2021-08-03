import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import BusinessServicesPricesRepository from '../database/repositories/businessServicesPricesRepository';
import BusinessServicesTypesRepository from '../database/repositories/businessServicesTypesRepository';
import BusinessRepository from '../database/repositories/businessRepository';
import CurrencyRepository from '../database/repositories/currencyRepository';

export default class BusinessServicesPricesService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.service = await BusinessServicesTypesRepository.filterIdInTenant(data.service, { ...this.options, session });
      data.businessId = await BusinessRepository.filterIdInTenant(data.businessId, { ...this.options, session });
      data.currency = await CurrencyRepository.filterIdInTenant(data.currency, { ...this.options, session });

      const record = await BusinessServicesPricesRepository.create(data, {
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
        'businessServicesPrices',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.service = await BusinessServicesTypesRepository.filterIdInTenant(data.service, { ...this.options, session });
      data.businessId = await BusinessRepository.filterIdInTenant(data.businessId, { ...this.options, session });
      data.currency = await CurrencyRepository.filterIdInTenant(data.currency, { ...this.options, session });

      const record = await BusinessServicesPricesRepository.update(
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
        'businessServicesPrices',
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
        await BusinessServicesPricesRepository.destroy(id, {
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
    return BusinessServicesPricesRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return BusinessServicesPricesRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return BusinessServicesPricesRepository.findAndCountAll(
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
    const count = await BusinessServicesPricesRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}