import {getConfig} from "../config";
import axios from "axios";

export default class ActiveCampaign {

    async addContactProspect(contact){

        try {
            const nameSplitted = contact.contactName.split(' ');

            // GET getConfig().ACTIVE_CAMPAIGN_API_URL + /fields to check fieldValues IDs
            // TODO create an enum with ids and fields
            const body =  {
                    "contact": {
                        "email": contact.contactEmail,
                            "firstName": nameSplitted[0],
                            "lastName": nameSplitted[1],
                            "phone": contact.contactPhone,
                            "fieldValues":[
                            {
                                "field":"4",
                                "value": contact.allowReceiveNotifications
                            },
                            {
                                "field":"2",
                                "value":contact.nameBusiness
                            }
                        ]
                    }
                };
            const contactResponse = await axios.post(getConfig().ACTIVE_CAMPAIGN_API_URL + '/contacts', body,
                { headers: {'Api-Token': getConfig().ACTIVE_CAMPAIGN_DEVELOPER_TOKEN}}
             ).then( resp => {
                this.addContactForList(resp.data.contact.id, 2);
            })
        }catch (error){
            console.log(error.response.data);
        }
    }

    async addContactProfessional(contact){

        try {
            const nameSplitted = contact.contactName.split(' ');

            const body =  {
                "contact": {
                    "email": contact.contactEmail,
                    "firstName": nameSplitted[0],
                    "lastName": nameSplitted[1],
                    "phone": contact.contactPhone,
                    "fieldValues":[
                        {
                            "field":"4",
                            "value": contact.allowReceiveNotifications
                        },
                        {
                            "field":"6",
                            "value":contact.nameBusiness
                        }
                    ]
                }
            };
            const contactResponse = await axios.post(getConfig().ACTIVE_CAMPAIGN_API_URL + '/contacts', body,
                { headers: {'Api-Token': getConfig().ACTIVE_CAMPAIGN_DEVELOPER_TOKEN}}
            ).then( resp => {
                this.addContactForList(resp.data.contact.id, 8);
            })

        }catch (error){
            throw error;
        }
    }

    async addContactForList(contactId, listId){

        try {
            const body =  {
                "contactList": {
                "list": listId,
                    "contact": contactId,
                    "status": 1
                }
            };
            await axios.post(getConfig().ACTIVE_CAMPAIGN_API_URL + '/contactLists', body,
                { headers: {'Api-Token': getConfig().ACTIVE_CAMPAIGN_DEVELOPER_TOKEN}}
            );
        }catch (error){
            throw error;
        }
    }

    async addContactAutomations(contactId, automationId){

        try {
            console.log(contactId);
            console.log(automationId);
            if (ActiveCampaign.isDeveloperTokenConfigured){
            try {
                const body =  {
                    "contactAutomation": {
                        "contact": contactId,
                        "automation": automationId,
                    }
                };
                await axios.post(getConfig().ACTIVE_CAMPAIGN_API_URL + '/contactAutomations', body,
                    { headers: {'Api-Token': getConfig().ACTIVE_CAMPAIGN_DEVELOPER_TOKEN}}
                );
            }catch (error){
                throw error;
            }
         }
        }catch (error){
            throw error;
        }
    }

    static get isDeveloperTokenConfigured(){
        return Boolean(getConfig().ACTIVE_CAMPAIGN_DEVELOPER_TOKEN)
    }
}