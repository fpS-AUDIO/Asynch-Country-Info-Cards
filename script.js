'use strict';

/* ----- Implementing the logic using the PROMISES (exersicing) -----
-------- NOT USING OOP paradigm HERE!
-------- Also 1st time I implemented it using XMLHttpRequest, 
-------- then using classic promises (code below),
-------- and, finally, I have another file with async/await syntax. 


 --> select all elements
 --> promisify setTimeout -> wait()
 --> promisify geolocation API -> getCoords()
 --> promosify reverse geolocation -> getCountryCode()
 --> define helper functions:
 ----> renderPositionText()
----> emptyMessageContainer()
 ----> getJsonOrError()
 ----> emptyContainer()
 ----> showSpinner()
 ----> hideSpinner()
 ----> renderHtmlCard()
 ----> renderError()

----- */

// ---- selecting HTML elements
const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const messageContainer = document.querySelector(`.message`);
const loader = document.querySelector(`.loader`);

// ---- defining functions
const renderPositionText = function (text) {
  messageContainer.innerHTML = ``;
  messageContainer.insertAdjacentText(`beforeend`, text);
};

const emptyMessageContainer = function () {
  messageContainer.innerHTML = ``;
};

const emptyContainer = function () {
  countriesContainer.innerHTML = ``;
};

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

const renderError = function (error) {
  messageContainer.innerHTML = ``;
  messageContainer.insertAdjacentText(
    `beforeend`,
    `There was an error: ${error}.`
  );
};

const showSpinner = function () {
  loader.style.display = `inline-block`;
};

const hideSpinner = function () {
  loader.style.display = `none`;
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

const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

const getCoords = function () {
  return new Promise(function (resolve) {
    // check if navigator.geolocation in older browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // get current latitude and longitude
        const { latitude, longitude } = position.coords;
        // fulfill promise with array of coords
        resolve([latitude, longitude]);
      });
      // no reject function, just renderError() helper function
    } else renderError(`Unable to get your position`);
  });
};

const getCountryCode = function (coordsArray) {
  return new Promise(function (resolve, reject) {
    // destructuring the given array `coordsArray`
    const [lati, long] = coordsArray;
    // nested promise
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lati}&lon=${long}`
    )
      .then((response) => response.json())
      .then((data) => {
        // calling helper function
        renderPositionText(`You're in: ${data.display_name}`);
        if (!data.address.country_code)
          reject(`Can't Access to Your Country Code`);
        // fulfill promise with country code string
        resolve(data.address.country_code);
      });
  });
};

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

// main logic...
btn.addEventListener(`click`, function () {
  // ----- USING THE CLASSIC PROMISES ----- //
  emptyContainer();
  emptyMessageContainer();
  showSpinner();
  getCoords()
    .then((coords) => getCountryCode(coords))
    .then((countyCode) => {
      hideSpinner();
      getCountryCardandNeighbour(countyCode);
    })
    .catch((err) => renderError(err));
  // -------------------------------------- //

  // ----- END of event handler });
});
