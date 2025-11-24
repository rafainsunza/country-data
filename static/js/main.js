import {
    displayInitialCountries,
    displayMoreCountries,
    addRegionsToSelectDropdown,
    tileBtns,
    searchInputBtn,
    setSearch,
    changeGridLayout,
    openSelectedCountryPage,
    searchInput
} from "./modules/country_cards.js"

import { backBtn, displaySelectedCountry } from "./modules/country_details.js";

import {
    setFilter,
    toggleDarkMode,
    openDropDown,
    handleBackBtnClick
} from "./modules/event_handlers.js";

import {
    selectDropDown,
    selectBtn,
    darkModeBtn,
    setInitialCookies,
    countryCardContainer
} from "./modules/utils.js";

if (window.location.pathname === '/index.html') {
    displayInitialCountries();
    addRegionsToSelectDropdown();

    tileBtns.forEach((button) => button.addEventListener('click', changeGridLayout));
    selectBtn.addEventListener('click', openDropDown);
    selectDropDown.addEventListener('click', setFilter);
    searchInputBtn.addEventListener('click', setSearch);
    searchInput.addEventListener('keydown', setSearch);
    countryCardContainer.addEventListener('click', openSelectedCountryPage);
    window.addEventListener('scroll', displayMoreCountries);
}

if (window.location.pathname === '/pages/country.html') {
    displaySelectedCountry();

    backBtn.addEventListener('click', handleBackBtnClick);
}

setInitialCookies();
darkModeBtn.addEventListener('click', toggleDarkMode);




