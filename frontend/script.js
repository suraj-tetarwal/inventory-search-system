const searchInput = document.getElementById("productSearch");
const categorySelect = document.getElementById("categoryFilter");
const minPriceInput = document.getElementById("minPrice");
const maxPriceInput = document.getElementById("maxPrice");

const form = document.getElementById("searchForm");

const resultsContainer = document.getElementById("resultsContainer");
const resultsBody = document.getElementById("resultsBody");
const resultCount = document.getElementById("resultCount");

const loadingSpinner = document.getElementById("loadingSpinner");
const noResults = document.getElementById("noResults");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");

const BASE_URL = "https://inventory-search-system-fe1e.onrender.com";

// hide all state containers 
function hideAll() {
  resultsContainer.style.display = "none";
  loadingSpinner.style.display = "none";
  noResults.style.display = "none";
  errorMessage.style.display = "none";
}

// render data in table
function render(data) {
  resultsBody.innerHTML = "";

  data.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="results-table-body-cell">${item.productName}</td>
      <td class="results-table-body-cell">${item.category}</td>
      <td class="results-table-body-cell">₹${item.price}</td>
      <td class="results-table-body-cell">${item.supplier}</td>
    `;

    row.classList.add("results-table-row");

    resultsBody.appendChild(row);
  });

  resultCount.textContent = data.length + " results found";
  resultsContainer.style.display = "block";
}

// fetch data from backend based on filters
async function fetchData() {
  hideAll();
  loadingSpinner.style.display = "block";

  try {
    let url = BASE_URL + "/search?";

    const q = searchInput.value.trim();
    const category = categorySelect.value;
    const minPrice = minPriceInput.value;
    const maxPrice = maxPriceInput.value;

    if (q) url += `q=${q}&`;
    if (category) url += `category=${category}&`;
    if (minPrice) url += `minPrice=${minPrice}&`;
    if (maxPrice) url += `maxPrice=${maxPrice}`;

    const response = await fetch(url);
    const data = await response.json();

    loadingSpinner.style.display = "none";

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    if (data.length === 0) {
      noResults.style.display = "block";
      return;
    }

    render(data);

  } catch (error) {
    loadingSpinner.style.display = "none";
    errorMessage.style.display = "block";
    errorText.textContent = error.message;
  }
}

// add event listener to form submit
form.addEventListener("submit", function (e) {
  e.preventDefault();
  fetchData();
});

// add event listener to form reset
form.addEventListener("reset", function () {
  hideAll();
  fetchData();
});

// fetch initial data on page load
fetchData();