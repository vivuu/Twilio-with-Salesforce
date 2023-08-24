public class Twilio_Integration {
    public static void initiateConferenceCall(String participant1, String participant2) {
        String accountSid = 'AC79dfcc2c8ca06054433c14520a7207ea';
        String authToken = '1d049cbd758f8c9a077ca75ac9ac3cf9';
        
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://api.twilio.com/2010-04-01/Accounts/' + accountSid + '/Calls.json');
        req.setMethod('POST');
        req.setHeader('Authorization', 'Basic ' + EncodingUtil.base64Encode(Blob.valueOf(accountSid + ':' + authToken)));
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        req.setBody('To=' + EncodingUtil.urlEncode(participant1, 'UTF-8')
                    + '&From=(470) 688-5257'
                    + '&Url=https://vsamsgamingtech-dev-ed.develop.my.site.com/apex/TwiMLMakeCall');
        Http http = new Http();
        HttpResponse res = http.send(req);
        System.debug('response'+res.toString());
        // You can handle the response here and add the second participant to the conference
    }
}