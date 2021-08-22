import Error400 from '../errors/Error400';
import MongooseRepository from '../database/repositories/mongooseRepository';
import {IServiceOptions} from './IServiceOptions';
import PostsRepository from '../database/repositories/postsRepository';
import PostCategoriesRepository from '../database/repositories/postCategoriesRepository';
import PostCommentsRepository from '../database/repositories/postCommentsRepository';
import UserRepository from '../database/repositories/userRepository';

export default class PostsService {
  options: IServiceOptions;

  constructor(options) {
    this.options = options;
  }

  async create(data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.authors = await UserRepository.filterIdsInTenant(data.authors, { ...this.options, session });
      data.postCategory = await PostCategoriesRepository.filterIdsInTenant(data.postCategory, { ...this.options, session });
      data.comments = await PostCommentsRepository.filterIdsInTenant(data.comments, { ...this.options, session });

      const record = await PostsRepository.create(data, {
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
        'posts',
      );

      throw error;
    }
  }

  async update(id, data) {
    const session = await MongooseRepository.createSession(
      this.options.database,
    );

    try {
      data.authors = await UserRepository.filterIdsInTenant(data.authors, { ...this.options, session });
      data.postCategory = await PostCategoriesRepository.filterIdsInTenant(data.postCategory, { ...this.options, session });
      data.comments = await PostCommentsRepository.filterIdsInTenant(data.comments, { ...this.options, session });

      const record = await PostsRepository.update(
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
        'posts',
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
        await PostsRepository.destroy(id, {
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
    return PostsRepository.findById(id, this.options);
  }

  async findAllAutocomplete(search, limit) {
    return PostsRepository.findAllAutocomplete(
      search,
      limit,
      this.options,
    );
  }

  async findAndCountAll(args) {
    return PostsRepository.findAndCountAll(
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
    const count = await PostsRepository.count(
      {
        importHash,
      },
      this.options,
    );

    return count > 0;
  }
}
