trigger WhatsApp_Message_Trigger on WhatsApp_Message__c (after insert) {
    if(Trigger.isAfter && Trigger.isInsert){
        WhatsApp_Message_Trigger_Handler.refreshLwcComponent(Trigger.new);
    }
}