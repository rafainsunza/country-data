const countryCardContainer = document.querySelector('.country-card-container');
const selectDropDown = document.querySelector('.select-dropdown');
const selectBtn = document.querySelector('.select-button');
const searchInput = document.querySelector('.search-input');
const searchInputBtn = document.querySelector('.search-input-button');

const cardInfo = ['flag', 'name', 'population', 'region', 'capital'];
const cardsPerPage = 12;

let pageCount = 1;
let filterActive = false;
let searchActive = false;

let activeFilter;

const fetchData = (dataKeys) => {
    return fetch('./static/data/data.json')
        .then((response) => response.json())
        .then((data) => {
            const requestedData = data.map((country) => {
                const result = {};
                dataKeys.forEach((dataKey) => {
                    if (country.hasOwnProperty(dataKey)) {
                        result[dataKey] = country[dataKey];
                    }
                });
                return result;
            });

            return requestedData;
        });
}

const displayInitialCountries = () => {
    let initialCountryData = [];
    countryCardContainer.innerHTML = '';

    if (!filterActive && !searchActive) {
        fetchData(cardInfo)
            .then((data) => {
                initialCountryData = data.slice(0, cardsPerPage);
                displayCards(initialCountryData);
            });
    } else if (filterActive && !searchActive) {
        fetchData(cardInfo)
            .then((data) => {
                initialCountryData = data.filter((country) => country.region.toLowerCase() === activeFilter).slice(0, cardsPerPage);
                displayCards(initialCountryData);
            });
    } else if (searchActive && !filterActive) {
        console.log('searching...'); // test
    }
}

const displayMoreCountries = () => {
    const startIndex = pageCount * cardsPerPage;
    const endIndex = (pageCount * cardsPerPage) + cardsPerPage;
    let maxPages;

    if (document.documentElement.clientHeight + window.scrollY >= document.documentElement.scrollHeight) {
        pageCount++;
        if (!filterActive && !searchActive) {
            fetchData(cardInfo)
                .then((data) => {
                    maxPages = Math.ceil(data.length / cardsPerPage);

                    if (pageCount <= maxPages) {
                        const moreCountryData = data.slice(startIndex, endIndex);
                        displayCards(moreCountryData);
                    }
                });
        } else if (filterActive && !searchActive) {
            fetchData(cardInfo)
                .then((data) => {
                    maxPages = Math.ceil(data.filter((country) => country.region.toLowerCase() === activeFilter).length / cardsPerPage);
                    if (pageCount <= maxPages) {
                        const moreFilteredCountryData = data.filter((country) => country.region.toLowerCase() === activeFilter).slice(startIndex, endIndex);
                        displayCards(moreFilteredCountryData);
                    }
                });
        } else if (searchActive && !filterActive) {
            console.log('loading more search results...')
        }
    }
}

const displayCards = (countries) => {
    const cards = [];

    countries.forEach((country) => {
        const card = document.createElement('div');
        card.classList.add('country-card');
        card.innerHTML = ` 
        <img class="country-flag" src="${country.flag}">
        <h2 class="country-name">${country.name}</h2>
        <ul class="card-ul">
            <li class="card-li">
                <span class="span-category">Population:</span>
                <span class="span-value">${country.population}</span>
            </li>
            <li class="card-li">
                <span class="span-category">Region:</span>
                <span class="span-value">${country.region}</span>
            </li>
            <li class="card-li">
                <span class="span-category">Capital:</span>
                <span class="span-value">${country.capital}</span>
            </li>
        </ul>
        `;

        cards.push(card);
    });

    cards.forEach((card) => {
        countryCardContainer.appendChild(card);
    });
}

const addRegionsToSelectDropdown = () => {
    const regions = [];
    fetchData(['region'])
        .then((data => {
            data.forEach((country) => {
                if (!regions.includes(country.region)) {
                    regions.push(country.region);
                }
            });

            regions.forEach((region) => {
                const li = document.createElement('li');
                const input = document.createElement('input');
                const label = document.createElement('label');

                input.setAttribute('type', 'radio');
                input.setAttribute('id', region.toLowerCase());
                input.setAttribute('class', 'dropdown-input');
                input.setAttribute('name', 'region');
                label.textContent = region;
                label.setAttribute('for', region.toLowerCase());

                li.appendChild(input);
                li.appendChild(label);
                selectDropDown.appendChild(li);
            });
        }));
}

const setFilter = (event) => {
    event.preventDefault();
    filterActive = true;

    let input = event.target;
    if (input.tagName === 'LI') {
        input = input.querySelector('input');
    } else if (input.tagName === 'LABEL') {
        input = input.previousElementSibling;
    }

    if (input.id === 'all') {
        filterActive = false;
    }

    activeFilter = input.id;

    selectBtn.firstElementChild.innerText = input.labels[0].innerText;
    selectDropDown.classList.toggle('active');

    displayInitialCountries();
}

displayInitialCountries();
addRegionsToSelectDropdown();

window.addEventListener('scroll', displayMoreCountries);
selectBtn.addEventListener('click', (event) => {
    event.preventDefault();
    selectDropDown.classList.toggle('active');
});
selectDropDown.addEventListener('click', setFilter)
// const searchCountry = (event) => {
//     event.preventDefault();

//     const foundCountries = [];

//     fetchCountries()
//         .then((data) => {
//             data.forEach((country) => {
//                 if (country.name.toLowerCase().includes(searchInput.value.toLowerCase())) {
//                     foundCountries.push(country);
//                 }
//             })

//             if (foundCountries.length > 0) {
//                 searchInput.placeholder = 'Search for a country...'
//                 searchInput.value = '';

//                 displayCountryCards(foundCountries);
//             } else {
//                 displayCountryCards(foundCountries);

//                 const div = document.createElement('div');
//                 div.textContent = `"${searchInput.value}" returned no results`;
//                 div.classList.add('error-message');
//                 countryCardContainer.appendChild(div);

//                 searchInput.value = '';
//             }
//         })
// }




// searchInputBtn.addEventListener('click', searchCountry);

