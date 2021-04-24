import Roles from './roles';
import Plans from './plans';
import Storage from './storage';

const storage = Storage.values;
const roles = Roles.values;
const plans = Plans.values;

class Permissions {
  static get values() {
    return {
      tenantEdit: {
        id: 'tenantEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.premium,
        ],
      },
      tenantDestroy: {
        id: 'tenantDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.premium,
        ],
      },
      planEdit: {
        id: 'planEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.premium,
        ],
      },
      planRead: {
        id: 'planRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.premium,
        ],
      },
      userEdit: {
        id: 'userEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.premium,
        ],
      },
      userDestroy: {
        id: 'userDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.premium,
        ],
      },
      userCreate: {
        id: 'userCreate',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.premium,
        ],
      },
      userImport: {
        id: 'userImport',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.premium,
        ],
      },
      userRead: {
        id: 'userRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.premium,
        ],
      },
      userAutocomplete: {
        id: 'userAutocomplete',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.premium,
        ],
      },
      auditLogRead: {
        id: 'auditLogRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.premium,
        ],
      },
      settingsEdit: {
        id: 'settingsEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [
          plans.free,
          plans.growth,
          plans.premium,
        ],
        allowedStorage: [
          storage.settingsBackgroundImages,
          storage.settingsLogos,
        ],
      },
      customerImport: {
        id: 'customerImport',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      customerCreate: {
        id: 'customerCreate',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      customerEdit: {
        id: 'customerEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      customerDestroy: {
        id: 'customerDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      customerRead: {
        id: 'customerRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      customerAutocomplete: {
        id: 'customerAutocomplete',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },

      productImport: {
        id: 'productImport',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      productCreate: {
        id: 'productCreate',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [
          storage.productPhotos,
        ],
      },
      productEdit: {
        id: 'productEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [
          storage.productPhotos,
        ],
      },
      productDestroy: {
        id: 'productDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [
          storage.productPhotos,
        ],
      },
      productRead: {
        id: 'productRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      productAutocomplete: {
        id: 'productAutocomplete',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },

      orderImport: {
        id: 'orderImport',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      orderCreate: {
        id: 'orderCreate',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [
          storage.orderAttachments,
        ],
      },
      orderEdit: {
        id: 'orderEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [
          storage.orderAttachments,
        ],
      },
      orderDestroy: {
        id: 'orderDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [
          storage.orderAttachments,
        ],
      },
      orderRead: {
        id: 'orderRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      orderAutocomplete: {
        id: 'orderAutocomplete',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },

      petImport: {
        id: 'petImport',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      petCreate: {
        id: 'petCreate',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [
          storage.petProfileImage,
        ],
      },
      petEdit: {
        id: 'petEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [
          storage.petProfileImage,
        ],
      },
      petDestroy: {
        id: 'petDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [
          storage.petProfileImage,
        ],
      },
      petRead: {
        id: 'petRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      petAutocomplete: {
        id: 'petAutocomplete',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },

      breedImport: {
        id: 'breedImport',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      breedCreate: {
        id: 'breedCreate',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [
          storage.breedImage,
        ],
      },
      breedEdit: {
        id: 'breedEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [
          storage.breedImage,
        ],
      },
      breedDestroy: {
        id: 'breedDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [
          storage.breedImage,
        ],
      },
      breedRead: {
        id: 'breedRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      breedAutocomplete: {
        id: 'breedAutocomplete',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },

      petTypesImport: {
        id: 'petTypesImport',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      petTypesCreate: {
        id: 'petTypesCreate',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [
          storage.petTypesImage,
        ],
      },
      petTypesEdit: {
        id: 'petTypesEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [
          storage.petTypesImage,
        ],
      },
      petTypesDestroy: {
        id: 'petTypesDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [
          storage.petTypesImage,
        ],
      },
      petTypesRead: {
        id: 'petTypesRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      petTypesAutocomplete: {
        id: 'petTypesAutocomplete',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },

      businessImport: {
        id: 'businessImport',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      businessCreate: {
        id: 'businessCreate',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      businessEdit: {
        id: 'businessEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      businessDestroy: {
        id: 'businessDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      businessRead: {
        id: 'businessRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      businessAutocomplete: {
        id: 'businessAutocomplete',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },

      placeImport: {
        id: 'placeImport',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      placeCreate: {
        id: 'placeCreate',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      placeEdit: {
        id: 'placeEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      placeDestroy: {
        id: 'placeDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      placeRead: {
        id: 'placeRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      placeAutocomplete: {
        id: 'placeAutocomplete',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },

      businessServicesTypesImport: {
        id: 'businessServicesTypesImport',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      businessServicesTypesCreate: {
        id: 'businessServicesTypesCreate',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      businessServicesTypesEdit: {
        id: 'businessServicesTypesEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      businessServicesTypesDestroy: {
        id: 'businessServicesTypesDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      businessServicesTypesRead: {
        id: 'businessServicesTypesRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      businessServicesTypesAutocomplete: {
        id: 'businessServicesTypesAutocomplete',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },

      serviceReservationImport: {
        id: 'serviceReservationImport',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      serviceReservationCreate: {
        id: 'serviceReservationCreate',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      serviceReservationEdit: {
        id: 'serviceReservationEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      serviceReservationDestroy: {
        id: 'serviceReservationDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      serviceReservationRead: {
        id: 'serviceReservationRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      serviceReservationAutocomplete: {
        id: 'serviceReservationAutocomplete',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },

      businessPlaceServiceAvailabilityImport: {
        id: 'businessPlaceServiceAvailabilityImport',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      businessPlaceServiceAvailabilityCreate: {
        id: 'businessPlaceServiceAvailabilityCreate',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      businessPlaceServiceAvailabilityEdit: {
        id: 'businessPlaceServiceAvailabilityEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      businessPlaceServiceAvailabilityDestroy: {
        id: 'businessPlaceServiceAvailabilityDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      businessPlaceServiceAvailabilityRead: {
        id: 'businessPlaceServiceAvailabilityRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      businessPlaceServiceAvailabilityAutocomplete: {
        id: 'businessPlaceServiceAvailabilityAutocomplete',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },

      countryImport: {
        id: 'countryImport',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      countryCreate: {
        id: 'countryCreate',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      countryEdit: {
        id: 'countryEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      countryDestroy: {
        id: 'countryDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      countryRead: {
        id: 'countryRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      countryAutocomplete: {
        id: 'countryAutocomplete',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },

      cityImport: {
        id: 'cityImport',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      cityCreate: {
        id: 'cityCreate',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      cityEdit: {
        id: 'cityEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      cityDestroy: {
        id: 'cityDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      cityRead: {
        id: 'cityRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      cityAutocomplete: {
        id: 'cityAutocomplete',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },

      stateImport: {
        id: 'stateImport',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      stateCreate: {
        id: 'stateCreate',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      stateEdit: {
        id: 'stateEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      stateDestroy: {
        id: 'stateDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      stateRead: {
        id: 'stateRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      stateAutocomplete: {
        id: 'stateAutocomplete',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },

      messagesImport: {
        id: 'messagesImport',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      messagesCreate: {
        id: 'messagesCreate',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      messagesEdit: {
        id: 'messagesEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      messagesDestroy: {
        id: 'messagesDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      messagesRead: {
        id: 'messagesRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      messagesAutocomplete: {
        id: 'messagesAutocomplete',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },

      professionalsServiceAvailabilityImport: {
        id: 'professionalsServiceAvailabilityImport',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      professionalsServiceAvailabilityCreate: {
        id: 'professionalsServiceAvailabilityCreate',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      professionalsServiceAvailabilityEdit: {
        id: 'professionalsServiceAvailabilityEdit',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      professionalsServiceAvailabilityDestroy: {
        id: 'professionalsServiceAvailabilityDestroy',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
        allowedStorage: [

        ],
      },
      professionalsServiceAvailabilityRead: {
        id: 'professionalsServiceAvailabilityRead',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },
      professionalsServiceAvailabilityAutocomplete: {
        id: 'professionalsServiceAvailabilityAutocomplete',
        allowedRoles: [roles.aipettoAdmin],
        allowedPlans: [plans.free, plans.growth, plans.premium],
      },      
    };
  }

  static get asArray() {
    return Object.keys(this.values).map((value) => {
      return this.values[value];
    });
  }
}

export default Permissions;
