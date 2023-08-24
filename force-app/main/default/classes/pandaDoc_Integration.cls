public without sharing class pandaDoc_Integration {
    @AuraEnabled(cacheable=true)
    public static String getAllTemplates(){
        HTTP hMeet = new HTTP();
        HTTPRequest reqMeet = new HTTPRequest();
        //reqMeet.setEndpoint('callout:Zoom_api/v2/users/me/meetings');
        //reqMeet.setEndpoint('https://api.pandadoc.com/public/v1/documents');
        reqMeet.setEndpoint('https://api.pandadoc.com/public/v1/templates');
        reqMeet.setMethod('GET');   
        reqMeet.setHeader('Authorization','API-Key 275549fec8af066e88183cd2b8d4ec9056be0f7d');
        //reqMeet.setHeader('Authorization','Bearer EABbKOo6y5uwBOze4IYo4ymZACzO0si1GcRRZBLpAzBPZC4qCHCvy88egrrDt0u8LmaWxoHElhH4rFt63UnZAw7sOo8YrjBoVHZCsW2xG36sn8iLLmNEpz9TdMvIuRI6AgfZCH3MmNKpm8SAoiaBumcMVDkoQVLIPDqqjwJZCZAYbjdpZCUcGR7YRr38lAlU6sR954oL8IxXFzhZC64AV445JB33Hy7L4zjAONLC6gZD');
        reqMeet.setHeader('Accept', 'application/json');
        reqMeet.setHeader('Content-Type', 'application/json');        
        //reqMeet.setBody();
        HTTPResponse resMeet = hMeet.send(reqMeet);
        Map<String, object> jsonBody =(Map<String, object>)JSON.deserializeUntyped(resMeet.getBody());
        //Map<String, object> accJson =(Map<String, object>)(jsonBody.get('Account'));
        //String JoinUrl = (String)jsonBody.get('join_url');
        System.debug('Response : '+jsonBody.toString());
        String jsonString = JSON.serialize(jsonBody);
        return jsonString;
    }
}