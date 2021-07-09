/**
 * Storage permissions.
 *
 * @id - Used to identify the rule on permissions and upload.
 * @folder - Folder where the files will be saved
 * @maxSizeInBytes - Max allowed size in bytes
 * @bypassWritingPermissions - Does not validate if the user has permission to write
 * @publicRead - The file can be publicly accessed via the URL without the need for a signed token
 */
export default class Storage {
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
        folder:
          'tenant/:tenantId/settings/backgroundImages',
        maxSizeInBytes: 10 * 1024 * 1024,
        publicRead: true,
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





      businessServicesTypesServiceImage: {
        id: 'businessServicesTypesServiceImage',
        folder: 'tenant/:tenantId/businessServicesTypes/serviceImage',
        maxSizeInBytes: 100 * 1024 * 1024,
      },























      businessCategoryCategoryImage: {
        id: 'businessCategoryCategoryImage',
        folder: 'tenant/:tenantId/businessCategory/categoryImage',
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










    };
  }
}
