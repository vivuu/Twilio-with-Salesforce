import { LightningElement , track, wire, api } from 'lwc';
import getAllTemplates from '@salesforce/apex/pandaDoc_Integration.getAllTemplates';
export default class PandaDoc_Document extends LightningElement {
    allTemplateArray = [];
    mapData;
    @wire(getAllTemplates)
    wiredData({ error, data }) {
      if (data) {
        console.log('Parse Data', JSON.parse(data));
        console.log('String Data', data);
        try {
            const response = JSON.parse(data);
            if (response.results && Array.isArray(response.results)) {
                this.allTemplateArray = response.results;
                this.mapData = new Map();
                this.allTemplateArray.forEach(temp => {
                    this.mapData.set(temp.name, temp.id);
                });
            }
        } catch (error) {
            console.error('Error parsing JSON response:', error);
        }
      } else if (error) {
        console.error('Error:', error);
      }
    }
    @track options;
    @track selectedOption;
    @track isAttributeRequired = false;
    @track docUrl;
    @track isTempSelected = false;

    async selectionChangeHandler(event) {
        this.selectedOption = event.target.value;
        console.log('selectedOption : ',this.selectedOption);
        if(this.selectedOption != '--Select Template--'){
          var templateId = this.mapData.get(this.selectedOption);
          console.log('templateId : ',templateId);
          const apiKey = '275549fec8af066e88183cd2b8d4ec9056be0f7d';


          var documentId = await this.createDocumentUsingTemplate(templateId, apiKey); //creating Document and return document id
          console.log('documentId : ',documentId);
          
          if(documentId != 'NULL'){
            var documentStatus = await this.changeDocumentStatus(documentId, apiKey); //change Document status and return success string
            console.log('documentStatus : ',documentStatus);
            if(documentStatus != 'NULL'){
              try{
                var sendResponse = await this.sendDocument(documentId, apiKey); //change Document status and return success string
                console.log('sendResponse : ',JSON.stringify(sendResponse));
                this.isTempSelected = true;
                console.log('shared_link : ',sendResponse.recipients[0].shared_link);
                this.docUrl = sendResponse.recipients[0].shared_link;
                //this.docUrl = "https://app.pandadoc.com/document/fa2757259bca25e70d46a84867d98b895187dfe3";
                console.log('response from doc url : ',this.docUrl); 
              } 
              catch(erorr){
                console.log('error : ',error);
              }
            }
          }
        }
        if(this.selectedOption == '--Select Template--'){
          this.isTempSelected = false;
        }
    }

    async createDocumentUsingTemplate(templateId, apiKey){
        try{
          var recipient_email = 'vikassingh@cyntexa.com';
          const apiUrl = 'https://api.pandadoc.com/public/v1/documents';
          const requestData = {
              "name": "Simple API Sample Document from PandaDoc Template 17",
              "template_uuid": templateId,  
              "recipients": [
                  {
                      "email": recipient_email,
                      "first_name": "Vikas",
                      "last_name": "Singh",
                      "role": "user"
                  }
              ],
              "tokens": [
                  {
                      "name": "Favorite.Pet",
                      "value": "Panda"
                  }
              ],
              "fields": {
                  "Favorite.Color": {
                      "value": "PandaDoc green"
                  },
                  "Delivery": {
                      "value": "Same Day Delivery"
                  },
                  "Like": {
                      "value": true
                  },
                  "Date": {
                      "value": "2019-12-31T00:00:00.000Z"
                  }
              },
              "metadata": {
                  "my_favorite_pet": "Panda"
              },
              "tags": [
                  "created_via_api",
                  "test_document"
              ],
              "pricing_tables": [
                  {
                      "name": "Pricing Table 1",
                      "data_merge":true,
                      "options": {
                          "Tax": {  
                              "is_global": true,
                              "type": "absolute",
                              "name": "Tax",
                              "value": 10
                          }
                      },
                      "sections": [
                          {
                              "title": "Sample Section",
                              "default": true,
                              "rows": [
                                  {
                                      "options": {
                                          "optional": true,
                                          "optional_selected": true,
                                          "qty_editable": true
                                      },
                                      "data": {
                                          "Name": "Toy Panda",
                                          "Description": "Fluffy!",
                                          "Price": 10,
                                          "QTY": 3,
                                          "Tax": {
                                              "value": 20,
                                              "type": "percent"
                                          }
                                      },
                                      "custom_fields": {
                                          "Fluffiness": "5 / 5"
                                      }
                                  }
                              ]
                          }
                      ]
                  }
              ]
          };
          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `API-Key ${apiKey}`
              },
              body : JSON.stringify(requestData)
          });

          const documentJson = await response.json();
          return documentJson.id;
        }
        catch (error) {
          console.error('Error:', error,error.getMessage());
          return 'NULL';
        }
    }

    async changeDocumentStatus(documentId, apiKey) {
        try {
            const apiUrl = `https://api.pandadoc.com/public/v1/documents/${documentId}`;

            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `API-Key ${apiKey}` // Correct format for the API key header
                }
            });

            console.log('Response 2 :', response);

            if (response.status === 204 || response.status === 200) {
                console.log('Document status updated successfully.');
                return 'SENT';
            } else {
                console.error('API Error:', response.statusText);
                return 'ERROR';
            }
        } catch (error) {
            console.error('Error:', error);
            return 'NULL';
        }
    }


    async sendDocument(documentId, apiKey) {
        try{
          const apiUrl = `https://api.pandadoc.com/public/v1/documents/${documentId}/send`;
        
          const requestData = {
            "message": "Hello! This document was sent from the PandaDoc API.",
            "silent": false
          }

          const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `API-Key ${apiKey}`
              },
              body: JSON.stringify(requestData)
          });

          const data = await response.json();
          console.log(data); // Response data from PandaDoc
          return data;
        }
        catch (error) {
          console.error('Error:', error,error.getMessage());
          return 'NULL';
        }
    }

    @track buttonStyle = 'slds-button_brand buttonContainer'; // Default style using a brand variant

    handleButtonClick() {
        this.buttonStyle = this.buttonStyle === 'slds-button_brand' ? 'slds-button_neutral' : 'slds-button_brand';
    }
    

}