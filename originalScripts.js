//   /**
//  * CHANGES:
//  * made names more descriptive (element became genreOption)
//  */

// ////@ts-check

// // imports data from data.js
// import { books, authors, genres, BOOKS_PER_PAGE } from "./data.js";

// // initializes page and matches
// let page = 1;
// let matches = books;

// // creates document fragment to hold starting book previews
// const starting = document.createDocumentFragment();

// for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
//   const element = document.createElement("button");
//   element.classList = "preview";
//   element.setAttribute("data-preview", id);

//   element.innerHTML = `
//         <imgS
//             class="preview__image"
//             src="${image}"
//         />

//         <div class="preview__info">
//             <h3 class="preview__title">${title}</h3>
//             <div class="preview__author">${authors[author]}</div>
//         </div>
//     `;

//   starting.appendChild(element);
// }

// // appends the starting book previews to the document body
// document.querySelector("[data-list-items]").appendChild(starting);

// // creates a document fragment to hold genre options
// const genreHtml = document.createDocumentFragment();

// // creates an option for "all genres"
// const firstGenreElement = document.createElement("option");
// firstGenreElement.value = "any";
// firstGenreElement.innerText = "All Genres";
// genreHtml.appendChild(firstGenreElement);

// //renders options for each genre
// for (const [id, name] of Object.entries(genres)) {
//   const genreOption = document.createElement("option");
//   genreOption.value = id;
//   genreOption.innerText = name;
//   genreHtml.appendChild(genreOption);
// }

// // appends genre options to search genres element
// document.querySelector("[data-search-genres]").appendChild(genreHtml);

// // creates document fragment to hold author options
// const authorsHtml = document.createDocumentFragment();

// // creates an option for "all authors"
// const firstAuthorElement = document.createElement("option");
// firstAuthorElement.value = "any";
// firstAuthorElement.innerText = "All Authors";
// authorsHtml.appendChild(firstAuthorElement);

// // renders options for each author
// for (const [id, name] of Object.entries(authors)) {
//   const element = document.createElement("option");
//   element.value = id;
//   element.innerText = name;
//   authorsHtml.appendChild(element);
// }

// // appends author options to search authors element
// document.querySelector("[data-search-authors]").appendChild(authorsHtml);

// // checks the user's preferred color scheme and sets the theme accordingly
// if (
//   window.matchMedia &&
//   window.matchMedia("(prefers-color-scheme: dark)").matches
// ) {
//   // sets theme to night and update color variables for dark mode
//   document.querySelector("[data-settings-theme]").value = "night";
//   document.documentElement.style.setProperty("--color-dark", "255, 255, 255");
//   document.documentElement.style.setProperty("--color-light", "10, 10, 20");
// } else {
//   // sets theme to day and update color variables for light mode
//   document.querySelector("[data-settings-theme]").value = "day";
//   document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
//   document.documentElement.style.setProperty("--color-light", "255, 255, 255");
// }

// // updates "show more" button text and disables it if there's no more books to show
// document.querySelector("[data-list-button]").innerText = `Show more (${
//   books.length - BOOKS_PER_PAGE
// })`;
// document.querySelector("[data-list-button]").disabled =
//   matches.length - page * BOOKS_PER_PAGE > 0;

// // updates "show more" button HTML with remaining books count
// document.querySelector("[data-list-button]").innerHTML = `
//     <span>Show more</span>
//     <span class="list__remaining"> (${
//       matches.length - page * BOOKS_PER_PAGE > 0
//         ? matches.length - page * BOOKS_PER_PAGE
//         : 0
//     })</span>
// `;

// // add event listener to hide the search overlay when the cancel button is clicked
// document.querySelector("[data-search-cancel]").addEventListener("click", () => {
//   document.querySelector("[data-search-overlay]").open = false;
// });

// // adds event listener to hide settings overlay when the cancel button is clicked
// document
//   .querySelector("[data-settings-cancel]")
//   .addEventListener("click", () => {
//     document.querySelector("[data-settings-overlay]").open = false;
//   });
// // adds event listener to hide search overlay when the search button is clicked
// document.querySelector("[data-header-search]").addEventListener("click", () => {
//   document.querySelector("[data-search-overlay]").open = true;
//   document.querySelector("[data-search-title]").focus();
// });
// // adds event listener to show the settings overlay when the settings button is clicked
// document
//   .querySelector("[data-header-settings]")
//   .addEventListener("click", () => {
//     document.querySelector("[data-settings-overlay]").open = true;
//   });

// // adds event listener to active list when the close button is clicked
// document.querySelector("[data-list-close]").addEventListener("click", () => {
//   document.querySelector("[data-list-active]").open = false;
// });

// // add event listener to the settings form for theme selection and update color variables accordingly
// document
//   .querySelector("[data-settings-form]")
//   .addEventListener("submit", (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     const { theme } = Object.fromEntries(formData);

//     if (theme === "night") {
//       document.documentElement.style.setProperty(
//         "--color-dark",
//         "255, 255, 255"
//       );
//       document.documentElement.style.setProperty("--color-light", "10, 10, 20");
//     } else {
//       document.documentElement.style.setProperty("--color-dark", "10, 10, 20");
//       document.documentElement.style.setProperty(
//         "--color-light",
//         "255, 255, 255"
//       );
//     }

//     document.querySelector("[data-settings-overlay]").open = false;
//   });

// document
//   .querySelector("[data-search-form]")
//   .addEventListener("submit", (event) => {
//     event.preventDefault();
//     const formData = new FormData(event.target);
//     const filters = Object.fromEntries(formData);
//     const result = [];

//     for (const book of books) {
//       let genreMatch = filters.genre === "any";

//       for (const singleGenre of book.genres) {
//         if (genreMatch) break;
//         if (singleGenre === filters.genre) {
//           genreMatch = true;
//         }
//       }

//       if (
//         (filters.title.trim() === "" ||
//           book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
//         (filters.author === "any" || book.author === filters.author) &&
//         genreMatch
//       ) {
//         result.push(book);
//       }
//     }

//     page = 1;
//     matches = result;

//     if (result.length < 1) {
//       document
//         .querySelector("[data-list-message]")
//         .classList.add("list__message_show");
//     } else {
//       document
//         .querySelector("[data-list-message]")
//         .classList.remove("list__message_show");
//     }

//     document.querySelector("[data-list-items]").innerHTML = "";
//     const newItems = document.createDocumentFragment();

//     for (const { author, id, image, title } of result.slice(
//       0,
//       BOOKS_PER_PAGE
//     )) {
//       const element = document.createElement("button");
//       element.classList = "preview";
//       element.setAttribute("data-preview", id);

//       element.innerHTML = `
//             <img
//                 class="preview__image"
//                 src="${image}"
//             />

//             <div class="preview__info">
//                 <h3 class="preview__title">${title}</h3>
//                 <div class="preview__author">${authors[author]}</div>
//             </div>
//         `;

//       newItems.appendChild(element);
//     }

//     document.querySelector("[data-list-items]").appendChild(newItems);
//     document.querySelector("[data-list-button]").disabled =
//       matches.length - page * BOOKS_PER_PAGE < 1;

//     document.querySelector("[data-list-button]").innerHTML = `
//         <span>Show more</span>
//         <span class="list__remaining"> (${
//           matches.length - page * BOOKS_PER_PAGE > 0
//             ? matches.length - page * BOOKS_PER_PAGE
//             : 0
//         })</span>
//     `;

//     window.scrollTo({ top: 0, behavior: "smooth" });
//     document.querySelector("[data-search-overlay]").open = false;
//   });

// document.querySelector("[data-list-button]").addEventListener("click", () => {
//   const fragment = document.createDocumentFragment();

//   for (const { author, id, image, title } of matches.slice(
//     page * BOOKS_PER_PAGE,
//     (page + 1) * BOOKS_PER_PAGE
//   )) {
//     const element = document.createElement("button");
//     element.classList = "preview";
//     element.setAttribute("data-preview", id);

//     element.innerHTML = `
//             <img
//                 class="preview__image"
//                 src="${image}"
//             />

//             <div class="preview__info">
//                 <h3 class="preview__title">${title}</h3>
//                 <div class="preview__author">${authors[author]}</div>
//             </div>
//         `;

//     fragment.appendChild(element);
//   }

//   document.querySelector("[data-list-items]").appendChild(fragment);
//   page += 1;
// });

// document
//   .querySelector("[data-list-items]")
//   .addEventListener("click", (event) => {
//     const pathArray = Array.from(event.path || event.composedPath());
//     let active = null;

//     for (const node of pathArray) {
//       if (active) break;

//       if (node?.dataset?.preview) {
//         let result = null;

//         for (const singleBook of books) {
//           if (result) break;
//           if (singleBook.id === node?.dataset?.preview) result = singleBook;
//         }

//         active = result;
//       }
//     }

//     if (active) {
//       document.querySelector("[data-list-active]").open = true;
//       document.querySelector("[data-list-blur]").src = active.image;
//       document.querySelector("[data-list-image]").src = active.image;
//       document.querySelector("[data-list-title]").innerText = active.title;
//       document.querySelector("[data-list-subtitle]").innerText = `${
//         authors[active.author]
//       } (${new Date(active.published).getFullYear()})`;
//       document.querySelector("[data-list-description]").innerText =
//         active.description;
//     }
//   });
