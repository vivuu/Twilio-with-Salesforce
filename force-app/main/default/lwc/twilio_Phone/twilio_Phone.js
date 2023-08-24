import { LightningElement, track } from 'lwc';
export default class Twilio_Phone extends LightningElement {
    @track enteredNumber = '';
    numpadButtons = [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
        { label: '7', value: '7' },
        { label: '8', value: '8' },
        { label: '9', value: '9' },
        { label: '0', value: '0' },
        { label: 'Clear', value: 'clear' },
    ];

    handleButtonClick(event) {
        const clickedValue = event.target.dataset.value;

        if (clickedValue === 'clear') {
            this.enteredNumber = '';
        } else {
            this.enteredNumber += clickedValue;
        }
    }
}