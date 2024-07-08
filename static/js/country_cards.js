const selectDropDown = document.querySelector('.select-dropdown');
const selectBtn = document.querySelector('.select-button');
const searchInput = document.querySelector('.search-input');
const searchInputBtn = document.querySelector('.search-input-button');
const tileBtns = document.querySelectorAll('.tile-btn');

const cardInfo = ['flag', 'name', 'population', 'region', 'capital'];
const cardsPerPage = 12;
let pageCount = 1;
let filterActive = false;
let searchActive = false;
let activeFilter;
let activeSearch;


const displayInitialCountries = () => {
    countryCardContainer.innerHTML = '';

    displayLoader(true);

    fetchData(cardInfo)
        .then((data) => {
            let initialCountryData = data;

            if (filterActive && !searchActive) {
                initialCountryData = data.filter((country) => country.region.toLowerCase() === activeFilter);
                initialCountryData.length <= cardsPerPage ? maxPagesReached = true : null;
            } else if (searchActive && !filterActive) {
                initialCountryData = data.filter((country) => country.name.toLowerCase().includes(activeSearch.toLowerCase()));
                initialCountryData.length <= cardsPerPage ? maxPagesReached = true : null;

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
    if (!maxPagesReached && !loadingData && Math.abs(document.documentElement.scrollHeight - document.documentElement.scrollTop - document.documentElement.clientHeight) <= 25) {
        const startIndex = pageCount * cardsPerPage;
        const endIndex = (pageCount * cardsPerPage) + cardsPerPage;
        let maxPages;
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

                if (pageCount === maxPages) {
                    maxPagesReached = true
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

const setFilter = (event) => {
    event.preventDefault();
    pageCount = 1;
    maxPagesReached = false;

    filterActive = true;
    searchActive = false;

    const li = event.target.closest('li');
    const input = li.querySelector('input');

    if (input.id === 'all') {
        filterActive = false;
    }
    activeFilter = input.id;


    // Remove all active-filter classes so a new one can be set
    const dropdownOptions = selectDropDown.querySelectorAll('.dropdown-option');
    dropdownOptions.forEach((option) => { option.classList.remove('active-filter') });
    li.classList.add('active-filter');

    selectBtn.firstElementChild.innerText = input.labels[0].innerText;
    selectDropDown.classList.toggle('active');

    displayInitialCountries();
}

const setSearch = (event) => {
    event.preventDefault();
    pageCount = 1;

    searchActive = true;
    filterActive = false;

    activeSearch = '';
    activeSearch = searchInput.value;

    displayInitialCountries();

    searchInput.value = '';
    selectBtn.firstElementChild.innerText = 'Filter by Region';
}

const changeGridLayout = (event) => {
    // Make sure target is always the button
    const btn = event.target.closest('button');

    switch (btn.classList[1]) {
        case 'tile-btn-1':
            countryCardContainer.style.gridTemplateColumns = 'repeat(1, minmax(280px, 1fr))';
            break;
        case 'tile-btn-2':
            countryCardContainer.style.gridTemplateColumns = 'repeat(2, minmax(140px, 1fr))';
            break;
        case 'tile-btn-3':
            countryCardContainer.style.gridTemplateColumns = 'repeat(3, minmax(280px, 1fr))';
            break;
        case 'tile-btn-4':
            countryCardContainer.style.gridTemplateColumns = 'repeat(4, minmax(280px, 1fr))';
            break;
    }
}

const resetGridLayout = (event) => {
    const window = event.target;

    const smallScreen = window.innerWidth < 720
    const mediumScreen = window.innerWidth >= 720 && window.innerWidth < 1040
    const largeScreen = window.innerWidth >= 1040 && window.innerWidth < 1360
    const xtraLargeScreen = window.innerWidth >= 1360

    const tileLayout1 = countryCardContainer.style.gridTemplateColumns === 'repeat(1, minmax(280px, 1fr))';
    const tileLayout2 = countryCardContainer.style.gridTemplateColumns === 'repeat(2, minmax(140px, 1fr))';
    const tileLayout3 = countryCardContainer.style.gridTemplateColumns === 'repeat(3, minmax(280px, 1fr))';
    const tileLayout4 = countryCardContainer.style.gridTemplateColumns === 'repeat(4, minmax(280px, 1fr))';
    // If amount of tiles exceeds the window width, remove the inline styling placed by the tile-btn.
    // Or if the amount of tiles does not correspond with the amount of tiles that can be chosen from, also remove the inline styling

    if (smallScreen) {
        if (!tileLayout1 && !tileLayout2) {
            countryCardContainer.style.gridTemplateColumns = '';
        }
    }
    if (mediumScreen) {
        if (!tileLayout1 && !tileLayout2) {
            countryCardContainer.style.gridTemplateColumns = '';
        }
    }

    if (largeScreen) {
        if (!tileLayout2 && !tileLayout3) {
            countryCardContainer.style.gridTemplateColumns = '';
        }
    }

    if (xtraLargeScreen) {
        if (!tileLayout3 && !tileLayout4) {
            countryCardContainer.style.gridTemplateColumns = ''
        }
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

displayInitialCountries();
addRegionsToSelectDropdown();


selectBtn.addEventListener('click', (event) => {
    event.preventDefault();
    selectDropDown.classList.toggle('active');
});
selectDropDown.addEventListener('click', setFilter);
searchInputBtn.addEventListener('click', setSearch);
countryCardContainer.addEventListener('click', openSelectedCountryPage);
tileBtns.forEach((button) => button.addEventListener('click', changeGridLayout));
window.addEventListener('scroll', displayMoreCountries);
window.addEventListener('resize', resetGridLayout);

