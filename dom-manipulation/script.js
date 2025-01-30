const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
    { text: "Do what you can, with what you have, where you are.", category: "Life" }
];

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

function showRandomQuote() {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p><strong>Category:</strong> ${randomQuote.category}</p><p>${randomQuote.text}</p>`;
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

function addQuote() {
    const newQuoteText = document.getElementById("newQuoteText").value.trim();
    const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();
    
    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        saveQuotes();
        document.getElementById("newQuoteText").value = "";
        document.getElementById("newQuoteCategory").value = "";
        alert("New quote added successfully!");
    } else {
        alert("Please enter both quote text and category.");
    }
}

function addQuoteFormContainer() {
    const container = document.createElement("div");
    container.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button onclick="addQuote()">Add Quote</button>
        <button onclick="exportToJson()">Export Quotes</button>
        <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
    `;
    document.body.appendChild(container);
}

document.addEventListener("DOMContentLoaded", addQuoteFormContainer);

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
        alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
}
