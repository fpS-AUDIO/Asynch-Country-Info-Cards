'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////////////////////////
//// OLD WAY USING XML HTTP REQUEST WITH CALLBACK HELL ////
///////////////////////////////////////////////////////////

// const renderHtmlCard = function (data, className = ``) {
//   // formatting population number for a better UX
//   const populationFormatted = new Intl.NumberFormat(data.cca2, {
//     useGrouping: true,
//   }).format(data.population);

//   // obtaining info from object
//   const language = Object.values(data.languages)[0];
//   const currency = Object.keys(data.currencies)[0];

//   // creating html component
//   const htmlComponent = `
//       <article class="country ${className}">
//           <img class="country__img" src="${data.flags.svg}" />
//           <div class="country__data">
//               <h3 class="country__name">${data.name.common}</h3>
//               <h4 class="country__region">${data.region}</h4>
//               <p class="country__row"><span>👫</span>${populationFormatted}</p>
//               <p class="country__row"><span>🗣️</span>${language}</p>
//               <p class="country__row"><span>💰</span>${currency}</p>
//           </div>
//       </article>
//     `;

//   // Updating UI
//   // const countriesContainer = document.querySelector('.countries');
//   countriesContainer.insertAdjacentHTML(`beforeend`, htmlComponent);
//   countriesContainer.style.opacity = 1;
// };

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

////////////////////////////////
// ASYNCHRONOUS JS - PROMISES //
////////////////////////////////

/* ----- Fetch API:
 -> by using it you can replace the old XML HTTP request function with modern wat of making AJAX calls
 -> fetch function also accepts an object of options but the only obligatory parameter is an endpoint url
*/

// here we're creating a request, opening it and sending it with one function
const promise = fetch(`https://restcountries.com/v3.1/name/Italy`);
console.log(promise); // return a promise

/* ----- Promise:
 -> it's an object used as a placeholder for future result of an asynchronous operation
 -> so it's like a container where we'll recieve a value asynchronously
 -> by using them you don't need to rely on events and callbacks passed inside the 
    event handlers to handle the ascynchronous result
 -> also you don't need to make nesting callback anymore because you can chain promises
    and make a sequence of asynchronous operations escaping the callback hell
 -> they're an ES6 feature (2015) and now they're widly used
 -> they can be settled(↓) only once
 -> then you need to "consume a promise" to get a result

 -> they're time sensitive (change over time), this is their lifecycle:
 ----> pending - before any value freom asynchronous task is available
                during this time asynch task is still doing its work
 ----> settled - asynch task is finished and there're 2 types of a settled promise
 --------> fulfilled - successfully resulted in a value
 --------> rejected - there has been an error during the asynchronous task
    
*/
