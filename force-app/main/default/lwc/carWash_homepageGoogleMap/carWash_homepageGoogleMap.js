import { LightningElement, api, track, wire } from 'lwc';
import getAllLocations from '@salesforce/apex/carWash_Controller.getAllLocations';

export default class CarWash_homepageGoogleMap extends LightningElement {
    targetLat = 27.149046650000003; // Target latitude
    targetLon = 75.74680302235362; // Target longitude
    @track locationObjectArray = [];
    shortestDistance;
    shortestDistanceLat;
    shortestDistanceLon;

    coordinatesA = {
        lat: 26.33188715,
        lon: 74.71697524629388
    };

    coordinatesB = {
        lat: 24.45418165,
        lon: 73.65226908798891
    };

    connectedCallback() {
        const distanceToA = this.haversineDistance(this.coordinatesA.lat, this.coordinatesA.lon, this.targetLat, this.targetLon);
        const distanceToB = this.haversineDistance(this.coordinatesB.lat, this.coordinatesB.lon, this.targetLat, this.targetLon);

        if (distanceToA < distanceToB) {
            console.log('Coordinates A are closer.');
        } else {
            console.log('Coordinates B are closer.');
        }
    }
    haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371.0; // Radius of the Earth in kilometers
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        return distance;
    }
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    @track mapMarkers = [];
    zoomLevel = 15;
    listView = 'hidden';
    defaultCenter = {
        location: {
            Latitude: 26.4909,
            Longitude: 74.5550
        }
    };
    @track locationListArray;
    searchedInput(event){
        let searchValue = this.template.querySelector('.inputClass').value;
        console.log('searchValue1 : ',searchValue);

        this.locationListArray = [];

        //Api callout to get Location and its coordinates
        const url = `https://geocode.maps.co/search?q=${searchValue}`;
        fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log('response from api : ',data);
            if(data){
                data.forEach(locObj => {
                    if(this.locationListArray.length <= 10){
                        if(locObj.display_name.toLowerCase().includes(searchValue.toLowerCase()) && locObj.display_name.toLowerCase() != searchValue.toLowerCase() ){
                            var obj = {
                                "name" : locObj.display_name,
                                "lat" : locObj.lat,
                                "lon" : locObj.lon
                            }
                            this.locationListArray.push(obj);
                        }
                    }else{
                        return;
                    }
                });
            }
        })
        .catch(error => {
            console.error(error);
        });
        if((event.keyCode === 13)){

        }

    }
    tempObj;
    selectedFromDropdown(event){
        console.log('OUTPUT : ');
        var selectedName = event.target.dataset.name;
        var selectedLat = event.target.dataset.lat;
        var selectedLon = event.target.dataset.lon;
        console.log('selectedName : ',selectedName);
        console.log('selectedLat : ',selectedLat);
        console.log('selectedLon : ',selectedLon);
        this.template.querySelector('.inputClass').value = selectedName;
        const myDiv = this.template.querySelector('.searchContainer'); 
        // Set CSS properties using the style property
        myDiv.style.top = '7px';
        this.searchedInput({"event" : { "value" : selectedName}});
        this.mapMarkers = [];
        var markerObj = {
            location: {
                Latitude: selectedLat,
                Longitude: selectedLon,
            },
        }
        var shortDisMarkerObj = {
            location: {
                Latitude: 27.149046650000003,
                Longitude: 75.74680302235362
            }
        }
        this.defaultCenter = markerObj;
        this.mapMarkers.push(markerObj);
        //this.mapMarkers.push(shortDisMarkerObj);
        this.locationObjectArray = [];
        getAllLocations({ place: selectedName })
          .then(result => {
            console.log('getOutletLocations : ', result);
            if(result && result != 'EMPTY'){
                var locationObjArray = JSON.parse(result);
                locationObjArray.forEach(loc => {
                    const distance = this.haversineDistance(loc.Outlet_Latitude__c, loc.Outlet_Longitude__c, selectedLat, selectedLon);
                    console.log('distance : ',distance);
                    var obj = {
                            "name" : loc.Outlet_Address__c,
                            "lat" : loc.Outlet_Latitude__c,
                            "lon" : loc.Outlet_Longitude__c,
                            "distance" : distance
                        }
                    this.locationObjectArray.push(obj);
                });
                console.log('this.locationObjectArray : ',JSON.stringify(this.locationObjectArray));
                var minDistance = Infinity;
                this.locationObjectArray.forEach(loc => {
                    if(loc.distance < minDistance){
                        minDistance = loc.distance;
                        this.shortestDistanceLat = loc.lat;
                        this.shortestDistanceLon = loc.lon;
                    }
                });
                console.log('this.shortestDistanceLat : ',this.shortestDistanceLat);
                console.log('this.shortestDistanceLon : ',this.shortestDistanceLon);
                // const shortDisMarkerObj = {
                //     location: {
                //         Latitude: this.shortestDistanceLat,
                //         Longitude: this.shortestDistanceLon
                //     }
                // }
                this.tempObj = {
                    location: {
                        Latitude: this.shortestDistanceLat,
                        Longitude: this.shortestDistanceLon
                    }
                }
                console.log('shortDisMarkerObj : ',JSON.stringify(shortDisMarkerObj));
                // var shortDisMarkerObj = {
                //     location: {
                //         Latitude: 27.149046650000003,
                //         Longitude: 75.74680302235362
                //     }
                // }
                //this.defaultCenter = shortDisMarkerObj;
                //var tempObj = this.mapMarkers;
                //tempObj.push(shortDisMarkerObj);
                console.log('before push : ',JSON.stringify(this.mapMarkers));
                //this.mapMarkers.push(shortDisMarkerObj);
                console.log('after push : ',JSON.stringify(this.mapMarkers));
            }
          })
          .catch(error => {
            console.error('Error:', error);
        });
        this.mapMarkers.push(this.tempObj);
    }
}