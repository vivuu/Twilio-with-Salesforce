import { LightningElement,wire,api,track } from 'lwc';
import getMessages from '@salesforce/apex/WhatsApp_Integration.getMessages';
import saveMessage from '@salesforce/apex/WhatsApp_Integration.saveMessage';
// import refreshLwcComponent from '@salesforce/apex/WhatsApp_Message_Trigger_Handler.refreshLwcComponent';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import WhatsApp_Message from '@salesforce/messageChannel/WhatsApp_Message_Channel__c';
import {subscribe,unsubscribe,onError,setDebugFlag,isEmpEnabled,} from 'lightning/empApi';
import { MessageContext } from 'lightning/messageService';
import { refreshApex } from '@salesforce/apex';
export default class WhatsappMessenger1 extends LightningElement {
    @api recordId;
    @api WhatsApp_MessagePE__e;
    @api channelName='/event/WhatsApp_MessagePE__e';

    @wire(MessageContext)
    messageContext;
    subscription;

    connectedCallback() {
         this.handleSubscribe();
    }
     handleSubscribe() {
        // Callback invoked whenever a new event message is received
        const self = this;
        const messageCallback = (response) => {
            console.log('New message received 1: ', JSON.stringify(response));
            console.log('New message received 2: ', response);
            var obj = JSON.parse(JSON.stringify(response));
            console.log(obj.data.payload);
            console.log(obj.data.payload.Message__c);
            console.log(self.channelName);
            const objData = obj.data.payload;
            self.message = objData.Message__c;
            refreshApex(this.wiredAccountList);
        };
 
        // Invoke subscribe method of empApi. Pass reference to messageCallback
        subscribe(this.channelName, -1, messageCallback).then(response => {
            // Response contains the subscription information on subscribe call
            console.log('Subscription request sent to: ', JSON.stringify(response.channel));
            this.subscription = response;
        });
    }
    @track messageArray = [
        {
            "Id" : 1,
            "isSent" : true,
            "message" : "Hiee",
        },
        {
            "Id" : 2,
            "isSent" : false,
            "message" : "Hello",
        },
        {
            "Id" : 3,
            "isSent" : true,
            "message" : "How are you?",
        },
        {
            "Id" : 4,
            "isSent" : false,
            "message" : "I am good.. What about you?",
        },
        {
            "Id" : 5,
            "isSent" : true,
            "message" : "I am also fine",
        },
        {
            "Id" : 6,
            "isSent" : false,
            "message" : "Okay",
        }
    ];
    renderedCallback(){
        
        let mainContainer = this.template.querySelector('.mainContainer');
        mainContainer?.scrollTo(0, mainContainer.scrollHeight);
    }
    @track wiredAccountList;
    @wire(getMessages, { recordId: '$recordId' })
    wiredData(value) {
        this.wiredAccountList = value;
        const { error, data } = value;
      if (data) {
          if(data == 'NULL' || data == 'EMPTY'){
            console.log('Message Response', data);
          }else{
            console.log('Message Response', JSON.parse(data));
            this.messageArray = [];
            var messageObjArray = JSON.parse(data);
            messageObjArray.forEach(msgObj => {
                var isSent = (msgObj.isSent__c == true) ? true : false;
                var obj = {
                    'Id' : msgObj.Id,
                    'isSent' : isSent,
                    'message' : msgObj.Message__c
                }
                this.messageArray.push(obj);
               
            });
          }
      } else if (error) {
         console.error('Error:', error);
      }
    }
    showSuccessToast() {
        const evt = new ShowToastEvent({
            title: 'Message Sent',
            message: 'Message sent sucessful',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }
    showErrorToast() {
        const evt = new ShowToastEvent({
            title: 'Toast Error',
            message: 'Some unexpected error',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    ShowToast(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }

    SendMessageMethod(event){
        var isEnter = event.target.dataset.enter;
        if(isEnter == 'true' || (event.keyCode === 13)){
            var inputMessage = this.template.querySelector('.inputClass').value;
            console.log('input message : ',inputMessage);
            saveMessage({ recordId: this.recordId, message : inputMessage })
              .then(result => {
                console.log('Result', result);
                if(result == 'Inserted'){
                    this.showSuccessToast();
                    //eval("$A.get('e.force:refreshView').fire();");
                    refreshApex(this.wiredAccountList);

                }else if(result == 'Not Inserted'){
                    this.showErrorToast();
                }
              })
              .catch(error => {
                console.error('Error:', error);
            });
            this.template.querySelector('.inputClass').value = '';
        }    
    }
    
}