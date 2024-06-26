"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const es = {
    app: {
        title: 'aipetto',
    },
    auth: {
        userNotFound: 'Lo sentimos, no reconocemos tus credenciales',
        wrongPassword: 'Lo sentimos, no reconocemos tus credenciales',
        weakPassword: 'Esta contraseña es muy débil.',
        emailAlreadyInUse: 'Correo electrónico ya está en uso',
        invalidEmail: 'Por favor proporcione un correo electrónico válido',
        passwordReset: {
            invalidToken: 'El enlace de restablecimiento de contraseña no es válido o ha expirado',
            error: 'Correo electrónico no reconocido',
        },
        emailAddressVerificationEmail: {
            invalidToken: 'El enlace de verificación de correo electrónico no es válido o ha expirado.',
            error: 'Correo electrónico no reconocido',
            signedInAsWrongUser: 'Esta confirmación por correo electrónico se envió a {0} pero ha iniciado sesión como {1}.',
        },
        passwordChange: {
            invalidPassword: 'La contraseña anterior no es válida.',
        },
    },
    user: {
        errors: {
            userAlreadyExists: 'El usuario con este correo electrónico ya existe.',
            userNotFound: 'Usuario no encontrado.',
            destroyingHimself: 'No puedes eliminarte a ti mismo.',
            revokingOwnPermission: 'No puede revocar su propio permiso de administrador.',
            revokingPlanUser: 'No puede revocar el permiso de administrador del administrador del plan.',
            destroyingPlanUser: 'No puede eliminar el administrador del plan.',
        },
    },
    tenant: {
        exists: 'Ya hay un espacio de trabajo en esta aplicación.',
        url: {
            exists: 'Esta URL del espacio de trabajo ya está en uso.',
        },
        invitation: {
            notSameEmail: 'Esta invitación se envió a {0} pero has iniciado sesión como {1}.',
        },
        planActive: 'Hay un plan activo para este espacio de trabajo. Por favor, cancele el plan primero.',
        stripeNotConfigured: 'Stripe no está configurado.',
    },
    importer: {
        errors: {
            invalidFileEmpty: 'El archivo esta vacio',
            invalidFileExcel: 'Solo se permiten archivos de Excel(.xlsx)',
            invalidFileUpload: 'Archivo inválido. Asegúrese de estar utilizando la última versión de la plantilla.',
            importHashRequired: 'Se requiere hash de importación',
            importHashExistent: 'Los datos ya han sido importados',
        },
    },
    errors: {
        notFound: {
            message: 'Extraviado',
        },
        forbidden: {
            message: 'Prohibido',
        },
        validation: {
            message: 'Ocurrió un error',
        },
    },
    email: {
        error: 'El proveedor de correo electrónico no está configurado.',
    },
    preview: {
        error: 'Lo sentimos, esta operación no está permitida en el modo de vista previa.',
    },
    entities: {
        customer: {
            errors: {
                unique: {
                    uniqueCustomIdentifier: 'UniqueCustomIdentifier debe ser único',
                }
            }
        },
        product: {
            errors: {
                unique: {}
            }
        },
        order: {
            errors: {
                unique: {}
            }
        },
        pet: {
            errors: {
                unique: {
                    governmentUniqueID: 'GovernmentUniqueID debe ser único',
                }
            }
        },
        breed: {
            errors: {
                unique: {}
            }
        },
        petTypes: {
            errors: {
                unique: {}
            }
        },
        business: {
            errors: {
                unique: {
                    businessID: 'BusinessID debe ser único',
                }
            }
        },
        place: {
            errors: {
                unique: {}
            }
        },
        businessServicesTypes: {
            errors: {
                unique: {}
            }
        },
        serviceReservation: {
            errors: {
                unique: {}
            }
        },
        businessPlaceServiceAvailability: {
            errors: {
                unique: {}
            }
        },
        country: {
            errors: {
                unique: {}
            }
        },
        city: {
            errors: {
                unique: {}
            }
        },
        state: {
            errors: {
                unique: {}
            }
        },
        messages: {
            errors: {
                unique: {}
            }
        },
        professionalsServiceAvailability: {
            errors: {
                unique: {}
            }
        },
        languages: {
            errors: {
                unique: {}
            }
        },
        currency: {
            errors: {
                unique: {}
            }
        },
        discounts: {
            errors: {
                unique: {
                    codeName: 'CodeName debe ser único',
                }
            }
        },
        wallet: {
            errors: {
                unique: {}
            }
        },
        businessCategory: {
            errors: {
                unique: {}
            }
        },
        providers: {
            errors: {
                unique: {
                    providerID: 'ProviderID debe ser único',
                }
            }
        },
        vaccineTypes: {
            errors: {
                unique: {
                    vaccineCustomUniqueID: 'VaccineCustomUniqueID debe ser único',
                }
            }
        },
        petVaccines: {
            errors: {
                unique: {
                    uniqueVetVaccineCode: 'UniqueVetVaccineCode debe ser único',
                }
            }
        },
        placeType: {
            errors: {
                unique: {}
            }
        },
        landingSurvey: {
            errors: {
                unique: {}
            }
        },
        newBusinessSurvey: {
            errors: {
                unique: {}
            }
        },
        petPhotos: {
            errors: {
                unique: {}
            }
        },
        petDiseases: {
            errors: {
                unique: {}
            }
        },
        businessServicesPrices: {
            errors: {
                unique: {}
            }
        },
        posts: {
            errors: {
                unique: {}
            }
        },
        postCategories: {
            errors: {
                unique: {
                    name: 'Name debe ser único',
                }
            }
        },
        postComments: {
            errors: {
                unique: {}
            }
        },
        pointsChallenges: {
            errors: {
                unique: {
                    name: 'Name debe ser único',
                }
            }
        },
        challengesCategories: {
            errors: {
                unique: {
                    name: 'Name debe ser único',
                }
            }
        },
        productCategory: {
            errors: {
                unique: {
                    name: 'Name debe ser único',
                }
            }
        },
        deals: {
            errors: {
                unique: {}
            }
        },
        businessPaymentCycle: {
            errors: {
                unique: {}
            }
        },
        questions: {
            errors: {
                unique: {}
            }
        },
        answers: {
            errors: {
                unique: {}
            }
        },
        petExamination: {
            errors: {
                unique: {}
            }
        },
        contacts: {
            errors: {
                unique: {}
            }
        },
    }
};
exports.default = es;
//# sourceMappingURL=es.js.map