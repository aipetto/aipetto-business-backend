import {getConfig} from "../config";
import axios from "axios";

export default class ActiveCampaign {

    async addContactProspect(contact){

        try {
            console.log(contact);
            //return await axios.post(getConfig().ACTIVE_CAMPAIGN_API_URL + '/contacts');
            /**
             {
                    "contact": {
                        "email": "",
                        "firstName": "",
                        "lastName": "",
                        "phone": "",
                    "fieldValues":[
                      {
                        "field":"package_plan",
                        "value":"premium"
                      }
                    ]
                    }
                }

             */
        }catch (error){
            throw error;
        }
    }

    async addContactProfessional(contact){

        try {
            console.log(contact);
            //return await axios.post(getConfig().ACTIVE_CAMPAIGN_API_URL + '/contacts');
        }catch (error){
            throw error;
        }
    }

    async addContactForAList(contactId, listId){

        try {
            console.log(contactId);
            console.log(listId);
            //return await axios.post(getConfig().ACTIVE_CAMPAIGN_API_URL + '/contactLists');
            /**
             {
                "contactList": {
                    "list": 2,
                    "contact": 4,
                    "status": 1
                }
            }
            */
        }catch (error){
            throw error;
        }
    }

    async addContactAutomations(contactId, automationId){

        try {
            console.log(contactId);
            console.log(automationId);
            //return await axios.post(getConfig().ACTIVE_CAMPAIGN_API_URL + '/contactAutomations');
            /**
             {
                "contactAutomation": {
                    "contact": "3",
                    "automation": "42"
                }
            }
             */
        }catch (error){
            throw error;
        }
    }

    static get isDeveloperTokenConfigured(){
        return Boolean(getConfig().ACTIVE_CAMPAIGN_DEVELOPER_TOKEN)
    }
}