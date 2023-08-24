import { LightningElement } from 'lwc';
import { publish, subscribe, unsubscribe, createMessageContext, releaseMessageContext } from 'lightning/messageService';

export default class CarWash_footer extends LightningElement {
    context = createMessageContext();
    subscription = null;

    facebook_logo = `/WebsiteGeneralFiles/Facebook.svg`;
    insta_logo= `/WebsiteGeneralFiles/Instagram.svg`;
    twitter_logo = `/WebsiteGeneralFiles/Twitter.svg`;

    get currentYear(){
        let date = new Date();

        return date.getFullYear();
    }
    navigateToGuestPass() {
        console.log('OUTPUT : ');
        let message = {
            isGuest : true
        };
        publish(this.context, SENDDATA, message);
    }
}