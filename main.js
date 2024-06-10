document.addEventListener("DOMContentLoaded", function () {
    const BOOKS_KEY = "books";

    const bookshelf = {
        incomplete: document.getElementById("incompleteBookshelfList"),
        complete: document.getElementById("completeBookshelfList"),
    };

    function updateStorage(books) {
        localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    }

    function getBooks() {
        return JSON.parse(localStorage.getItem(BOOKS_KEY)) || [];
    }

    function generateBookItem(book) {
        const bookItem = document.createElement("article");
        bookItem.classList.add("book_item");
        bookItem.innerHTML = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
        <div class="action">
          <button class="green">${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}</button>
          <button class="red">Hapus buku</button>
          <button class="blue">Edit buku</button>
        </div>
      `;
        const toggleButton = bookItem.querySelector(".action button.green");
        const deleteButton = bookItem.querySelector(".action button.red");
        const editButton = bookItem.querySelector(".action button.blue");

        toggleButton.addEventListener("click", function () {
            toggleBookStatus(book);
        });

        deleteButton.addEventListener("click", function () {
            deleteBook(book);
        });

        editButton.addEventListener("click", function () {
            editBook(book);
        });

        return bookItem;
    }

    function renderBooks(books) {
        bookshelf.incomplete.innerHTML = "";
        bookshelf.complete.innerHTML = "";

        books.forEach((book) => {
            const bookItem = generateBookItem(book);
            if (book.isComplete) {
                bookshelf.complete.appendChild(bookItem);
            } else {
                bookshelf.incomplete.appendChild(bookItem);
            }
        });
    }

    function addBook(title, author, year, isComplete) {
        const books = getBooks();
        const newBook = {
            id: +new Date(),
            title,
            author,
            year: parseInt(year), 
            isComplete,
        };
        books.push(newBook);
        updateStorage(books);
        renderBooks(books);
    }

    function toggleBookStatus(book) {
        const books = getBooks();
        const index = books.findIndex((item) => item.id === book.id);
        books[index].isComplete = !book.isComplete;
        updateStorage(books);
        renderBooks(books);
    }

    function deleteBook(book) {
        const books = getBooks().filter((item) => item.id !== book.id);
        updateStorage(books);
        renderBooks(books);
    }

    function editBook(book) {
        const newTitle = prompt("Masukkan judul baru:", book.title);
        const newAuthor = prompt("Masukkan penulis baru:", book.author);
        const newYear = prompt("Masukkan tahun baru:", book.year);

        if (newTitle !== null && newAuthor !== null && newYear !== null) {
            const books = getBooks();
            const index = books.findIndex((item) => item.id === book.id);
            books[index].title = newTitle;
            books[index].author = newAuthor;
            books[index].year = parseInt(newYear); 
            updateStorage(books);
            renderBooks(books);
        }
    }

    const inputBookForm = document.getElementById("inputBook");
    inputBookForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const title = document.getElementById("inputBookTitle").value;
        const author = document.getElementById("inputBookAuthor").value;
        const year = document.getElementById("inputBookYear").value;
        const isComplete = document.getElementById("inputBookIsComplete").checked;

        addBook(title, author, year, isComplete);

        inputBookForm.reset();
    });

    const searchForm = document.getElementById("searchBook");
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
        const books = getBooks();
        const filteredBooks = books.filter((book) => book.title.toLowerCase().includes(searchTitle));
        renderBooks(filteredBooks);
    });

    renderBooks(getBooks());
});
