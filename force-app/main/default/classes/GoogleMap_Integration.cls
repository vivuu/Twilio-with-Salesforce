public class GoogleMap_Integration {
    public static void sendMessage(String conContact , String message){
        String messageBody = '';
      
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

}