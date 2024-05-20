const countryCardContainer = document.querySelector('.country-card-container');
const selectDropDown = document.querySelector('.select-dropdown');
const selectBtn = document.querySelector('.select-button');
const searchInput = document.querySelector('.search-input');
const searchInputBtn = document.querySelector('.search-input-button');

const fetchCountries = () => {
    return fetch('./static/data/data.json')
        .then((response) => response.json())
        .then((data) => data)
}

const createElement = (ul, country, category) => {
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

const addRegionsToSelectDropdown = () => {
    const regions = [];
    fetchCountries()
        .then((data) => {
            data.forEach((country) => {
                if (!regions.includes(country.region)) {
                    regions.push(country.region);
                }
            })

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
            })
        })


}

const displayCountryCards = (countries) => {
    if (countries instanceof Promise) {
        countries
            .then((data) => {
                data.forEach((country) => {
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

                    createElement(ul, country.population.toLocaleString('en-US'), 'Population');
                    createElement(ul, country.region, 'Region');
                    createElement(ul, country.capital, 'Capital');

                })

            })
    } else if (Array.isArray(countries)) {
        countryCardContainer.innerHTML = '';
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

            createElement(ul, country.population.toLocaleString('en-US'), 'Population');
            createElement(ul, country.region, 'Region');
            createElement(ul, country.capital, 'Capital');

        })
    }

}

const filterByRegion = (event) => {
    let input = event.target;
    if (input.tagName === 'LI') {
        input = input.firstChild
    }

    fetchCountries()
        .then((data) => {
            let filteredByRegion = data.filter((country) => country.region.toLowerCase() === input.id);

            if (input.type === 'radio' && input.id !== 'all') {
                displayCountryCards(filteredByRegion);
            } else {
                filteredByRegion = data;
                displayCountryCards(filteredByRegion);
            }
        })

    selectDropDown.classList.remove('active');
}

const searchCountry = (event) => {
    event.preventDefault();

    const foundCountries = [];

    fetchCountries()
        .then((data) => {
            data.forEach((country) => {
                if (country.name.toLowerCase().includes(searchInput.value)) {
                    foundCountries.push(country);
                }
            })

            if (foundCountries.length > 0) {
                searchInput.placeholder = 'Search for a country...'
                searchInput.value = '';

                displayCountryCards(foundCountries);
            } else {
                searchInput.placeholder = 'No countries found';
                searchInput.value = '';
                searchInput.focus();

                displayCountryCards(foundCountries);
            }

        })
}

const restorePlaceholder = () => {
    if (searchInput.value === '') {
        searchInput.placeholder = 'Search for a country...'
    }
}
addRegionsToSelectDropdown();
displayCountryCards(fetchCountries());

selectBtn.addEventListener('click', (event) => {
    event.preventDefault();
    selectDropDown.classList.toggle('active');
});

searchInputBtn.addEventListener('click', searchCountry);
searchInput.addEventListener('blur', restorePlaceholder);
selectDropDown.addEventListener('click', filterByRegion);

