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
        })
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

const createLi = (ul, country, category) => {
    const li = document.createElement('li');
    li.classList.add('card-li');
    ul.appendChild(li);

    const spanBefore = document.createElement('span');
    spanBefore.classList.add('span-category');
    spanBefore.textContent = `${category}: `;
    li.appendChild(spanBefore);

    const spanAfter = document.createElement('span');
    spanAfter.classList.add('span-value');
    spanAfter.textContent = country;
    li.appendChild(spanAfter);

}
const displayCards = (countries) => {
    // countryCardContainer.innerHTML = '';
    countries.forEach((country) => {
        const div = document.createElement('div');
        div.classList.add('country-card');
        countryCardContainer.appendChild(div);

        const img = document.createElement('img');
        img.classList.add('country-flag');
        img.setAttribute('src', country.flag);
        div.appendChild(img);

        const h2 = document.createElement('h2');
        h2.classList.add('country-name');
        h2.textContent = country.name;
        div.appendChild(h2);

        const ul = document.createElement('ul');
        ul.classList.add('card-ul');
        div.appendChild(ul);

        createLi(ul, country.population.toLocaleString('en-US'), 'Population');
        createLi(ul, country.region, 'Region');
        createLi(ul, country.capital, 'Capital');

    })
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
    selectDropDown.classList.toggle('active');

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
    displayInitialCountries();
}

displayInitialCountries();
addRegionsToSelectDropdown();

window.addEventListener('scroll', displayMoreCountries);
selectBtn.addEventListener('click', (event) => {
    event.preventDefault();
    selectDropDown.classList.toggle('active');
});
selectDropDown.addEventListener('click', setFilter);



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

