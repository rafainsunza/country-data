import { displayLoader } from "./utils.js";

const detailedInfo = [
    'flag',
    'name',
    'nativeName',
    'population',
    'region',
    'subregion',
    'capital',
    'topLevelDomain',
    'currencies',
    'languages',
    'borders',
    'alpha3Code'
];
const detailedCountryCard = document.querySelector('.detailed-country-card');
const backBtn = document.querySelector('.back-btn');

const fetchDetailedData = (dataKeys) => {
    return fetch('/static/data/data.json')
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
        .catch(() => {
            displayLoader(false);
            maxPagesReached = true;
            let errorMessageContainer = detailedCountryCard.querySelector('.error-message');

            if (!errorMessageContainer) {
                errorMessageContainer = document.createElement('div');
                errorMessageContainer.classList.add('error-message');

                errorMessageContainer.innerHTML = `
                    <p>Something went wrong, please try again later...</p>
                `;

                detailedCountryCard.appendChild(errorMessageContainer);
            }
        });
}

const convertAbbreviationsToCountryNames = (abbreviation, data) => {
    const convertedCountryNames = [];

    abbreviation[0] === 'None' ? convertedCountryNames.push(abbreviation[0]) :
        abbreviation.forEach((abbreviation) => {
            const foundCountry = data.find(country => country["alpha3Code"] === abbreviation);

            convertedCountryNames.push(foundCountry.name);
        });

    return convertedCountryNames;
}

const displayCard = (countryToDisplay) => {
    const currencies = [];
    const languages = [];

    countryToDisplay.capital === undefined ? countryToDisplay.capital = 'None' : null;

    countryToDisplay.languages.forEach((language) => { languages.push(language.name) });

    countryToDisplay.currencies === undefined ?
        currencies.push('None') :
        countryToDisplay.currencies.forEach((currency) => { currencies.push(currency.name) });

    const card =
        `<img class="detailed-flag" src="${countryToDisplay.flag}">
    <div class="details-container">
        <h2 class="detail-page-name">${countryToDisplay.name}</h2>

        <ul class="details">
            <li class="details-li"><strong>Native Name: </strong>${countryToDisplay.nativeName}</li>
            <li class="details-li"><strong>Population: </strong>${countryToDisplay.population.toLocaleString('en-US')}</li>
            <li class="details-li"><strong>Region: </strong>${countryToDisplay.region}</li>
            <li class="details-li"><strong>Sub Region: </strong>${countryToDisplay.subregion}</li>
            <li class="details-li"><strong>Capital: </strong>${countryToDisplay.capital}</li>
        </ul>

        <ul class="details">
            <li class="details-li"><strong>Top Level Domain: </strong>${countryToDisplay.topLevelDomain}</li>
            <li class="details-li"><strong>Currencies: </strong>${currencies.join(', ')}</li>
            <li class="details-li"><strong>Languages: </strong>${languages.join(', ')}</li>
        </ul>

        <div class="border-countries-container">
            <h3 class="border-countries-title"><strong>Border Countries:</strong></h3>
            <div class="border-countries"></div>
        </div>
    </div>`;

    return card
}

const displaySelectedCountry = () => {
    const selectedCountry = localStorage.getItem('selected-country');

    displayLoader(true)

    fetchDetailedData(detailedInfo)
        .then((data) => {
            const countryToDisplay = data.find((country) => country.name === selectedCountry);
            let borderCountriesAbbreviations = [];

            countryToDisplay.borders === undefined ?
                borderCountriesAbbreviations = ['None'] :
                countryToDisplay.borders.forEach((country) => { borderCountriesAbbreviations.push(country) });

            const borderCountries = convertAbbreviationsToCountryNames(borderCountriesAbbreviations, data);

            detailedCountryCard.innerHTML = displayCard(countryToDisplay);

            const borderCountriesDiv = document.querySelector('.border-countries');

            borderCountries.forEach((country) => {
                const span = document.createElement('span');
                span.classList.add('border-country');
                span.textContent = country;

                borderCountriesDiv.appendChild(span);
            });

            displayLoader(false)
        });
}

export { backBtn, displaySelectedCountry }




