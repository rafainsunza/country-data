import {
    countryCardContainer,
    displayLoader,
    loadingData,
    selectDropDown,
    selectBtn,
    pages,
    filter,
    search
} from "./utils.js";
import { fetchData } from "./data.js";

const searchInput = document.querySelector('.search-input');
const searchInputBtn = document.querySelector('.search-input-button');
const tileBtns = document.querySelectorAll('.tile-btn');

const cards = { info: ['flag', 'name', 'population', 'region', 'capital'], perPage: 12 }
let activeSearch;
let selectedCountry;

const displayInitialCountries = () => {
    countryCardContainer.innerHTML = '';

    displayLoader(true);

    fetchData(cards.info)
        .then((data) => {
            let initialCountryData = data;

            if (filter.active && !search.active) {
                initialCountryData = data.filter((country) => country.region.toLowerCase() === filter.name);
                initialCountryData.length <= cards.perPage ? pages.maxPagesReached = true : null;
            } else if (search.active && !filter.active) {
                initialCountryData = data.filter((country) => country.name.toLowerCase().includes(activeSearch.toLowerCase()));
                initialCountryData.length <= cards.perPage ? pages.maxPagesReached = true : null;

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

            initialCountryData = initialCountryData.slice(0, cards.perPage);

            displayCards(initialCountryData);
            displayLoader(false);
        });
}

const displayMoreCountries = () => {
    if (!pages.maxPagesReached && !loadingData && Math.abs(document.documentElement.scrollHeight - document.documentElement.scrollTop - document.documentElement.clientHeight) <= 25) {
        const startIndex = pages.pageCount * cards.perPage;
        const endIndex = (pages.pageCount * cards.perPage) + cards.perPage;
        let maxPages;
        pages.pageCount++;
        displayLoader(true);

        fetchData(cards.info)
            .then((data) => {
                let filteredData = data;

                if (filter.active && !search.active) {
                    filteredData = data.filter((country) => country.region.toLowerCase() === filter.name);
                } else if (search.active && !filter.active) {
                    filteredData = data.filter((country) => country.name.toLowerCase().includes(activeSearch.toLowerCase()));
                }

                maxPages = Math.ceil(filteredData.length / cards.perPage);

                if (pages.pageCount <= maxPages) {
                    const moreCountryData = filteredData.slice(startIndex, endIndex);
                    displayCards(moreCountryData);
                }

                if (pages.pageCount === maxPages) {
                    pages.maxPagesReached = true
                }

                displayLoader(false);
            });
    }
}

const displayCards = (countries) => {
    const cards = [];

    countries.forEach((country) => {

        let countryCapital = country.capital === undefined ? 'None' : country.capital;

        const card = document.createElement('a');
        card.classList.add('country-card');
        card.setAttribute('href', '/pages/country.html')
        card.setAttribute('id', country.name)
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
    fetchData(['region'])
        .then((data => {
            const regions = [];

            data.forEach((country) => {
                if (!regions.includes(country.region)) {
                    regions.push(country.region);
                }
            });

            regions.forEach((region) => {
                const li = document.createElement('li');
                li.classList.add('dropdown-option');

                li.innerHTML = `
                <input id="${region.toLowerCase()}" class="dropdown-input" type="radio" name="region">
                <label for="${region.toLowerCase()}">${region}</label>
                `;

                selectDropDown.appendChild(li);
            });
        }));
}

const setSearch = (event) => {
    if (event.target.closest('button') || event.key === 'Enter') {
        pages.pageCount = 1;

        search.active = true;
        filter.active = false;

        activeSearch = '';
        activeSearch = searchInput.value;

        displayInitialCountries();

        searchInput.value = '';
        selectBtn.firstElementChild.innerText = 'Filter by Region';
    }
}

const changeGridLayout = (event) => {
    // Make sure target is always the button
    const btn = event.target.closest('button');

    if (btn.classList[1] === 'tile-btn-less') {
        countryCardContainer.classList.toggle('less-tiles', btn.classList[1] !== 'less-tiles');
        countryCardContainer.classList.toggle('more-tiles', btn.classList[1] === 'more-tiles');

        const moreBtn = Array.from(tileBtns).filter(tileBtn => tileBtn.classList.contains('tile-btn-more'));
        if (moreBtn[0].classList.contains('tile-btn-active')) {
            moreBtn[0].classList.remove('tile-btn-active')
        }

        btn.classList.add('tile-btn-active');
    }

    if (btn.classList[1] === 'tile-btn-more') {
        countryCardContainer.classList.toggle('more-tiles', btn.classList[1] !== 'more-tiles');
        countryCardContainer.classList.toggle('less-tiles', btn.classList[1] === 'less-tiles');

        const lessBtn = Array.from(tileBtns).filter(tileBtn => tileBtn.classList.contains('tile-btn-less'));
        if (lessBtn[0].classList.contains('tile-btn-active')) {
            lessBtn[0].classList.remove('tile-btn-active')
        }

        btn.classList.add('tile-btn-active');
    }

}

const openSelectedCountryPage = (event) => {
    event.preventDefault();

    event.target.closest('a') ?
        selectedCountry = event.target.closest('a').id :
        null

    localStorage.setItem('selected-country', `${selectedCountry}`)

    selectedCountry !== undefined ?
        window.location.href = '/pages/country.html' :
        null

}

export {
    displayInitialCountries,
    displayMoreCountries,
    addRegionsToSelectDropdown,
    displayCards,
    changeGridLayout,
    setSearch,
    openSelectedCountryPage,
    tileBtns,
    searchInputBtn,
    searchInput
}
