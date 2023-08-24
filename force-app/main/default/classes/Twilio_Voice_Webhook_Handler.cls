@RestResource(urlMapping='/getCalls/*')
global class Twilio_Voice_Webhook_Handler
{
    private static Final String SIGNATURE_VALID_MESSAGE     = 'Signature Verified';
    private static Final String SIGNATURE_NOT_VALID_MESSAGE = 'Signature could not be verified';
    
    @HttpGet // GET
    global static String doGet() {
        RestResponse response = RestContext.response;
        RestRequest request = RestContext.request;
        if(request.params.get('hub.verify_token') == 'WHATSAPPTOKEN'){
            response.responseBody = Blob.valueOf( request.params.get('hub.challenge') );
        }
        DebugLog__c log = new DebugLog__c();
        log.Response__c	= request.requestBody.toString();
        Insert log;
        return 'vikas';
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
        
        
        DebugLog__c log = new DebugLog__c();
        log.Response__c	= data.toString();
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