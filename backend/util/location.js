const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = "AIzaSyAxX_TMXvgWMEuYvMbaeSV69yAIQoEhQn4";

async function getCoordsForAddress(address) {
  try {
    console.log("STARTING ........")
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${API_KEY}`
    );

    const data = response.data;

    if (!data || !data.results || data.results.length === 0 || data.status === 'ZERO_RESULTS') {
      throw new HttpError(
        'Could not find location for the specified address.',
        422
      );
    }

    const coordinates = data.results[0].geometry.location;
    const address_components = data.results[0].address_components;
    let district, state, country;

    for (let i of address_components) {
      if (i['types'].includes("administrative_area_level_2")) {
        district = i['long_name'];
      } else if (i['types'].includes("administrative_area_level_1")) {
        state = i['long_name'];
      } else if (i['types'].includes("country")) {
        country = i['long_name'];
      }
    }

    return [coordinates, district, state, country];
  } catch (error) {
    // Handle axios errors or any other errors
    throw new HttpError(
      'Failed to retrieve coordinates for the specified address.',
      500
    );
  }
}

module.exports = getCoordsForAddress;
