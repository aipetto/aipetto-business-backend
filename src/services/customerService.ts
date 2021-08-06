import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import CustomerRepository from '../database/repositories/customerRepository';
import BusinessRepository from '../database/repositories/businessRepository';
import CountryRepository from '../database/repositories/countryRepository';
import CurrencyRepository from '../database/repositories/currencyRepository';
import UserRepository from '../database/repositories/userRepository';

export default class CustomerService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.businessId = await BusinessRepository.filterIdInTenant(data.businessId, { ...this.options, session });
      data.userId = await UserRepository.filterIdInTenant(data.userId, { ...this.options, session });
      data.country = await CountryRepository.filterIdInTenant(data.country, { ...this.options, session });
      data.currency = await CurrencyRepository.filterIdInTenant(data.currency, { ...this.options, session });
      data.language = await CurrencyRepository.filterIdInTenant(data.language, { ...this.options, session });

      const record = await CustomerRepository.create(data, {
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
        'customer',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.businessId = await BusinessRepository.filterIdInTenant(data.businessId, { ...this.options, session });
      data.userId = await UserRepository.filterIdInTenant(data.userId, { ...this.options, session });
      data.country = await CountryRepository.filterIdInTenant(data.country, { ...this.options, session });
      data.currency = await CurrencyRepository.filterIdInTenant(data.currency, { ...this.options, session });
      data.language = await CurrencyRepository.filterIdInTenant(data.language, { ...this.options, session });

      const record = await CustomerRepository.update(
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
        'customer',
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
        await CustomerRepository.destroy(id, {
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
    return CustomerRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return CustomerRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return CustomerRepository.findAndCountAll(
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
    const count = await CustomerRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
