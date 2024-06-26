import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import {IServiceOptions} from './IServiceOptions';
import PetExaminationRepository from '../database/repositories/petExaminationRepository';
import PetRepository from '../database/repositories/petRepository';
import BusinessRepository from '../database/repositories/businessRepository';
import ProvidersRepository from '../database/repositories/providersRepository';
import UserRepository from '../database/repositories/userRepository';

export default class PetExaminationService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.petID = await PetRepository.filterIdInTenant(data.petID, { ...this.options, session });
      data.veterinariesResponsibleDiagnostic = await UserRepository.filterIdsInTenant(data.veterinariesResponsibleDiagnostic, { ...this.options, session });
      data.businessID = await BusinessRepository.filterIdInTenant(data.businessID, { ...this.options, session });
      data.providersID = await ProvidersRepository.filterIdsInTenant(data.providersID, { ...this.options, session });

      const record = await PetExaminationRepository.create(data, {
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
        'petExamination',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.petID = await PetRepository.filterIdInTenant(data.petID, { ...this.options, session });
      data.veterinariesResponsibleDiagnostic = await UserRepository.filterIdsInTenant(data.veterinariesResponsibleDiagnostic, { ...this.options, session });
      data.businessID = await BusinessRepository.filterIdInTenant(data.businessID, { ...this.options, session });
      data.providersID = await ProvidersRepository.filterIdsInTenant(data.providersID, { ...this.options, session });

      const record = await PetExaminationRepository.update(
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
        'petExamination',
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
        await PetExaminationRepository.destroy(id, {
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
    return PetExaminationRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return PetExaminationRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return PetExaminationRepository.findAndCountAll(
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
    const count = await PetExaminationRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
