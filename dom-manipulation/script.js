//Quotes array
let quotes = [
    { text: "Never give up!", category: "Motivation"},
    { text: "Stay consistent and focused!", category: "Discipline" },
    { text: "Leaning is  a continous process!", category: "Education"}
];

// Load stored quotes
loadQuotes();

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

document.addEventListener("DOMContentLoaded", () => {
    populateCategories();
    showRandomQuote();
});

// Show a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.textContent = quotes[randomIndex].text;
}

function createAddQuoteForm() {
    const formContainer = document.getElementById("addQuoteFormContainer");
    formContainer.innerHTML = `
        <div>
            <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
            <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
            <button onclick="addQuote()">Add Quote</button>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", createAddQuoteForm);

// Add a new quote
function addQuote() {
    const text = document.getElementById("newQuoteText").value;
    const category = document.getElementById("newQuoteCategory").value;

    if (text && category) {
        quotes.push({ text, category });
        saveQuotes();
        populateCategories();
        alert("Quote added successfully!");
    }
}

// Populate category dropdown
document.getElementById("categoryFilter").addEventListener("change", filterQuotes);

// storage.js - Handle Local Storage

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
    const storedQuotes = localStorage.getItem("quotes");
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// filter.js - Filtering Functionality

function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    
    const categories = [...new Set(quotes.map(q => q.category))];
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const quoteDisplay = document.getElementById("quoteDisplay");
    
    if (selectedCategory === "all") {
        showRandomQuote();
    } else {
        const filteredQuotes = quotes.filter(q => q.category === selectedCategory);
        if (filteredQuotes.length > 0) {
            quoteDisplay.textContent = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text;
        } else {
            quoteDisplay.textContent = "No quotes in this category.";
        }
    }
}

// sync.js - Sync with Server (Mock API Placeholder)

async function syncQuotesWithServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts");
        const serverQuotes = await response.json();
        
        if (serverQuotes.length > 0) {
            quotes.push(...serverQuotes.map(q => ({ text: q.title, category: "Imported" })));
            saveQuotes();
            alert("Synced with server!");
        }
    } catch (error) {
        console.error("Error syncing with server:", error);
    }
}
