public class WhatsApp_Message_Trigger_Handler {
    public static void refreshLwcComponent(List<WhatsApp_Message__c> msgList){
        System.debug('msgList : '+msgList);
        for(WhatsApp_Message__c msg : msgList){
            if(msg.isSent__c == false){
                WhatsApp_MessagePE__e event = new WhatsApp_MessagePE__e();
                event.Message__c = 'Update';
                
                // Publish the event
                EventBus.publish(event);
            }
        }
    }
}