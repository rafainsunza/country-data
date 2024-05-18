const countryCardContainer = document.querySelector('.country-card-container');
const selectDropDown = document.querySelector('.select-dropdown');

const fetchCountries = () => {
    return fetch('./static/data/data.json')
        .then((response) => response.json())
        .then((data) => data)
}

const createCountryCards = () => {
    fetchCountries()
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

addRegionsToSelectDropdown();
createCountryCards();
