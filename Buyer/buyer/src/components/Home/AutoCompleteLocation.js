import React, { useEffect, useState } from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

import './AutoCompleteLocation.css';

const AutoCompleteLocation = () => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!document.getElementById('google-maps-script')) {
        const script = document.createElement("script");
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAxX_TMXvgWMEuYvMbaeSV69yAIQoEhQn4&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setGoogleMapsLoaded(true);
        document.head.appendChild(script);
      } else {
        setGoogleMapsLoaded(true);
      }
    };

    loadGoogleMapsScript();
  }, []);

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(latLng);
  };

  if (!googleMapsLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <p>Latitude: {coordinates.lat}</p>
            <p>Longitude: {coordinates.lng}</p>

            <input {...getInputProps({ placeholder: "Type address" })} className="autocomplete" spellCheck="false" />

            <div>
              {loading ? <div>Loading...</div> : null}

              {suggestions.map(suggestion => {
                const style = suggestion.active
                  ? { backgroundColor: 'forestgreen', cursor: 'pointer' }
                  : { backgroundColor: 'black', cursor: 'pointer' };

                return (
                  <div {...getSuggestionItemProps(suggestion, { style })} key={suggestion.placeId}>
                    &nbsp;<i className="fas fa-map-marker-alt"></i> &nbsp; {suggestion.description}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
}

export default AutoCompleteLocation;
