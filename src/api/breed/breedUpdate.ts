import ApiResponseHandler from '../apiResponseHandler';
import Permissions from '../../security/permissions';
import BreedService from '../../services/breedService';
import PermissionChecker from "../../services/user/permissionChecker";

export default async (req, res, next) => {
  try {
    new PermissionChecker(req).validateHas(
        Permissions.values.breedEdit,
    );

    const payload = await new BreedService(req).update(
        req.params.id,
        req.body.data,
    );

    await ApiResponseHandler.success(req, res, payload);
  } catch (error) {
    await ApiResponseHandler.error(req, res, error);
  }
};
