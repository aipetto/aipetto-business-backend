import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import {IServiceOptions} from './IServiceOptions';
import ServiceReservationRepository from '../database/repositories/serviceReservationRepository';
import BusinessRepository from '../database/repositories/businessRepository';
import CustomerRepository from '../database/repositories/customerRepository';
import BusinessServicesTypesRepository from '../database/repositories/businessServicesTypesRepository';
import ProvidersRepository from '../database/repositories/providersRepository';
import PlaceRepository from '../database/repositories/placeRepository';
import DiscountsRepository from '../database/repositories/discountsRepository';
import CurrencyRepository from '../database/repositories/currencyRepository';
import CountryRepository from '../database/repositories/countryRepository';

export default class ServiceReservationService {
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

      // TODO add customer to tenant with the information from data
      // TODO add pet to customer just created
      console.log('reservation data ' + data.place);

      data.serviceProviderIDs = await ProvidersRepository.filterIdsInTenant(data.serviceProviderIDs, { ...this.options, session });
      data.place = await PlaceRepository.filterIdInTenant(data.place, { ...this.options, session });
      data.discountCode = await DiscountsRepository.filterIdInTenant(data.discountCode, { ...this.options, session });

      const record = await ServiceReservationRepository.create(data, {
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
        'serviceReservation',
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
      data.customerId = await CustomerRepository.filterIdInTenant(data.customerId, { ...this.options, session });
      data.serviceType = await BusinessServicesTypesRepository.filterIdsInTenant(data.serviceType, { ...this.options, session });
      data.serviceProviderIDs = await ProvidersRepository.filterIdsInTenant(data.serviceProviderIDs, { ...this.options, session });
      data.place = await PlaceRepository.filterIdInTenant(data.place, { ...this.options, session });
      data.discountCode = await DiscountsRepository.filterIdInTenant(data.discountCode, { ...this.options, session });
      data.currency = await CurrencyRepository.filterIdInTenant(data.currency, { ...this.options, session });
      data.country = await CountryRepository.filterIdInTenant(data.country, { ...this.options, session });

      const record = await ServiceReservationRepository.update(
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
        'serviceReservation',
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
        await ServiceReservationRepository.destroy(id, {
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
    return ServiceReservationRepository.findById(id, this.options);
  }

  async findByIdAndCustomerId(id, customerTenantId) {
    return ServiceReservationRepository.findByIdAndCustomerId(id, customerTenantId, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return ServiceReservationRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return ServiceReservationRepository.findAndCountAll(
      args,
      this.options,
    );
  }

  async findAndCountCustomerAllReservations(args) {
    return ServiceReservationRepository.findAndCountCustomersAllReservations(
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
    const count = await ServiceReservationRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
