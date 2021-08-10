import ApiResponseHandler from '../apiResponseHandler';
import PostCategoriesService from '../../services/postCategoriesService';

export default async (req, res, next) => {
  try {
    const payload = await new PostCategoriesService(
      req,
    ).findAndCountAll(req.query);

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
