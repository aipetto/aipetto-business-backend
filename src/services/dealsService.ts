import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import DealsRepository from '../database/repositories/dealsRepository';
import CustomerRepository from '../database/repositories/customerRepository';
import BusinessRepository from '../database/repositories/businessRepository';
import CountryRepository from '../database/repositories/countryRepository';
import UserRepository from '../database/repositories/userRepository';

export default class DealsService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.customer = await CustomerRepository.filterIdInTenant(data.customer, { ...this.options, session });
      data.salesManagerResponsible = await UserRepository.filterIdInTenant(data.salesManagerResponsible, { ...this.options, session });
      data.businessID = await BusinessRepository.filterIdInTenant(data.businessID, { ...this.options, session });
      data.country = await CountryRepository.filterIdInTenant(data.country, { ...this.options, session });

      const record = await DealsRepository.create(data, {
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
        'deals',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.customer = await CustomerRepository.filterIdInTenant(data.customer, { ...this.options, session });
      data.salesManagerResponsible = await UserRepository.filterIdInTenant(data.salesManagerResponsible, { ...this.options, session });
      data.businessID = await BusinessRepository.filterIdInTenant(data.businessID, { ...this.options, session });
      data.country = await CountryRepository.filterIdInTenant(data.country, { ...this.options, session });

      const record = await DealsRepository.update(
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
        'deals',
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
        await DealsRepository.destroy(id, {
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
    return DealsRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return DealsRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return DealsRepository.findAndCountAll(
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
    const count = await DealsRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
