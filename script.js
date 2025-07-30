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