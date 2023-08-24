@RestResource(urlMapping='/getMessages/*')
global class WhatsApp_Wehbook_Handler
{
    //Yeh CODE GPT NE LIKHA HAI!!!
    private static Final String SIGNATURE_VALID_MESSAGE     = 'Signature Verified';
    private static Final String SIGNATURE_NOT_VALID_MESSAGE = 'Signature could not be verified';
    @HttpGet // GET
    global static void doGet() {
        RestResponse response = RestContext.response;
        RestRequest request = RestContext.request;
        if(request.params.get('hub.verify_token') == 'WHATSAPPTOKEN'){
            response.responseBody = Blob.valueOf( request.params.get('hub.challenge') );
        }
        DebugLog__c log = new DebugLog__c();
        log.Response__c	= request.requestBody.toString();
        Insert log;
        //return 'vikas';
    }
    
    @HttpPost // POST
    global static void doPost() {
        
        RestResponse response = RestContext.response;
        response.addHeader('Content-type','application/json');
        String responseString = RestContext.request.requestBody.toString();
        //Deserialize the JSON using the corrected wrapper class
        WhatsAppMessageWrapper wrapper = (WhatsAppMessageWrapper) JSON.deserialize(responseString, WhatsAppMessageWrapper.class);
        
        // Access the body value
        String messageRecieved = '';
        String msgFrom;
        String contactName = '';
        // Deserialize the JSON using a Map
        Map<String, Object> data = (Map<String, Object>) JSON.deserializeUntyped(responseString);
        
        // Access the name, from, and body values
        if (data.containsKey('entry')) {
            List<Object> entryList = (List<Object>) data.get('entry');
            if (!entryList.isEmpty()) {
                Map<String, Object> entry = (Map<String, Object>) entryList[0];
                List<Object> changesList = (List<Object>) entry.get('changes');
                if (!changesList.isEmpty()) {
                    Map<String, Object> change = (Map<String, Object>) changesList[0];
                    Map<String, Object> value = (Map<String, Object>) change.get('value');
                    List<Object> messagesList = (List<Object>) value.get('messages');
                    if (!messagesList.isEmpty()) {
                        Map<String, Object> message = (Map<String, Object>) messagesList[0];
                        msgFrom = (String) message.get('from');
                        contactName = (String) ((Map<String, Object>) ((List<Object>) value.get('contacts')).get(0)).get('profile.name');
                        messageRecieved = (String) ((Map<String, Object>) message.get('text')).get('body');
                        List<Contact> con = [Select Id, Phone From Contact Where Phone =: msgFrom LIMIT 1];
                        WhatsApp_Message__c msg = new WhatsApp_Message__c();
                        if(con.size() > 0){
                            msg.Contact__c = con[0].Id;
                            msg.Message__c = messageRecieved;
                        }else{
                            Contact newCon = new Contact();
                            newCon.LastName = contactName;
                            newCon.Phone = msgFrom;
                            Insert newCon;
                            
                            msg.Contact__c = newCon.Id;
                            msg.Message__c = messageRecieved;
                        }
                        Insert msg;
                    }
                }
            }
        }
        DebugLog__c log = new DebugLog__c();
        log.Response__c	= 'Message : ' + messageRecieved + ' Contact Name : '+contactName +' Contact No. : '+msgFrom;
        Insert log;
        Map<String, String> headers = RestContext.request.headers;
        String responseValid = validateWhatsAppSignature(RestContext.request, responseString);
        
        if(responseValid == SIGNATURE_VALID_MESSAGE){
            System.debug(System.LoggingLevel.DEBUG, ' Headers Response From WhatsApp \n  '+ JSON.serialize(headers) );
            System.debug(System.LoggingLevel.DEBUG, ' Response From WhatsApp \n  '+ responseString);
        }else{
            response.responseBody = Blob.valueOf('{success:false, event:"Unknown","message:"'+responseValid+'"}');
            response.statusCode = 401;
            return;
        }
        
        response.statusCode = 200;
        response.responseBody = Blob.valueOf('{success:true, event:"success"}');
    }
    
    private static String validateWhatsAppSignature(RestRequest request, String responseString) {
        // Validate Stripe signature Start 
        Map<String, String> headers = request.headers;
        
        String whatsAppSignature = headers.get('X-Hub-Signature-256');
        
        String whatsAppPayload = RestContext.request.requestBody.toString();
        
        // Verify the signature using 'hmacSHA256'. I have the Webhook key stored in a Custom Label
        //String whatsAppSecret = System.Label.WHATSAPPSECRET; // Facebook Application Secret Key
        String whatsAppSecret = '107aa3e8c09db8f4320b9f54bea33498'; // Facebook Application Secret Key
        Blob signedPayload = Crypto.generateMac('hmacSHA256', Blob.valueOf(whatsAppPayload), Blob.valueOf( whatsAppSecret ));
        
        String encodedPayload = 'sha256='+EncodingUtil.convertToHex(signedPayload);
        // Return status code based on whether signed payload matches or not
        
        String response = (encodedPayload == whatsAppSignature)? SIGNATURE_VALID_MESSAGE : SIGNATURE_NOT_VALID_MESSAGE;
        
        return response;
        // Validate Stripe signature End 
    }
}