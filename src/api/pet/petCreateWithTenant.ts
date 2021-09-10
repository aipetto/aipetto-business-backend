import ApiResponseHandler from '../apiResponseHandler';
import PetService from '../../services/petService';

export default async (req, res, next) => {
  try {
    const payload = await new PetService(req).createWitTenantOnPayload(
      req.body.data,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
