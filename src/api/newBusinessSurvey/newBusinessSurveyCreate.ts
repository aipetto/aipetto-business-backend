import ApiResponseHandler from '../apiResponseHandler';
import NewBusinessSurveyService from '../../services/newBusinessSurveyService';

export default async (req, res, next) => {
  try {
      const payload = await new NewBusinessSurveyService(req).create(
      req.body.data,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
