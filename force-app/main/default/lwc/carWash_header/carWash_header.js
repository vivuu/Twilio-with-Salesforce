import { LightningElement, track, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

// import HeaderLogo from '@salesforce/resourceUrl/HeaderLogo';
// import imageResoure from '@salesforce/resourceUrl/WebsiteGenFaqImage';
// import imageResoure from '@salesforce/resourceUrl/WebsiteGeneralHeader';


export default class CarWash_header extends LightningElement {

    // Header_logo = HeaderLogo;
    Header_logo = '/PFNCA_PrimaryLogo_Color_tm_RGB_150dpi-1@2x.png';

    img_Home =  '/Home.svg';
    img_Browse_Classes =  '/Browse_Classes.svg';
    img_How_to_Participate =  '/How_to_Participate.svg';
    img_FAQs =  '/FAQs.svg';
    img_Blog =  '/Blog.svg';
    img_About =  '/About@2x.png';
    img_Contact =  '/Contact.svg';
    img_Close =  '/Close.svg';
    img_MenuActive =  '/Menu.svg';
    img_MenuDisabled =  '/manugray.svg';
    img_Menu = this.img_MenuActive;
    
    mobileLoginClass = ''; //for removing button on mobile ui login page only
    menuStyle = '';
    closeBackgroundImage = `background-image: url(${this.img_Close})`;

    url_string = '';
    activeMenu = 'Home';
    img_ActiveMenu = this.img_Home;
    @track showdonationtooltip = false;

    currentPageReference;
    
    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        this.currentPageReference = currentPageReference;
        console.log(JSON.stringify(this.currentPageReference, null, 2));
        this.handleShowDonationToolTip();
    }
    
    connectedCallback() {
        this.url_string = window.location.href;
        console.log('URL >>>>>>>>>>>>>>>>>> : ',this.url_string); 
        if(this.url_string.includes('bwps-websitegeneralhomepage'))
        {
            this.showdonationtooltip = true;
            setTimeout(fun=>{
                this.showdonationtooltip = false;
            }, 6000);
        }
    }
    renderedCallback(){
      if(this.url_string.includes("bwps-wip-browseclasses")){
          this.template.querySelector(`[data-id='browseclasses']`).className = 'menuItemClass font-800';
          
          this.img_ActiveMenu = this.img_Browse_Classes;
          this.activeMenu = 'Browse Classes';
      }
      else if(this.url_string.includes("bwps-wip-howtoparticipate")){
          this.template.querySelector(`[data-id='howtoparticipate']`).className = 'menuItemClass font-800';

          this.img_ActiveMenu = this.img_How_to_Participate;
          this.activeMenu = 'How To Participate';
      }
      else if(this.url_string.includes("bwps-wip-faqs")){
          this.template.querySelector(`[data-id='faqs']`).className = 'menuItemClass font-800';

          this.img_ActiveMenu = this.img_FAQs;
          this.activeMenu = 'FAQs';
      }
      else if(this.url_string.includes("bwps-wip-blog")){
          this.template.querySelector(`[data-id='blog']`).className = 'menuItemClass font-800';

          this.img_ActiveMenu = this.img_Blog;
          this.activeMenu = 'Blog';
      }
      else if(this.url_string.includes("bwps-wip-aboutus")){
          this.template.querySelector(`[data-id='aboutus']`).className = 'menuItemClass font-800';

          this.img_ActiveMenu = this.img_About;
          this.activeMenu = 'About Us';
      }
      else if(this.url_string.includes("bwps-wip-contactus")){
          this.template.querySelector(`[data-id='contactus']`).className = 'menuItemClass font-800';

          this.img_ActiveMenu = this.img_Contact;
          this.activeMenu = 'Contact Us';
      }
      else if(this.url_string.includes("bwps-privacy")){
          //this.template.querySelector(`[data-id='contactus']`).className = 'menuItemClass font-800';

          this.img_ActiveMenu = this.img_Home;
          this.activeMenu = 'Privacy';
      }
      else if(this.url_string.includes("bwps-wip-giftamembership")){
          //this.template.querySelector(`[data-id='contactus']`).className = 'menuItemClass font-800';

          this.img_ActiveMenu = this.img_Home;
          this.activeMenu = 'Gift Of Membership';
      }
      else if(this.url_string.includes("bwps-wip-signin?guest=true")){
          //this.template.querySelector(`[data-id='contactus']`).className = 'menuItemClass font-800';

          this.img_ActiveMenu = this.img_Home;
          this.activeMenu = 'Guest Pass';
      }

      if(this.url_string.includes("bwps-wip-signin")){
          this.mobileLoginClass = 'm-login-link';
      }
      if(this.url_string.includes("bwps-wip-donationpage")){
        this.template.querySelector(`[data-donate='donate']`).className = 'box-blue-button donateDisableClass';
      }
      if(this.url_string.includes("bwps-wip-signin")){
        this.template.querySelector(`[data-login='login']`).className = 'box-white-button donateDisableClass';
      }
    }

    handleShowDonationToolTip()
    {
        console.log('handletooltip', this.currentPageReference.attributes.name);
        if(this.currentPageReference.attributes.name == 'bwps_WIP_SignIn__c')
        {
            this.showdonationtooltip = true;
            setTimeout(fun=>{
                this.showdonationtooltip = false;
            }, 5000);
        }
    }
    handleNavModalClose(event){
        let tabletLinkBox =  this.template.querySelectorAll('.tablet-link-box');
        tabletLinkBox.forEach(currentItem => {
            currentItem.style = 'display: none;'
        });

            this.img_Menu = this.img_MenuActive;
        this.menuStyle = '';



    }
    handleNavModalOpen(event){
        let tabletLinkBox =  this.template.querySelector('.tablet-link-box');
        tabletLinkBox.style = 'display: block;'

        this.img_Menu = this.img_MenuDisabled;
        this.menuStyle = 'color: #DEE2E6';
    }
openNavigateToDonatePage(){
         const paymentComp = this.template.querySelector('c-bwps_-Donor-Dashboard-Donate-Form');
         paymentComp.donateClickHandler();
    }

    handleMobileNavModalClose(){
        let mobileModal = this.template.querySelector(`[data-id="m-header-main"]`);
        mobileModal.style = `display: none`;

        let mobileTop = this.template.querySelector(`[data-id="m-header-top"]`);
        mobileTop.style = `display: flex`;
    }
    handleMobileNavModalOpen(){
        let mobileModal = this.template.querySelector(`[data-id="m-header-main"]`);
        mobileModal.style = `display: block`;

        let mobileTop = this.template.querySelector(`[data-id="m-header-top"]`);
        mobileTop.style = `display: none`;


    }

}