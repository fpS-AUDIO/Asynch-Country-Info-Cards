'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

////////////////////
// XMLHttpRequest //
////////////////////

// --------------------------------------------------------------------------------- //
// --- Theory and Syntax ---

// XMLHttpRequest is the most old school AJAX call type

/* ----- SYNTAX:
 1. create request object
    const request = new XMLHttpRequest();

 2. open the request object
    request.open(`requestType`, `URL`);

 3. send the request object
    request.send();

 4. register a callback on the request object for the load event
    request.addEventListener(`load`, function () {
    // `this` is the request
    console.log(this.responseText);             // JSON response is in the `responseText` property
    const data = JSON.parse(this.responseText); // converting to JS object
    console.log(data);                          // data
    });
*/

// --------------------------------------------------------------------------------- //
// --- Practice ---

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
  countriesContainer.style.opacity = 1;
};

// API Website: https://restcountries.com/

// creating reusable function to make request basing on country name
const getCountryCardAndNeighbour = function (countryStr) {
  // create request object
  const request = new XMLHttpRequest();

  // open the request object
  request.open(`GET`, `https://restcountries.com/v3.1/name/${countryStr}`);

  // send the request object
  request.send();

  // register a callback on the request object for the load event
  request.addEventListener(`load`, function () {
    // `this` is the request
    // JSON response is in the `responseText` property
    // converting to JS object while destructuring it
    if (!this.responseText) return;
    const [data] = JSON.parse(this.responseText);

    console.log(data); // data
    // update UI
    renderHtmlCard(data);

    // ----- CALLBACK HELL EXAMPLE (nested callbacks) -----
    const neighbour = data.borders?.[0]; // take the 1st neighbour if exists (?.)
    if (!neighbour) return; // in case no neighbor just exit

    // make AJAX call 2
    const request = new XMLHttpRequest();
    request.open(`GET`, `https://restcountries.com/v3.1/alpha/${neighbour}`);
    request.send();
    request.addEventListener(`load`, function () {
      if (!this.responseText) return;
      const [data] = JSON.parse(this.responseText);
      console.log(data); // data
      // update UI
      renderHtmlCard(data, `neighbour`);
    });
  });
};

getCountryCardAndNeighbour(`Italy`);
