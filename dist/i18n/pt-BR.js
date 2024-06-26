"use strict";
/**
 * I18n dictionary for the en.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const ptBR = {
    app: {
        title: 'aipetto',
    },
    auth: {
        userNotFound: `Desculpe, não reconhecemos suas credenciais`,
        wrongPassword: `Desculpe, não reconhecemos suas credenciais`,
        weakPassword: 'Esta senha é muito fraca',
        emailAlreadyInUse: 'O email já está sendo usado',
        invalidEmail: 'Por favor forneça um email válido',
        passwordReset: {
            invalidToken: 'Link de redefinição de senha inválido ou expirado',
            error: `Email não encontrado`,
        },
        emailAddressVerificationEmail: {
            invalidToken: 'Link de verificação de email inválido ou expirado.',
            error: `Email não encontrado.`,
            signedInAsWrongUser: `Esta confirmação de email foi enviada para {0} mas você está acessando como {1}.`,
        },
        passwordChange: {
            invalidPassword: 'A senha antiga é inválida',
        },
    },
    user: {
        errors: {
            userAlreadyExists: 'Usuário com este email já existe',
            userNotFound: 'Usuário não encontrado',
            destroyingHimself: `Você não pode deletar-se`,
            revokingOwnPermission: `Você não pode revogar sua própria permissão de proprietário`,
            revokingPlanUser: `Você não pode revogar a permissão do responsável pelo plano ativo`,
            destroyingPlanUser: `Você não pode deletar o responsável pelo plano ativo`,
        },
    },
    tenant: {
        exists: 'Já existe um inquilino para esta aplicação.',
        url: {
            exists: 'Esta URL de área de trabalho já está em uso.',
        },
        invitation: {
            notSameEmail: `Este convite foi enviado para {0} mas você está acessando como {1}.`,
        },
        planActive: `Existe um plano ativo para esta área de trabalho. Por favor primeiro cancele o plano.`,
    },
    importer: {
        errors: {
            invalidFileEmpty: 'O arquivo está vazio',
            invalidFileExcel: 'Apenas arquivos Excel (.xlsx) são permitidos',
            invalidFileUpload: 'Arquivo inválido. Verifique se você está usando a última versão do modelo.',
            importHashRequired: 'Hash de importação é necessário',
            importHashExistent: 'Dados já foram importados',
        },
    },
    errors: {
        notFound: {
            message: 'Não encontrado',
        },
        forbidden: {
            message: 'Não permitido',
        },
        validation: {
            message: 'Ocorreu um erro',
        },
    },
    email: {
        error: `Email não configurado.`,
    },
    preview: {
        error: 'Desculpe, esta operação não é permitida em modo de demonstração.',
    },
    entities: {
        customer: {
            errors: {
                unique: {
                    uniqueCustomIdentifier: 'UniqueCustomIdentifier deve ser único',
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
                    governmentUniqueID: 'GovernmentUniqueID deve ser único',
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
                    businessID: 'BusinessID deve ser único',
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
                    codeName: 'CodeName deve ser único',
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
                    providerID: 'ProviderID deve ser único',
                }
            }
        },
        vaccineTypes: {
            errors: {
                unique: {
                    vaccineCustomUniqueID: 'VaccineCustomUniqueID deve ser único',
                }
            }
        },
        petVaccines: {
            errors: {
                unique: {
                    uniqueVetVaccineCode: 'UniqueVetVaccineCode deve ser único',
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
                    name: 'Name deve ser único',
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
                    name: 'Name deve ser único',
                }
            }
        },
        challengesCategories: {
            errors: {
                unique: {
                    name: 'Name deve ser único',
                }
            }
        },
        productCategory: {
            errors: {
                unique: {
                    name: 'Name deve ser único',
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
exports.default = ptBR;
//# sourceMappingURL=pt-BR.js.map