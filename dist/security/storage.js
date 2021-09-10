"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Storage permissions.
 *
 * @id - Used to identify the rule on permissions and upload.
 * @folder - Folder where the files will be saved
 * @maxSizeInBytes - Max allowed size in bytes
 * @bypassWritingPermissions - Does not validate if the user has permission to write
 * @publicRead - The file can be publicly accessed via the URL without the need for a signed token
 */
class Storage {
    static get values() {
        return {
            userAvatarsProfiles: {
                id: 'userAvatarsProfiles',
                folder: 'user/avatars/profile/:userId',
                maxSizeInBytes: 10 * 1024 * 1024,
                bypassWritingPermissions: true,
                publicRead: true,
            },
            settingsLogos: {
                id: 'settingsLogos',
                folder: 'tenant/:tenantId/settings/logos',
                maxSizeInBytes: 10 * 1024 * 1024,
                publicRead: true,
            },
            settingsBackgroundImages: {
                id: 'settingsBackgroundImages',
                folder: 'tenant/:tenantId/settings/backgroundImages',
                maxSizeInBytes: 10 * 1024 * 1024,
                publicRead: true,
            },
            customerCustomerProfileImage: {
                id: 'customerCustomerProfileImage',
                folder: 'tenant/:tenantId/customer/customerProfileImage',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            productPhotos: {
                id: 'productPhotos',
                folder: 'tenant/:tenantId/product/photos',
                maxSizeInBytes: 1000000,
            },
            orderAttachments: {
                id: 'orderAttachments',
                folder: 'tenant/:tenantId/order/attachments',
                maxSizeInBytes: 1000000,
            },
            petProfileImage: {
                id: 'petProfileImage',
                folder: 'tenant/:tenantId/pet/profileImage',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            breedImage: {
                id: 'breedImage',
                folder: 'tenant/:tenantId/breed/image',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            petTypesImage: {
                id: 'petTypesImage',
                folder: 'tenant/:tenantId/petTypes/image',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            businessBusinessLogo: {
                id: 'businessBusinessLogo',
                folder: 'tenant/:tenantId/business/businessLogo',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            placePhotoLogo: {
                id: 'placePhotoLogo',
                folder: 'tenant/:tenantId/place/photoLogo',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            placePhotoStore: {
                id: 'placePhotoStore',
                folder: 'tenant/:tenantId/place/photoStore',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            businessServicesTypesServiceImage: {
                id: 'businessServicesTypesServiceImage',
                folder: 'tenant/:tenantId/businessServicesTypes/serviceImage',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            serviceReservationDigitalReservationDoc: {
                id: 'serviceReservationDigitalReservationDoc',
                folder: 'tenant/:tenantId/serviceReservation/digitalReservationDoc',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            businessCategoryCategoryImage: {
                id: 'businessCategoryCategoryImage',
                folder: 'tenant/:tenantId/businessCategory/categoryImage',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            providersProfileImage: {
                id: 'providersProfileImage',
                folder: 'tenant/:tenantId/providers/profileImage',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            providersAttachedDoc: {
                id: 'providersAttachedDoc',
                folder: 'tenant/:tenantId/providers/attachedDoc',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            placeTypePlaceTypeImage: {
                id: 'placeTypePlaceTypeImage',
                folder: 'tenant/:tenantId/placeType/placeTypeImage',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            petPhotosPhoto: {
                id: 'petPhotosPhoto',
                folder: 'tenant/:tenantId/petPhotos/photo',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            postsPostHeaderImage: {
                id: 'postsPostHeaderImage',
                folder: 'tenant/:tenantId/posts/postHeaderImage',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            postsPostDocRelated: {
                id: 'postsPostDocRelated',
                folder: 'tenant/:tenantId/posts/postDocRelated',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            dealsDigitalContracts: {
                id: 'dealsDigitalContracts',
                folder: 'tenant/:tenantId/deals/digitalContracts',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            petExaminationExaminationsFiles: {
                id: 'petExaminationExaminationsFiles',
                folder: 'tenant/:tenantId/petExamination/examinationsFiles',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            petExaminationExaminationImages: {
                id: 'petExaminationExaminationImages',
                folder: 'tenant/:tenantId/petExamination/examinationImages',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
            contactsContactProfilePhoto: {
                id: 'contactsContactProfilePhoto',
                folder: 'tenant/:tenantId/contacts/contactProfilePhoto',
                maxSizeInBytes: 100 * 1024 * 1024,
            },
        };
    }
}
exports.default = Storage;
//# sourceMappingURL=storage.js.map