/**
 * I18n dictionary for the en.
 */

const en = {
  app: {
    title: 'AIPETTO',
  },

  auth: {
    userNotFound: `Sorry, we don't recognize your credentials`,
    wrongPassword: `Sorry, we don't recognize your credentials`,
    weakPassword: 'This password is too weak',
    emailAlreadyInUse: 'Email is already in use',
    invalidEmail: 'Please provide a valid email',
    passwordReset: {
      invalidToken:
        'Password reset link is invalid or has expired',
      error: `Email not recognized`,
    },
    emailAddressVerificationEmail: {
      invalidToken:
        'Email verification link is invalid or has expired.',
      error: `Email not recognized.`,
      signedInAsWrongUser: `This email confirmation was sent to {0} but you're signed in as {1}.`,
    },
    passwordChange: {
      invalidPassword: 'The old password is invalid',
    },
  },

  user: {
    errors: {
      userAlreadyExists:
        'User with this email already exists.',
      userNotFound: 'User not found.',
      destroyingHimself: `You can't delete yourself.`,
      revokingOwnPermission: `You can't revoke your own admin permission.`,
      revokingPlanUser: `You can't revoke the admin permission of the plan manager.`,
      destroyingPlanUser: `You can't delete the plan manager.`,
    },
  },

  tenant: {
    exists:
      'There is already a workspace on this application.',
    url: {
      exists: 'This workspace URL is already in use.',
    },
    invitation: {
      notSameEmail: `This invitation was sent to {0} but you're signed in as {1}.`,
    },
    planActive: `There is a plan active for this workspace. Please cancel the plan first.`,
    stripeNotConfigured: 'Stripe is not configured.',
  },

  importer: {
    errors: {
      invalidFileEmpty: 'The file is empty',
      invalidFileExcel:
        'Only excel (.xlsx) files are allowed',
      invalidFileUpload:
        'Invalid file. Make sure you are using the last version of the template.',
      importHashRequired: 'Import hash is required',
      importHashExistent: 'Data has already been imported',
    },
  },

  errors: {
    notFound: {
      message: 'Not Found',
    },
    forbidden: {
      message: 'Forbidden',
    },
    validation: {
      message: 'An error occurred',
    },
  },

  email: {
    error: `Email provider is not configured.`,
  },

  preview: {
    error:
      'Sorry, this operation is not allowed in preview mode.',
  },

  entities: {
    customer: {
      errors: {
        unique: {

        }
      }
    },
    product: {
      errors: {
        unique: {

        }
      }
    },
    order: {
      errors: {
        unique: {

        }
      }
    },
    pet: {
      errors: {
        unique: {

        }
      }
    },
    breed: {
      errors: {
        unique: {

        }
      }
    },
    petTypes: {
      errors: {
        unique: {

        }
      }
    },
    business: {
      errors: {
        unique: {
          businessID: 'BusinessID must be unique',
        }
      }
    },
    place: {
      errors: {
        unique: {

        }
      }
    },
    businessServicesTypes: {
      errors: {
        unique: {

        }
      }
    },
    serviceReservation: {
      errors: {
        unique: {

        }
      }
    },
    businessPlaceServiceAvailability: {
      errors: {
        unique: {

        }
      }
    },
    country: {
      errors: {
        unique: {

        }
      }
    },
    city: {
      errors: {
        unique: {

        }
      }
    },
    state: {
      errors: {
        unique: {

        }
      }
    },
    messages: {
      errors: {
        unique: {

        }
      }
    },
    professionalsServiceAvailability: {
      errors: {
        unique: {

        }
      }
    },
    languages: {
      errors: {
        unique: {

        }
      }
    },
    currency: {
      errors: {
        unique: {

        }
      }
    },
    discounts: {
      errors: {
        unique: {
          codeName: 'CodeName must be unique',
        }
      }
    },
    wallet: {
      errors: {
        unique: {

        }
      }
    },
    businessCategory: {
      errors: {
        unique: {

        }
      }
    },
    providers: {
      errors: {
        unique: {
          providerID: 'ProviderID must be unique',
        }
      }
    },
    vaccineTypes: {
      errors: {
        unique: {

        }
      }
    },
    petVaccines: {
      errors: {
        unique: {
          uniqueVetVaccineCode: 'UniqueVetVaccineCode must be unique',
        }
      }
    },
    placeType: {
      errors: {
        unique: {

        }
      }
    },
    landingSurvey: {
      errors: {
        unique: {

        }
      }
    },
    newBusinessSurvey: {
      errors: {
        unique: {

        }
      }
    },
    petPhotos: {
      errors: {
        unique: {

        }
      }
    },
    petDiseases: {
      errors: {
        unique: {

        }
      }
    },
    businessServicesPrices: {
      errors: {
        unique: {

        }
      }
    },
    posts: {
      errors: {
        unique: {

        }
      }
    },
    postCategories: {
      errors: {
        unique: {
          name: 'Name must be unique',
        }
      }
    },
    postComments: {
      errors: {
        unique: {

        }
      }
    },
    pointsChallenges: {
      errors: {
        unique: {
          name: 'Name must be unique',
        }
      }
    },
    challengesCategories: {
      errors: {
        unique: {
          name: 'Name must be unique',
        }
      }
    },
    productCategory: {
      errors: {
        unique: {
          name: 'Name must be unique',
        }
      }
    },
  }
};

export default en;
