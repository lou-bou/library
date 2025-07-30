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

function displayBooks(library) {
    let book_card;
    for (const book of library) {
        book_card = document.createElement("div");
        book_card.classList.add = "book-card";
        book_card.textContent = book.info();
        container.appendChild(book_card);
    }
}

const myLibrary = [];
const container = document.querySelector(".container");
const new_book_open = document.querySelector("#new-book-button");
const new_book_dialog = document.querySelector("#new-book-dialog");
const new_book_form = document.querySelector("#new-book-dialog form");
const new_book_close = document.querySelector("#new-book-dialog > button");
const new_book_submit = document.querySelector('#new-book-dialog button[type="submit"]');

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
});

new_book_close.addEventListener("click", () => {
    new_book_dialog.close();
});