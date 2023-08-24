public without sharing class carWash_Controller {
    @AuraEnabled()
    public static String getAllLocations(String place){
        List<CustomerSupportOutlet__c> OutletLocationList = [Select Id, Outlet_Address__c, Outlet_Latitude__c, Outlet_Longitude__c From CustomerSupportOutlet__c];
        String OutletLocationListString = JSON.serialize(OutletLocationList);
        if(OutletLocationList.size() > 0){
            return OutletLocationListString;
        }
        else{
            return 'EMPTY';
        }
    }
}