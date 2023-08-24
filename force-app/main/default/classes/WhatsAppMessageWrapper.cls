public class WhatsAppMessageWrapper {
    public String objType;
    public List<WhatsAppEntry> entry;
    
    public class WhatsAppEntry {
        public String id;
        public List<WhatsAppChange> changes;
    }
    
    public class WhatsAppChange {
        public WhatsAppChangeValue value;
        public String field;
    }
    
    public class WhatsAppChangeValue {
        public String messaging_product;
        public WhatsAppMetadata metadata;
        public List<WhatsAppContact> contacts;
        public List<WhatsAppMessage> messages;
    }
    
    public class WhatsAppMetadata {
        public String display_phone_number;
        public String phone_number_id;
    }
    
    public class WhatsAppContact {
        public WhatsAppProfile profile;
        public String wa_id;
    }
    
    public class WhatsAppProfile {
        public String name;
    }
    
    public class WhatsAppMessage {
        @SerializedName('from')
        public String msgFrom;
        public String id;
        public String timestamp;
        public WhatsAppMessageText text;
        public String type;
    }
    
    public class WhatsAppMessageText {
        public String body;
    }
}