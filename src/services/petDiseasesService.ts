import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import { IServiceOptions } from './IServiceOptions';
import PetDiseasesRepository from '../database/repositories/petDiseasesRepository';
import PetTypesRepository from '../database/repositories/petTypesRepository';
import BreedRepository from '../database/repositories/breedRepository';

export default class PetDiseasesService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.specificPetTypes = await PetTypesRepository.filterIdsInTenant(data.specificPetTypes, { ...this.options, session });
      data.specificPetBreeds = await BreedRepository.filterIdsInTenant(data.specificPetBreeds, { ...this.options, session });

      const record = await PetDiseasesRepository.create(data, {
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
        'petDiseases',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.specificPetTypes = await PetTypesRepository.filterIdsInTenant(data.specificPetTypes, { ...this.options, session });
      data.specificPetBreeds = await BreedRepository.filterIdsInTenant(data.specificPetBreeds, { ...this.options, session });

      const record = await PetDiseasesRepository.update(
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
        'petDiseases',
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
        await PetDiseasesRepository.destroy(id, {
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
    return PetDiseasesRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return PetDiseasesRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return PetDiseasesRepository.findAndCountAll(
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
    const count = await PetDiseasesRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
