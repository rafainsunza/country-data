const countryCardContainer = document.querySelector('.country-card-container');
const selectDropDown = document.querySelector('.select-dropdown');
const selectBtn = document.querySelector('.select-button');
const searchInput = document.querySelector('.search-input');
const searchInputBtn = document.querySelector('.search-input-button');

const cardInfo = ['flag', 'name', 'population', 'region', 'capital'];
const cardsPerPage = 12;

let pageCount = 1;
let loadingData = false;
let filterActive = false;
let searchActive = false;
let loadingCard = false;
let loadingCardActive = false;
let activeFilter;
let activeSearch;


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

const displayLoader = (loadingCard) => {
    loadingData = true;

    if (loadingCard && !loadingCardActive) {
        const loader = document.createElement('div');
        loader.classList.add('loader');
        loader.innerHTML = `
        <i class="fa-solid fa-spinner"></i>
        <p>Loading countries...</p>
        `;

        countryCardContainer.appendChild(loader);
        loadingCardActive = true;

        countryCardContainer.querySelector('.loader').scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
    } else {
        const loader = document.querySelector('.loader');

        if (loader && loader.parentNode === countryCardContainer) {
            countryCardContainer.removeChild(loader);
            loadingCardActive = false;
            loadingData = false;
        }
    }
}

const displayInitialCountries = () => {
    countryCardContainer.innerHTML = '';

    displayLoader(true);

    fetchData(cardInfo)
        .then((data) => {
            let initialCountryData = data;

            if (filterActive && !searchActive) {
                initialCountryData = data.filter((country) => country.region.toLowerCase() === activeFilter);
            } else if (searchActive && !filterActive) {
                initialCountryData = data.filter((country) => country.name.toLowerCase().includes(activeSearch.toLowerCase()));

                if (initialCountryData.length < 1 || activeSearch.trim() === '') {
                    const errorContainer = document.createElement('div');
                    errorContainer.classList.add('error-message');
                    errorContainer.innerHTML = `
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <p>"${activeSearch}" returned no results...</p>
                    `;
                    countryCardContainer.appendChild(errorContainer);
                    displayLoader(false);
                    return;
                }
            }

            initialCountryData = initialCountryData.slice(0, cardsPerPage);

            displayCards(initialCountryData);
            displayLoader(false);
        });
}

const displayMoreCountries = () => {
    const startIndex = pageCount * cardsPerPage;
    const endIndex = (pageCount * cardsPerPage) + cardsPerPage;
    let maxPages;

    if (!loadingData && Math.abs(document.documentElement.scrollHeight - document.documentElement.scrollTop - document.documentElement.clientHeight) <= 25) {
        pageCount++;
        displayLoader(true);

        fetchData(cardInfo)
            .then((data) => {
                let filteredData = data;

                if (filterActive && !searchActive) {
                    filteredData = data.filter((country) => country.region.toLowerCase() === activeFilter);
                } else if (searchActive && !filterActive) {
                    filteredData = data.filter((country) => country.name.toLowerCase().includes(activeSearch.toLowerCase()));
                }

                maxPages = Math.ceil(filteredData.length / cardsPerPage);

                if (pageCount <= maxPages) {
                    const moreCountryData = filteredData.slice(startIndex, endIndex);
                    displayCards(moreCountryData);
                }

                displayLoader(false);

                if (pageCount === maxPages) {
                    loadingCardActive = true;
                }
            });
    }
}

const displayCards = (countries) => {
    const cards = [];

    countries.forEach((country) => {

        let countryCapital = country.capital;

        if (countryCapital === undefined) {
            countryCapital = 'None';
        }

        const card = document.createElement('div');
        card.classList.add('country-card');
        card.innerHTML = ` 
        <img class="country-flag" src="${country.flag}">
        <h2 class="country-name">${country.name}</h2>
        <ul class="card-ul">
            <li class="card-li">
                <span class="span-category">Population:</span>
                <span class="span-value">${country.population.toLocaleString('en-US')}</span>
            </li>
            <li class="card-li">
                <span class="span-category">Region:</span>
                <span class="span-value">${country.region}</span>
            </li>
            <li class="card-li">
                <span class="span-category">Capital:</span>
                <span class="span-value">${countryCapital}</span>
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
    searchActive = false;
    loadingCardActive = false;

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

const setSearch = (event) => {
    event.preventDefault();
    pageCount = 1;

    searchActive = true;
    filterActive = false;
    loadingCardActive = false;

    activeSearch = '';
    activeSearch = searchInput.value;

    displayInitialCountries();

    searchInput.value = '';
    selectBtn.firstElementChild.innerText = 'Filter by Region';
}

displayInitialCountries();
addRegionsToSelectDropdown();

selectBtn.addEventListener('click', (event) => {
    event.preventDefault();
    selectDropDown.classList.toggle('active');
});
selectDropDown.addEventListener('click', setFilter);
searchInputBtn.addEventListener('click', setSearch);
window.addEventListener('scroll', displayMoreCountries);








