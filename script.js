'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderHtmlCard = function (data, className = ``) {
  // formatting population number for a better UX
  const populationFormatted = new Intl.NumberFormat(data.cca2, {
    useGrouping: true,
  }).format(data.population);

  // obtaining info from object
  const language = Object.values(data.languages)[0];
  const currency = Object.keys(data.currencies)[0];

  // creating html component
  const htmlComponent = `
      <article class="country ${className}">
          <img class="country__img" src="${data.flags.svg}" />
          <div class="country__data">
              <h3 class="country__name">${data.name.common}</h3>
              <h4 class="country__region">${data.region}</h4>
              <p class="country__row"><span>👫</span>${populationFormatted}</p>
              <p class="country__row"><span>🗣️</span>${language}</p>
              <p class="country__row"><span>💰</span>${currency}</p>
          </div>
      </article>
    `;

  // Updating UI
  // const countriesContainer = document.querySelector('.countries');
  countriesContainer.insertAdjacentHTML(`beforeend`, htmlComponent);
  // countriesContainer.style.opacity = 1;
};

// helper function to render error text un UI
const renderError = function (error) {
  countriesContainer.insertAdjacentText(
    `beforeend`,
    `There was an error: ${error}.`
  );
  // countriesContainer.style.opacity = 1;
};

// helper function which includes fetch(), json() and throw new Error#
const getJsonOrError = function (url, errorMSG = `somethig went wrong...`) {
  // first fetch a promise
  return fetch(url).then((responseValue) => {
    if (!responseValue.ok) {
      throw new Error(`${errorMSG}: ${responseValue.status}`);
    }
    return responseValue.json();
  }); // handling promise using then() and reading data using json()
};

// creating a function which shows data about the given country
const getCountryCardandNeighbour = function (countryCode) {
  getJsonOrError(
    `https://restcountries.com/v3.1/alpha/${countryCode}`,
    `Country not found`
  )
    .then((data) => {
      // json() returned a new promise which handled using then() again with its callback with actual data

      // destructuring
      const [destructuredData] = data;

      // update UI
      renderHtmlCard(destructuredData);

      // find neighbour
      const neighbour = destructuredData.borders?.[0];
      if (!neighbour) throw new Error(`There is not neigbour...`);

      // return new promise to allow chaining
      return getJsonOrError(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        `Country not found`
      );
    })
    .then((data) => {
      const [destructuredData] = data;
      renderHtmlCard(destructuredData, `neighbour`);
    })
    .catch((error) => {
      renderError(error.message);
    })
    .finally(() => (countriesContainer.style.opacity = 1));
};

// function to return a Country basing on the coords (latitude and longitude) and update UI
const coordsToCountryCode = function (lati, long) {
  fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lati}&lon=${long}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(`You're in: ${data.display_name}`);
      getCountryCardandNeighbour(data.address.country_code);
    })
    .catch((err) => console.log(`Something went wrong`));
  // data.address.country_code
};

// coordsToCountryCode(52.508, 13.381);
// coordsToCountryCode(19.037, 72.873);
// coordsToCountryCode(-33.933, 18.474);
// getCountryCardandNeighbour(`usa`)

// function to get the current position and call coordsToCountryCode(current position)
const getCurrentCountry = function () {
  // get the current position
  navigator.geolocation.getCurrentPosition(
    (position) => {
      // get current latitude and longitude
      const { latitude, longitude } = position.coords;
      coordsToCountryCode(latitude, longitude);
    },
    () => alert(`Unable to get your position`)
  );
};

// on button click update UI with given county
// simulating catching errors of promises by getting offline before click the btn
btn.addEventListener(`click`, function () {
  // getCountryCardandNeighbour(`Australia`);
  getCurrentCountry();
});

///////////////////////////////////////////////////////////
//// OLD WAY USING XML HTTP REQUEST WITH CALLBACK HELL ////
///////////////////////////////////////////////////////////

// // API Website: https://restcountries.com/

// // creating reusable function to make request basing on country name
// const getCountryCardAndNeighbour = function (countryStr) {
//   // create request object
//   const request = new XMLHttpRequest();

//   // open the request object
//   request.open(`GET`, `https://restcountries.com/v3.1/name/${countryStr}`);

//   // send the request object
//   request.send();

//   // register a callback on the request object for the load event
//   request.addEventListener(`load`, function () {
//     // `this` is the request
//     // JSON response is in the `responseText` property
//     // converting to JS object while destructuring it
//     if (!this.responseText) return;
//     const [data] = JSON.parse(this.responseText);

//     console.log(data); // data
//     // update UI
//     renderHtmlCard(data);

//     // ----- CALLBACK HELL EXAMPLE (nested callbacks) -----
//     const neighbour = data.borders?.[0]; // take the 1st neighbour if exists (?.)
//     if (!neighbour) return; // in case no neighbor just exit

//     // make AJAX call 2
//     const request = new XMLHttpRequest();
//     request.open(`GET`, `https://restcountries.com/v3.1/alpha/${neighbour}`);
//     request.send();
//     request.addEventListener(`load`, function () {
//       if (!this.responseText) return;
//       const [data] = JSON.parse(this.responseText);
//       console.log(data); // data
//       // update UI
//       renderHtmlCard(data, `neighbour`);
//     });
//   });
// };

// getCountryCardAndNeighbour(`Italy`);

///////////////////////////////////////////////////////////
