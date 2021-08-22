import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import {IServiceOptions} from './IServiceOptions';
import MessagesRepository from '../database/repositories/messagesRepository';
import BusinessRepository from '../database/repositories/businessRepository';
import UserRepository from '../database/repositories/userRepository';

export default class MessagesService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.from = await UserRepository.filterIdInTenant(data.from, { ...this.options, session });
      data.to = await UserRepository.filterIdInTenant(data.to, { ...this.options, session });
      data.businessId = await BusinessRepository.filterIdInTenant(data.businessId, { ...this.options, session });

      const record = await MessagesRepository.create(data, {
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
        'messages',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.from = await UserRepository.filterIdInTenant(data.from, { ...this.options, session });
      data.to = await UserRepository.filterIdInTenant(data.to, { ...this.options, session });
      data.businessId = await BusinessRepository.filterIdInTenant(data.businessId, { ...this.options, session });

      const record = await MessagesRepository.update(
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
        'messages',
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
        await MessagesRepository.destroy(id, {
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
    return MessagesRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return MessagesRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return MessagesRepository.findAndCountAll(
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
    const count = await MessagesRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
