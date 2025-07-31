function Book(title, author, pages, read) {
    if (!new.target) {
        throw Error("You must use the 'new' keyword to call the constructor.");
    }

    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;

    this.info = function () {
        return this.title + " by " + this.author + ", " + this.pages + " pages, " + (this.read? "already read." : "not read yet.");
    }
}

function addBook(title, author, pages, read) {
    let book = new Book(title, author, pages, read);
    myLibrary.push(book);
}

function removeBook(book_card, remove_book_btn) { // remove the book from the DOM and the library array
    if (book_card.getAttribute("data-book-id") == remove_book_btn.getAttribute("data-book-id")) {
        let bookID = book_card.getAttribute("data-book-id"); // the book in the library can be accessed through its ID. The DOM elements for the book (book_card...etc) are associated with the book with the data-book-id attribute.
        book_card.parentNode.removeChild(book_card);
        for (const book of myLibrary) {
            if (book.id == bookID) {
                myLibrary.splice(myLibrary.indexOf(book), 1);
            }
        }
    }
}

function displayBooks(library) {
    container.innerHTML = ''; // hide all current books. Not using this would display duplicates
    let book_card;
    let remove_book;
    let change_status;
    for (const book of library) {
        book_card = document.createElement("div");
        book_card.setAttribute("class", "book-card");
        book_card.setAttribute("data-book-id", book.id);
        book_card.textContent = book.info();
        
        remove_book = document.createElement("button");
        remove_book.setAttribute("class", "remove-book");
        remove_book.setAttribute("data-book-id", book.id);
        remove_book.textContent = "Remove Book";

        change_status = document.createElement("button");
        change_status.setAttribute("class", "change-status");
        change_status.setAttribute("data-book-id", book.id);
        change_status.textContent = "Change Status";

        book_card.appendChild(change_status);
        book_card.appendChild(remove_book);
        container.appendChild(book_card);
    }
}

function selectCurrentBooks() { // reselect the current books displayed in the DOM.
    book_cards = document.querySelectorAll(".book-card");
    remove_book_btns = document.querySelectorAll(".remove-book");
}

const myLibrary = [];
const container = document.querySelector(".container");
const new_book_open = document.querySelector("#new-book-button");
const new_book_dialog = document.querySelector("#new-book-dialog");
const new_book_form = document.querySelector("#new-book-dialog form");
const new_book_close = document.querySelector("#new-book-dialog > button");
const new_book_submit = document.querySelector('#new-book-dialog button[type="submit"]');
let book_cards = document.querySelectorAll(".book-card"); // initial selection of .book_card divs
let remove_book_btns = document.querySelectorAll(".remove-book"); // initial selection of .remove-book buttons

new_book_open.addEventListener("click", () => {
    new_book_dialog.showModal();
});

/* Another method to access form data (if method="dialog" not set)
new_book_form.onsubmit = function(e) {
    e.preventDefault();
    console.log(new_book_form.title.value);
    new_book_dialog.close();
}
*/

/* Another method to access form data (if method="dialog" not set) | the form DOM selection needs to be declared here instead
new_book_submit.addEventListener("click", (e) => {
    e.preventDefault();
    const new_book_form = new FormData(document.querySelector("#new-book-dialog form"));
    console.log(new_book_form.get("title"));
    new_book_dialog.close();
});
*/

new_book_submit.addEventListener("click", () => {
    addBook(new_book_form.title.value, new_book_form.author.value, new_book_form.pages.value, new_book_form.read.value);
    displayBooks(myLibrary); // re-displaying
    selectCurrentBooks(); // re-selection

    remove_book_btns.forEach((remove_book_btn) => {
        remove_book_btn.addEventListener("click", () => {
            book_cards.forEach((book_card) => removeBook(book_card, remove_book_btn));
        });
    });
});

new_book_close.addEventListener("click", () => {
    new_book_dialog.close();
}); 