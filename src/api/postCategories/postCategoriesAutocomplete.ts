import ApiResponseHandler from '../apiResponseHandler';
import PostCategoriesService from '../../services/postCategoriesService';

export default async (req, res, next) => {
  try {
    const payload = await new PostCategoriesService(
      req,
    ).findAllAutocomplete(req.query.query, req.query.limit);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
