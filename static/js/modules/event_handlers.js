import {
    selectDropDown,
    selectBtn,
    pages,
    filter,
    search,
    getCookies,
    setCookie,
    body
} from "./utils.js";
import { displayInitialCountries } from "./country_cards.js";

const toggleDarkMode = () => {
    const cookies = getCookies();
    const darkModeCookie = cookies.find((cookie) => cookie.name.includes('dark-mode'));

    if (darkModeCookie.value === 'disabled') {
        body.classList.toggle('dark-mode');
        setCookie('dark-mode', 'enabled', 365);
    }

    if (darkModeCookie.value === 'enabled') {
        body.classList.toggle('dark-mode');
        setCookie('dark-mode', 'disabled', 365);
    }
}

const setFilter = (event) => {
    pages.pageCount = 1;
    pages.maxPagesReached = false;

    filter.active = true;
    search.active = false;

    const li = event.target.closest('li');
    const input = li.querySelector('input');

    if (input.id === 'all') {
        filter.active = false;
    }
    filter.name = input.id;


    // Remove all active-filter classes so a new one can be set
    const dropdownOptions = selectDropDown.querySelectorAll('.dropdown-option');
    dropdownOptions.forEach((option) => { option.classList.remove('active-filter') });
    li.classList.add('active-filter');

    selectBtn.firstElementChild.innerText = input.labels[0].innerText;
    selectDropDown.classList.toggle('active');

    displayInitialCountries();
}

const openDropDown = () => {
    selectDropDown.classList.toggle('active');
}

const handleBackBtnClick = () => {
    history.back()
}
export { toggleDarkMode, setFilter, openDropDown, handleBackBtnClick }
