// @ts-check
import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

/**
 * @typedef {Object} Book
 * @property {string} author - The ID of the book's author.
 * @property {string} id - The ID of the book.
 * @property {string} image - The URL of the book's image.
 * @property {string} title - The title of the book.
 */

// initializes page and matches
let page = 1;
let matches = books;

// creates document fragment to hold starting book previews
const starting = document.createDocumentFragment();

/**
 * Creates a book preview element.
 * @param {Book} book - The book object containing author, id, image, and title.
 * @returns {HTMLButtonElement} The created book preview element.
 */
function createBookPreview({ author, id, image, title }) {
  const element = document.createElement("button");
  element.classList.add("preview");
  element.setAttribute("data-preview", id);

  element.innerHTML = `
  <img
      class="preview__image"
      src="${image}"
  />

  <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${authors[author]}</div>
  </div>
`;

  return element;
}

// Renders starting book previews
for (const book of matches.slice(0, BOOKS_PER_PAGE)) {
  const previewElement = createBookPreview(book);
  starting.appendChild(previewElement);
}

// appends the starting book previews to the document body
document.querySelector("[data-list-items]").appendChild(starting);

/**
 * Creates a genre option element for a dropdown select.
 * @param {string} id - The ID of the genre option.
 * @param {string} name - The name of the genre option.
 * @returns {HTMLOptionElement} The created genre option element.
 */
function createGenreOption(id, name) {
  const genreOption = document.createElement("option");
  genreOption.value = id;
  genreOption.innerText = name;
  return genreOption;
}

// creates a document fragment to hold genre options
const genreHtml = document.createDocumentFragment();

// creates an option for "all genres"
const firstGenreElement = createGenreOption("any", "All Genres");
genreHtml.appendChild(firstGenreElement);

// Renders options for each genre
for (const [id, name] of Object.entries(genres)) {
  const genreOption = createGenreOption(id, name);
  genreHtml.appendChild(genreOption);
}

// appends genre options to search genres element
document.querySelector("[data-search-genres]").appendChild(genreHtml);

/**
 * Creates an author option element.
 * @param {string} id - The ID of the author.
 * @param {string} name - The name of the author.
 * @returns {HTMLOptionElement} The created author option element.
 */
function createAuthorOption(id, name) {
  const authorOption = document.createElement("option");
  authorOption.value = id;
  authorOption.innerText = name;
  return authorOption;
}

// creates document fragment to hold author options
const authorsHtml = document.createDocumentFragment();

// creates an option for "all authors"
const firstAuthorElement = createAuthorOption("any", "All Authors");
authorsHtml.appendChild(firstAuthorElement);

// Renders options for each author
for (const [id, name] of Object.entries(authors)) {
  const authorOption = createAuthorOption(id, name);
  authorsHtml.appendChild(authorOption);
}

// appends author options to search authors element
document.querySelector("[data-search-authors]").appendChild(authorsHtml);

/**
 * Sets the theme based on the user's preferred color scheme.
 * @param {string} theme - The theme value to set.
 */
function setTheme(theme) {
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const themeValue = isDarkMode ? "night" : "day";
  const colorDark = isDarkMode ? "255, 255, 255" : "10, 10, 20";
  const colorLight = isDarkMode ? "10, 10, 20" : "255, 255, 255";

  document.querySelector("[data-settings-theme]").value = themeValue;
  document.documentElement.style.setProperty("--color-dark", colorDark);
  document.documentElement.style.setProperty("--color-light", colorLight);
}

// checks the user's preferred color scheme and sets the theme accordingly
setTheme();

/**
 * Updates the "show more" button text and disabled state.
 */
function updateShowMoreButton() {
  const remainingBooks = matches.length - page * BOOKS_PER_PAGE;
  const showMoreButton = document.querySelector("[data-list-button]");

  showMoreButton.innerText = `Show more (${remainingBooks})`;
  showMoreButton.disabled = remainingBooks > 0;

  showMoreButton.innerHTML = `
  <span>Show more</span>
  <span class="list__remaining"> (${
    remainingBooks > 0 ? remainingBooks : 0
  })</span>
`;
}

// updates "show more" button text and disabled state
updateShowMoreButton();

/**
 * Adds an event listener to hide an overlay when the cancel button is clicked.
 * @param {string} overlaySelector - The CSS selector for the overlay element.
 * @param {string} cancelSelector - The CSS selector for the cancel button element.
 */
function addOverlayCancelListener(overlaySelector, cancelSelector) {
  document.querySelector(cancelSelector).addEventListener("click", () => {
    document.querySelector(overlaySelector).open = false;
  });
}

/**
 * Adds an event listener to show an overlay when the corresponding button is clicked.
 * @param {string} buttonSelector - The CSS selector for the button element.
 * @param {string} overlaySelector - The CSS selector for the overlay element.
 */
function addOverlayShowListener(buttonSelector, overlaySelector) {
  document.querySelector(buttonSelector).addEventListener("click", () => {
    document.querySelector(overlaySelector).open = true;
  });
}

// Add event listeners for search overlay
addOverlayCancelListener("[data-search-overlay]", "[data-search-cancel]");
addOverlayShowListener("[data-header-search]", "[data-search-overlay]");

// Add event listener for settings overlay
addOverlayCancelListener("[data-settings-overlay]", "[data-settings-cancel]");
addOverlayShowListener("[data-header-settings]", "[data-settings-overlay]");

// Add event listener for active list close button
addOverlayCancelListener("[data-list-active]", "[data-list-close]");

/**
 * Handles the form submission event and updates the theme based on the selected value.
 * @param {Event} event - The form submission event.
 */
function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { theme } = Object.fromEntries(formData);

  const colorDark = theme === "night" ? "255, 255, 255" : "10, 10, 20";
  const colorLight = theme === "night" ? "10, 10, 20" : "255, 255, 255";

  document.documentElement.style.setProperty("--color-dark", colorDark);
  document.documentElement.style.setProperty("--color-light", colorLight);
  document.querySelector("[data-settings-overlay]").open = false;
}

// Add event listener to the settings form submit event
document
  .querySelector("[data-settings-form]")
  .addEventListener("submit", handleFormSubmit);

/**
 * Handles the form submission event and filters books based on the provided filters.
 * @param {Event} event - The form submission event.
 */
function handleSearchFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const filters = Object.fromEntries(formData);
  const filteredBooks = filterBooks(filters);
  updateSearchResults(filteredBooks);
  scrollToTop();
  closeSearchOverlay();
}

/**
 * Filters books based on the provided filters.
 * @param {Object} filters - The filters object containing genre, title, and author.
 * @returns {Array} - The filtered books.
 */
function filterBooks(filters) {
  return books.filter((book) => {
    const genreMatch =
      filters.genre === "any" || book.genres.includes(filters.genre);
    const titleMatch =
      filters.title.trim() === "" ||
      book.title.toLowerCase().includes(filters.title.toLowerCase());
    const authorMatch =
      filters.author === "any" || book.author === filters.author;
    return genreMatch && titleMatch && authorMatch;
  });
}

/**
 * Updates the search results on the page based on the filtered books.
 * @param {Array} filteredBooks - The filtered books to display.
 */
function updateSearchResults(filteredBooks) {
  page = 1;
  matches = filteredBooks;

  const listMessageElement = document.querySelector("[data-list-message]");
  const listItemsElement = document.querySelector("[data-list-items]");
  const listButtonElement = document.querySelector("[data-list-button]");

  if (filteredBooks.length < 1) {
    listMessageElement.classList.add("list__message_show");
  } else {
    listMessageElement.classList.remove("list__message_show");
  }

  listItemsElement.innerHTML = "";
  const newItems = document.createDocumentFragment();

  for (const { author, id, image, title } of filteredBooks.slice(
    0,
    BOOKS_PER_PAGE
  )) {
    const element = document.createElement("button");
    element.classList = "preview";
    element.setAttribute("data-preview", id);

    element.innerHTML = `
    <img class="preview__image" src="${image}" />
    <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${authors[author]}</div>
    </div>
  `;

    newItems.appendChild(element);
  }

  listItemsElement.appendChild(newItems);
  listButtonElement.disabled = filteredBooks.length - page * BOOKS_PER_PAGE < 1;

  listButtonElement.innerHTML = `
  <span>Show more</span>
  <span class="list__remaining"> (${
    filteredBooks.length - page * BOOKS_PER_PAGE > 0
      ? filteredBooks.length - page * BOOKS_PER_PAGE
      : 0
  })</span>
`;
}

/**
 * Scrolls to the top of the page.
 */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Closes the search overlay.
 */
function closeSearchOverlay() {
  document.querySelector("[data-search-overlay]").open = false;
}

// Add event listener to the search form submit event
document
  .querySelector("[data-search-form]")
  .addEventListener("submit", handleSearchFormSubmit);

/**
 * Creates a book preview element based on the book data.
 * @param {Object} book - The book object containing author, id, image, and title.
 * @returns {HTMLElement} - The created book preview element.
 */
function createBookPreviewElement({ author, id, image, title }) {
  const element = document.createElement("button");
  element.classList = "preview";
  element.setAttribute("data-preview", id);

  element.innerHTML = `
  <img
      class="preview__image"
      src="${image}"
  />

  <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${authors[author]}</div>
  </div>
`;

  return element;
}

/**
 * Handles the "show more" button click event and loads more books.
 */
function handleShowMoreButtonClick() {
  const fragment = document.createDocumentFragment();
  const startIndex = page * BOOKS_PER_PAGE;
  const endIndex = (page + 1) * BOOKS_PER_PAGE;

  for (const book of matches.slice(startIndex, endIndex)) {
    const previewElement = createBookPreviewElement(book);
    fragment.appendChild(previewElement);
  }

  document.querySelector("[data-list-items]").appendChild(fragment);
  page += 1;
}

// Add event listener to the "show more" button click event
document
  .querySelector("[data-list-button]")
  .addEventListener("click", handleShowMoreButtonClick);

/**
 * Finds the active book based on the clicked element.
 * @param {HTMLElement} clickedElement - The clicked element.
 * @returns {Object|null} - The active book object if found, or null.
 */
function findActiveBook(clickedElement) {
  const pathArray = Array.from(
    clickedElement.path || clickedElement.composedPath()
  );

  for (const node of pathArray) {
    if (node?.dataset?.preview) {
      const activeBook = books.find(
        (singleBook) => singleBook.id === node.dataset.preview
      );
      return activeBook;
    }
  }

  return null;
}

/**
 * Handles the click event on the book previews and displays the active book details.
 * @param {Event} event - The click event.
 */
function handleBookPreviewClick(event) {
  const activeBook = findActiveBook(event.target);

  if (activeBook) {
    const listActiveElement = document.querySelector("[data-list-active]");
    const listBlurElement = document.querySelector("[data-list-blur]");
    const listImageElement = document.querySelector("[data-list-image]");
    const listTitleElement = document.querySelector("[data-list-title]");
    const listSubtitleElement = document.querySelector("[data-list-subtitle]");
    const listDescriptionElement = document.querySelector(
      "[data-list-description]"
    );

    listActiveElement.open = true;
    listBlurElement.src = activeBook.image;
    listImageElement.src = activeBook.image;
    listTitleElement.innerText = activeBook.title;
    listSubtitleElement.innerText = `${authors[activeBook.author]} (${new Date(
      activeBook.published
    ).getFullYear()})`;
    listDescriptionElement.innerText = activeBook.description;
  }
}

// Add event listener to the book previews' click event
document
  .querySelector("[data-list-items]")
  .addEventListener("click", handleBookPreviewClick);
