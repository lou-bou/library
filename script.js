class Book {
    id;
    title;
    author;
    pages;
    read;

    constructor(title, author, pages, read) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    getInfo() {
        return this.title + " by " + this.author + ", " + this.pages + " pages, " + (this.read? "already read." : "not read yet.");
    }
}

Book.prototype.toggleStatus = function() {
    if (this.read) {
        this.read = false;
    } else {
        this.read = true;
    }
}

function addBook(title, author, pages, read) {
    if (read == "true") { // the form sends the read value (true/false) as a string not a boolean
        read = true;
    } else {
        read = false;
    }
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

function interpretReadBool(book) {
    if (book.read) {
        return "Read";
    } else {
        return "Unread";
    }
}

function changeStatus(book_card, change_status_btn) {
    if (book_card.getAttribute("data-book-id") == change_status_btn.getAttribute("data-book-id")) {
        let bookID = book_card.getAttribute("data-book-id");
        const book_info = document.querySelector(`.book-info[data-book-id="${bookID}"]`);
        for (const book of myLibrary) {
            if (book.id == bookID) {
                book.toggleStatus();
                change_status_btn.setAttribute("data-book-read", interpretReadBool(book));
                change_status_btn.textContent = interpretReadBool(book);
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

        book_info = document.createElement("div");
        book_info.setAttribute("class", "book-info");
        book_info.setAttribute("data-book-id", book.id);
        
        book_title = document.createElement("p");
        book_title.textContent = `"${book.title}"`;

        book_author = document.createElement("p");
        book_author.textContent = "by " + book.author;

        book_pages = document.createElement("p");
        book_pages.textContent = book.pages + " pages";

        book_info.appendChild(book_title);
        book_info.appendChild(book_author);
        book_info.appendChild(book_pages);
        
        remove_book = document.createElement("button");
        remove_book.setAttribute("class", "remove-book");
        remove_book.setAttribute("data-book-id", book.id);
        remove_book.textContent = "Remove Book";

        change_status = document.createElement("button");
        change_status.setAttribute("class", "change-status");
        change_status.setAttribute("data-book-id", book.id);
        change_status.setAttribute("data-book-read", interpretReadBool(book));
        change_status.textContent = interpretReadBool(book);

        book_card.appendChild(book_info);
        book_card.appendChild(change_status);
        book_card.appendChild(remove_book);
        container.appendChild(book_card);
    }
}

function selectCurrentBooks() { // reselect the current books displayed in the DOM.
    book_cards = document.querySelectorAll(".book-card");
    remove_book_btns = document.querySelectorAll(".remove-book");
    change_status_btns = document.querySelectorAll(".change-status");
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
let change_status_btns = document.querySelectorAll(".change-status"); // initial selection of .change-status buttons
// for the 3 previous DOM selectors, by default there should be no elements to select initially

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
    let new_title = new_book_form.title.value;
    let new_author = new_book_form.author.value;
    let new_pages = new_book_form.pages.value;
    let new_read = new_book_form.read.value;
    if (new_title && new_author && new_pages && new_read) {
        addBook(new_book_form.title.value, new_book_form.author.value, new_book_form.pages.value, new_book_form.read.value);
        displayBooks(myLibrary); // re-displaying all books to display the new book
        selectCurrentBooks(); // re-selection of all book DOM elements to select the new book

        remove_book_btns.forEach((remove_book_btn) => {
            remove_book_btn.addEventListener("click", () => {
                book_cards.forEach((book_card) => removeBook(book_card, remove_book_btn));
            });
        });

        change_status_btns.forEach((change_status_btn) => {
            change_status_btn.addEventListener("click", () => {
                book_cards.forEach((book_card) => changeStatus(book_card, change_status_btn));
            });
        });

        /* Another method (a better one) for the remove and change status functionalities, better than hard-coding eventlisteners for newly created DOM elements

        Original message: https://discord.com/channels/505093832157691914/690590001486102589/1400407766669066285

        document.addEventListener('click', function(e){ // or someDiv.addEventListener(...)
            e.preventDefault();
            if (e.target.classList[someIndex] === someClassName) {...}//do smth
            // or
            if (e.target.id === someID){...} // do smth
        });
        */
    }
    
});

new_book_close.addEventListener("click", () => {
    new_book_dialog.close();
}); 