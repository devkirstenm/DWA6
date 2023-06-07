// @ts-check

import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

/**
 * PREVIEW BUTTON
 * Function for creating preview buttons
 * @param {object} book - The book object containing id, image, title, and author information
 * @returns {previewButton} - The created preview button
 */
function createPreviewButton({ id, image, title, author }) {
  const previewButton = document.createElement("button");
  previewButton.classList = "preview";
  previewButton.setAttribute("data-preview", id);

  previewButton.innerHTML = `
      <img class="preview__image" src="${image}" />
      <div class="preview__info">
          <h3 class="preview__title">${title}</h3>
          <div class="preview__author">${authors[author]}</div>
      </div>
  `;

  return previewButton;
}

/**
 * FILTER SEARCH QUERY (BY TITLE, AUTHOR, GENRE)
 * Function for filtering books based on search criteria
 * @param {object} filter - search filters containing the title, author and genre
 * @returns {array} - the books the match the filter
 */
function filterBooks({ title, author, genre }) {
  return books.filter((book) => {
    const genreMatch = genre === "any" || book.genres.includes(genre);
    const authorMatch = author === "any" || book.author === author;
    const titleMatch =
      title.trim() === "" ||
      book.title.toLowerCase().includes(title.toLowerCase());

    return genreMatch && authorMatch && titleMatch;
  });
}

/**
 * SUBMIT SEARCH QUERY FORM
 * Function for handling search form submit event
 * @param {event} formSubmission - event for when a user submits the form
 */
function handleSearchFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const result = filterBooks(filters);

  // Update page and searchQueryMatches
  page = 1;
  searchQueryMatches = result;

  // Show/hide list message based on result length
  if (result.length < 1) {
    document
      .querySelector("[data-list-message]")
      .classList.add("list__message_show");
  } else {
    document
      .querySelector("[data-list-message]")
      .classList.remove("list__message_show");
  }

  // Update list items with filtered books
  document.querySelector("[data-list-items]").innerHTML = "";
  const newItems = document.createDocumentFragment();

  for (const book of result.slice(0, BOOKS_PER_PAGE)) {
    const element = createPreviewButton(book);
    newItems.appendChild(element);
  }

  document.querySelector("[data-list-items]").appendChild(newItems);

  // Update list button disabled state and remaining number of pages
  document.querySelector("[data-list-button]").disabled =
    searchQueryMatches.length - page * BOOKS_PER_PAGE < 1;
  document.querySelector("[data-list-button]").innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${
        searchQueryMatches.length - page * BOOKS_PER_PAGE > 0
          ? searchQueryMatches.length - page * BOOKS_PER_PAGE
          : 0
      })</span>
  `;

  // Scroll to the top of the page
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Close the search overlay
  document.querySelector("[data-search-overlay]").open = false;
}

/**
 * CANCELING EVENTS
 * Function for handling cancel evenets
 */

function closeOverlay() {
  document.querySelector("[data-search-overlay]").open = false;
  document.querySelector("[data-settings-overlay]").open = false;
}

/**
 * CLICK EVENTS
 * Function for handling click events
 */
function clickSearch() {
  document.querySelector("[data-search-overlay]").open = true;
  document.querySelector("[data-search-title]").focus();
}

function clickSettings() {
  document.querySelector("[data-settings-overlay]").open = true;
}

// Event listeners
/**
 * @event click
 * @listens searchCancel
 */
document
  .querySelector("[data-search-cancel]")
  .addEventListener("click", handleSearchCancel);
/**
 * @event click
 * @listens settingsCancel
 */
document
  .querySelector("[data-settings-cancel]")
  .addEventListener("click", handleSettingsCancel);
/**
 * @event click
 * @listens searchBar
 */
document
  .querySelector("[data-header-search]")
  .addEventListener("click", clickSearch);
/**
 * @event click
 * @listens themeSettings
 */
document
  .querySelector("[data-header-settings]")
  .addEventListener("click", clickSettings);

/**
 * UPDATE THEME (LIGHT/DARK)
 * Function for updating light and dark mode theme
 * @param {string} lightOrDarkTheme - update theme to 'night' or 'day'
 */
function updateTheme(theme) {
  if (theme === "night") {
    document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
    document.documentElement.style.setProperty("--color-light", "10, 10, 20");
  } else {
    document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
    document.documentElement.style.setProperty(
      "--color-light",
      "255, 255, 255"
    );
  }
}

/**
 * Event listener for settings form submit event
 * @event
 * @listens settingsForm
 */
document
  .querySelector("[data-settings-form]")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const { theme } = Object.fromEntries(formData);

    // Update theme based on form data
    updateTheme(theme);

    // Close the settings overlay
    document.querySelector("[data-settings-overlay]").open = false;
  });

/**
 * Event listener for list button click event
 * @event click
 * @listens listButton
 */
document.querySelector("[data-list-button]").addEventListener("click", () => {
  const fragment = document.createDocumentFragment();

  for (const book of searchQueryMatches.slice(
    page * BOOKS_PER_PAGE,
    (page + 1) * BOOKS_PER_PAGE
  )) {
    const element = createPreviewButton(book);
    fragment.appendChild(element);
  }

  document.querySelector("[data-list-items]").appendChild(fragment);
  page += 1;
});

/**
 * Event listener for list items click event
 * @event click
 * @listens listItem
 */
document
  .querySelector("[data-list-items]")
  .addEventListener("click", (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;

    for (const node of pathArray) {
      if (active) break;

      if (node?.dataset?.preview) {
        active = books.find((book) => book.id === node.dataset.preview);
      }
    }

    if (active) {
      document.querySelector("[data-list-active]").open = true;
      document.querySelector("[data-list-blur]").src = active.image;
      document.querySelector("[data-list-image]").src = active.image;
      document.querySelector("[data-list-title]").innerText = active.title;
      document.querySelector("[data-list-subtitle]").innerText = `${
        authors[active.author]
      } (${new Date(active.published).getFullYear()})`;
      document.querySelector("[data-list-description]").innerText =
        active.description;
    }
  });
