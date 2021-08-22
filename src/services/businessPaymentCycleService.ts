import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import {IServiceOptions} from './IServiceOptions';
import BusinessPaymentCycleRepository from '../database/repositories/businessPaymentCycleRepository';
import BusinessRepository from '../database/repositories/businessRepository';
import ServiceReservationRepository from '../database/repositories/serviceReservationRepository';
import CustomerRepository from '../database/repositories/customerRepository';

export default class BusinessPaymentCycleService {
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
      data.businessServiceReservationsUsed = await ServiceReservationRepository.filterIdsInTenant(data.businessServiceReservationsUsed, { ...this.options, session });
      data.customerID = await CustomerRepository.filterIdInTenant(data.customerID, { ...this.options, session });

      const record = await BusinessPaymentCycleRepository.create(data, {
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
        'businessPaymentCycle',
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
      data.businessServiceReservationsUsed = await ServiceReservationRepository.filterIdsInTenant(data.businessServiceReservationsUsed, { ...this.options, session });
      data.customerID = await CustomerRepository.filterIdInTenant(data.customerID, { ...this.options, session });

      const record = await BusinessPaymentCycleRepository.update(
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
        'businessPaymentCycle',
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
        await BusinessPaymentCycleRepository.destroy(id, {
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
    return BusinessPaymentCycleRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return BusinessPaymentCycleRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return BusinessPaymentCycleRepository.findAndCountAll(
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
    const count = await BusinessPaymentCycleRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
