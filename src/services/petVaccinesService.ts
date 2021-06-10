import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import PetVaccinesRepository from '../database/repositories/petVaccinesRepository';
import VaccineTypesRepository from '../database/repositories/vaccineTypesRepository';
import ProvidersRepository from '../database/repositories/providersRepository';
import PlaceRepository from '../database/repositories/placeRepository';
import BusinessRepository from '../database/repositories/businessRepository';
import CountryRepository from '../database/repositories/countryRepository';

export default class PetVaccinesService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.name = await VaccineTypesRepository.filterIdInTenant(data.name, { ...this.options, session });
      data.veterinarianID = await ProvidersRepository.filterIdInTenant(data.veterinarianID, { ...this.options, session });
      data.placeTaken = await PlaceRepository.filterIdInTenant(data.placeTaken, { ...this.options, session });
      data.businessID = await BusinessRepository.filterIdInTenant(data.businessID, { ...this.options, session });
      data.country = await CountryRepository.filterIdInTenant(data.country, { ...this.options, session });

      const record = await PetVaccinesRepository.create(data, {
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
        'petVaccines',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.name = await VaccineTypesRepository.filterIdInTenant(data.name, { ...this.options, session });
      data.veterinarianID = await ProvidersRepository.filterIdInTenant(data.veterinarianID, { ...this.options, session });
      data.placeTaken = await PlaceRepository.filterIdInTenant(data.placeTaken, { ...this.options, session });
      data.businessID = await BusinessRepository.filterIdInTenant(data.businessID, { ...this.options, session });
      data.country = await CountryRepository.filterIdInTenant(data.country, { ...this.options, session });

      const record = await PetVaccinesRepository.update(
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
        'petVaccines',
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
        await PetVaccinesRepository.destroy(id, {
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
    return PetVaccinesRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return PetVaccinesRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return PetVaccinesRepository.findAndCountAll(
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
    const count = await PetVaccinesRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
