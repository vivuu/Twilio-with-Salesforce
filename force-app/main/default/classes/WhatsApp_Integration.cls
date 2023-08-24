public class WhatsApp_Integration {
    public static void sendMessage(String conContact , String message){
        //Template Send
        //String messageBody = '{ \"messaging_product\": \"whatsapp\", \"to\": \"919784507472\", \"type\": \"template\", \"template\": { \"name\": \"hello_world\", \"language\": { \"code\": \"en_US\" } } }';
        
        //Text Send
        //String messageBody = '{ \"messaging_product\": \"whatsapp\", \"to\": \"919784507472\", \"recipient_type\": \"individual\", \"type\": \"text\", \"text\": { \"body\": \"Hello Vikas\" } }';
        String messageBody = '{'+
		'    "messaging_product": "whatsapp",'+
		'    "recipient_type": "individual",'+
		'    "to": "'+conContact+'",'+
		'    "type": "text",'+
		'    "text": {'+
		'        "preview_url": false,'+
		'        "body": "'+message+'"'+
		'    }'+
		'}';
        
        
        HTTP hMeet = new HTTP();
        HTTPRequest reqMeet = new HTTPRequest();
        //reqMeet.setEndpoint('callout:Zoom_api/v2/users/me/meetings');
        reqMeet.setEndpoint('https://graph.facebook.com/v17.0/102859216240538/messages');
        reqMeet.setMethod('POST');
        reqMeet.setHeader('Authorization','Bearer EABbKOo6y5uwBOze4IYo4ymZACzO0si1GcRRZBLpAzBPZC4qCHCvy88egrrDt0u8LmaWxoHElhH4rFt63UnZAw7sOo8YrjBoVHZCsW2xG36sn8iLLmNEpz9TdMvIuRI6AgfZCH3MmNKpm8SAoiaBumcMVDkoQVLIPDqqjwJZCZAYbjdpZCUcGR7YRr38lAlU6sR954oL8IxXFzhZC64AV445JB33Hy7L4zjAONLC6gZD');
        reqMeet.setHeader('Accept', 'application/json');
        reqMeet.setHeader('Content-Type', 'application/json');        
        reqMeet.setBody(messageBody);
        HTTPResponse resMeet = hMeet.send(reqMeet);
        Map<String, object> jsonBody =(Map<String, object>)JSON.deserializeUntyped(resMeet.getBody());
        //Map<String, object> accJson =(Map<String, object>)(jsonBody.get('Account'));
        //String JoinUrl = (String)jsonBody.get('join_url');
        System.debug('Response : '+jsonBody.toString());
        DebugLog__c log = new DebugLog__c();
        log.Response__c	= jsonBody.toString();
        //Insert log;
	}
    @AuraEnabled(cacheable=true)
    public static String getMessages(String recordId){
        if(recordId == null){
            return 'NULL';
        }
        List<WhatsApp_Message__c> allMessages = [Select Id, Message__c, isSent__c, User__c, Contact__c, CreatedById, CreatedDate From WhatsApp_Message__c Where Contact__c =: recordId ORDER BY CreatedDate ASC ];
        String allMessageJsonString = JSON.serialize(allMessages);
        if(allMessages.size() > 0){
            return allMessageJsonString;
        }
        else{
            return 'EMPTY';
        }
    }

    @AuraEnabled()
    public static String saveMessage(String recordId, String message){
        if(recordId != null && message != null){
            List<Contact> con = [Select Id, Phone From Contact Where Id =: recordId LIMIT 1];
            if(con.size() > 0){
               sendMessage(con[0].Phone , message);
            }
            WhatsApp_Message__c msg = new WhatsApp_Message__c();
            msg.Contact__c = recordId;
            msg.User__c = userInfo.getUserId();
            msg.Message__c = message;
            msg.isSent__c = true;
            insert msg;
            return 'Inserted';
        }
        else{
            return 'Not Inserted';
        }
    }
}