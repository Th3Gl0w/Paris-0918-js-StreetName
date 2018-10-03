import React, { Component } from 'react';
import "./App.css";
import AlgoliaPlacess from './AlgoliaPlacess';
import PanameStreet from './PanameStreet';

class Search extends Component {

    state = {
        latitude: '',
        longitude: '',
        geolocplacename: '',
        streetstory: '',
        streetname: '',
    };


    getStreetHistory = async (e) => {
        const input_rue = e.suggestion.name
        const truc_api = await fetch(`https://opendata.paris.fr/api/records/1.0/search/?dataset=voiesactuellesparis2012&q=${input_rue}&facet=typvoie&facet=date_arret&facet=quartier&facet=arron`)
        const api_data = await truc_api.json()
        //console.log(api_data)
        this.setState({
            streetstory: api_data.records[0].fields.histo,
            streetname: api_data.records[0].fields.nomvoie
        })
    }

    getLocation = (e) => {
        let geolocation = null;

        if (window.navigator && window.navigator.geolocation) {
            geolocation = window.navigator.geolocation
        }

        if (geolocation) {
            geolocation.getCurrentPosition((position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            }
            )
        }

        const getPlace = async (lat, lng) => {
            try {

                const response = await fetch(`https://places-dsn.algolia.net/1/places/reverse?aroundLatLng=${lat},%20${lng}&hitsPerPage=1&language=fr`)
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                const data = await response.json()
                //console.log(data.hits[0].locale_names);
                this.setState({ geolocplacename: data.hits[0].locale_names });

            } catch (error) {
                console.log(error);
            }


        }
        if (this.state.latitude !== '' && this.state.longitude !== '')
            getPlace(this.state.latitude, this.state.longitude)


    };

    render() {

    return (
    
<div>
<button type="button" name="geoloc" type="submit" onClick={this.getLocation}>Locate Me !</button>

    <AlgoliaPlacess
    valeur={this.state.geolocplacename}
    placeholder='Nom de ta rue ...'
 
    options={{
        appId: 'plRZBW9D9AP1',
        apiKey: '412709398690b7300f440d212a96dee4',
        language: 'fr',
        countries: ['fr'],
        type: 'address',
        insideBoundingBox:  "48.896, 2.394, 48.84, 2.25",
        useDeviceLocation: false,
        aroundLatLng: false,
        aroundLatLngViaIP: false
        // Other options from https://community.algolia.com/places/documentation.html#options
      }}
     
      onChange={({ query, rawAnswer, suggestion, suggestionIndex, rueSelection }) => {
        this.getStreetHistory({ query, rawAnswer, suggestion, suggestionIndex, rueSelection })
    }}
 
      onSuggestions={({ rawAnswer, query, suggestions }) => 
        console.log('Fired when dropdown receives suggestions. You will receive the array of suggestions that are displayed.')
    }
 
      onCursorChanged={({ rawAnswer, query, suggestion, suggestonIndex }) => 
        console.log('Fired when arrows keys are used to navigate suggestions.')
    }
 
      onClear={() => 
        console.log('Fired when the input is cleared.')
    }
 
      onLimit={({ message }) => 
        console.log('Fired when you reached your current rate limit.')
    }
 
      onError={({ message }) => 
        console.log('Fired when we could not make the request to Algolia Places servers for any reason but reaching your rate limit.')
    }
     />

       <PanameStreet 
        streetstory={this.state.streetstory}
        streetname={this.state.streetname}
/>

</div>
      
    );
  }
}

export default Search;