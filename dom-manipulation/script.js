const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "Do what you can, with what you have, where you are.", category: "Life" }
];

const serverURL = "https://jsonplaceholder.typicode.com/posts"; // Mock API for simulation

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
    syncQuotes();
}

async function syncQuotes() {
    try {
        const response = await fetch(serverURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quotes)
        });
        const data = await response.json();
        console.log("Data synced with server:", data);
    } catch (error) {
        console.error("Sync failed:", error);
    }
}

async function fetchQuotesFromServer() {
    try {
        const response = await fetch(serverURL);
        const serverQuotes = await response.json();
        if (serverQuotes.length > quotes.length) {
            localStorage.setItem("quotes", JSON.stringify(serverQuotes));
            alert("New quotes have been updated from the server.");
            location.reload();
        }
    } catch (error) {
        console.error("Error fetching server data:", error);
    }
}

setInterval(fetchQuotesFromServer, 30000); // Check for updates every 30 seconds

function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const categories = [...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    const lastSelected = localStorage.getItem("selectedCategory") || "all";
    categoryFilter.value = lastSelected;
}

function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = "";
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
    filteredQuotes.forEach(q => {
        const p = document.createElement("p");
        p.innerHTML = `<strong>Category:</strong> ${q.category} - ${q.text}`;
        quoteDisplay.appendChild(p);
    });
}

function showRandomQuote() {
    if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        alert(quotes[randomIndex].text);
    } else {
        alert("No quotes available.");
    }
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

document.addEventListener("DOMContentLoaded", () => {
    addQuoteFormContainer();
    populateCategories();
    filterQuotes();
});

function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
    
    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes();
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        populateCategories();
        filterQuotes();
        alert("New quote added successfully!");
    } else {
        alert("Please enter both quote text and category.");
    }
}

function addQuoteFormContainer() {
    const container = document.createElement("div");
    container.innerHTML = `
        <select id="categoryFilter" onchange="filterQuotes()">
            <option value="all">All Categories</option>
        </select>
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
        <button onclick="exportToJson()">Export Quotes</button>
        <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
    `;
    document.body.appendChild(container);
}

function exportToJson() {
    const jsonData = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
}



