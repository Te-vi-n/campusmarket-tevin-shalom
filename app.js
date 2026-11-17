// Central Shared Data Source - Now populated dynamically via fetch (Assignment 5)
let catalogData = [];

// State variables for Assignment 4 gallery
let activeGalleryItems = [];
let currentGalleryIndex = 0;

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Initialize Registration Page (Independent of product fetch)
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    setupRegistrationPage();
  }

  // 2. Initialize Catalog & Gallery Page with Live Fetch (Assignment 5)
  const productGrid = document.getElementById("product-grid");
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-select");

  if (productGrid) {
    await loadCatalogProducts(productGrid, searchInput, categorySelect);
  }
  console.log("App script loaded and DOM is ready!");
});

/**
 * Assignment 5: Asynchronous Fetch, Loading State, and Error Handling
 */
async function loadCatalogProducts(productGrid, searchInput, categorySelect) {
  // 4. Real loading state
  productGrid.innerHTML = '<p class="loading-msg">Loading products...</p>';

  try {
    const response = await fetch("products.json");

    // 3. Check response.ok
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    catalogData = await response.json();
    activeGalleryItems = [...catalogData];

    // Build product cards dynamically in the DOM
    renderProductCards(catalogData, productGrid);

    // Setup filters, gallery, and calculations once data is loaded
    if (searchInput && categorySelect) {
      searchInput.addEventListener("input", filterCatalogAndGallery);
      categorySelect.addEventListener("change", filterCatalogAndGallery);

      setupGalleryControls();
      updateGalleryDisplay();

      // Attach listeners for quantity inputs
      catalogData.forEach(item => {
        const qtyInput = document.getElementById(`qty-${item.id}`);
        if (qtyInput) {
          qtyInput.addEventListener("input", (e) => handleValidatedCalculation(e, item));
        }
      });
    }

  } catch (error) {
    console.error("Fetch failed:", error);
    // 3. Graceful failure state (page doesn't break)
    productGrid.innerHTML = `
      <div class="error-container">
        <p class="error-msg">⚠️ Unable to load products at this moment. Please check back later.</p>
      </div>
    `;
  }
}

/**
 * Dynamically builds product cards using DOM methods (Assignment 5 requirement)
 */
function renderProductCards(products, gridContainer) {
  gridContainer.innerHTML = "";

  if (products.length === 0) {
    gridContainer.innerHTML = '<p class="no-results">No products found.</p>';
    return;
  }

  products.forEach(item => {
    const card = document.createElement("div");
    card.id = item.elementId;
    card.className = "product-card"; // Keep your existing CSS class

    card.innerHTML = `
      <img src="${item.imgUrl}" alt="${item.altText}">
      <div class="product-info">
        <h3>${item.name}</h3>
        <p class="category">Category: ${item.category}</p>
        <p class="price">$${item.price.toFixed(2)}</p>
        <div class="calc-section">
          <label for="qty-${item.id}">Quantity:</label>
          <input type="number" id="qty-${item.id}" class="qty-input" min="0" placeholder="0">
          <span id="calc-error-${item.id}" class="calc-error"></span>
          <p>Total: $<span id="total-${item.id}">0.00</span></p>
        </div>
      </div>
    `;

    gridContainer.appendChild(card);
  });
}

/**
 * Part 1, Requirement 1: Filtered results drive what the gallery shows.
 */
function filterCatalogAndGallery() {
  const searchVal = document.getElementById("search-input").value.toLowerCase().trim();
  const categoryVal = document.getElementById("category-select").value;

  activeGalleryItems = [];

  for (const item of catalogData) {
    const cardElement = document.getElementById(item.elementId);
    const matchesSearch = item.name.toLowerCase().includes(searchVal);
    const matchesCategory = (categoryVal === "all") || (item.category === categoryVal);

    if (matchesSearch && matchesCategory) {
      if (cardElement) cardElement.style.display = "flex";
      activeGalleryItems.push(item);
    } else {
      if (cardElement) cardElement.style.display = "none";
    }
  }

  currentGalleryIndex = 0;
  updateGalleryDisplay();
}

/**
 * Setup Slideshow Navigation
 */
function setupGalleryControls() {
  const prevBtn = document.getElementById("prev-slide-btn");
  const nextBtn = document.getElementById("next-slide-btn");

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      if (activeGalleryItems.length === 0) return;
      currentGalleryIndex = (currentGalleryIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
      updateGalleryDisplay();
    });

    nextBtn.addEventListener("click", () => {
      if (activeGalleryItems.length === 0) return;
      currentGalleryIndex = (currentGalleryIndex + 1) % activeGalleryItems.length;
      updateGalleryDisplay();
    });
  }
}

/**
 * Updates slideshow display based on active filtered subset
 */
function updateGalleryDisplay() {
  const imgEl = document.getElementById("gallery-image");
  const titleEl = document.getElementById("gallery-title");
  const priceEl = document.getElementById("gallery-price");
  const statusEl = document.getElementById("gallery-status");

  if (!imgEl || !titleEl || !priceEl || !statusEl) return;

  if (activeGalleryItems.length === 0) {
    imgEl.src = "https://via.placeholder.com/600x350?text=No+Matching+Items";
    imgEl.alt = "No matching products found";
    titleEl.textContent = "No products found";
    priceEl.textContent = "$0.00";
    statusEl.textContent = "Showing 0 of 0 items";
    return;
  }

  const currentItem = activeGalleryItems[currentGalleryIndex];
  imgEl.src = currentItem.imgUrl;
  imgEl.alt = currentItem.altText;
  titleEl.textContent = currentItem.name;
  priceEl.textContent = `$${currentItem.price.toFixed(2)}`;
  statusEl.textContent = `Showing item ${currentGalleryIndex + 1} of ${activeGalleryItems.length}`;
}

/**
 * Part 1, Requirement 2: Calculations respond to real, validated input.
 */
function handleValidatedCalculation(event, product) {
  const inputEl = event.target;
  const rawValue = inputEl.value.trim();
  const errorDisplay = document.getElementById(`calc-error-${product.id}`);
  const totalDisplay = document.getElementById(`total-${product.id}`);

  const parsedQty = Number(rawValue);

  if (rawValue === "" || isNaN(parsedQty)) {
    showCalcError(errorDisplay, "Please enter a valid numeric quantity.");
    if (totalDisplay) totalDisplay.textContent = "0.00";
    return;
  }

  if (!Number.isInteger(parsedQty) || parsedQty < 0) {
    showCalcError(errorDisplay, "Quantity must be a positive whole number.");
    if (totalDisplay) totalDisplay.textContent = "0.00";
    return;
  }

  hideCalcError(errorDisplay);
  const grandTotal = parsedQty * product.price;
  if (totalDisplay) totalDisplay.textContent = grandTotal.toFixed(2);
}

function showCalcError(element, message) {
  if (!element) return;
  element.textContent = message;
  element.classList.add("error-visible");
}

function hideCalcError(element) {
  if (!element) return;
  element.textContent = "";
  element.classList.remove("error-visible");
}

/**
 * Registration Page Setup and Handling
 */
function setupRegistrationPage() {
  const form = document.getElementById("register-form");
  const toggleBtn = document.getElementById("toggle-password-btn");
  const emailInput = document.getElementById("email");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const pwdInput = document.getElementById("password");
      const confirmInput = document.getElementById("confirm-password");
      const isPwd = pwdInput.type === "password";

      pwdInput.type = isPwd ? "text" : "password";
      confirmInput.type = isPwd ? "text" : "password";
      toggleBtn.textContent = isPwd ? "Hide" : "Show";
    });
  }

  if (emailInput) {
    emailInput.addEventListener("input", () => {
      const statusHint = document.getElementById("email-web2-status");
      const value = emailInput.value.trim();

      if (value.includes("@") && (value.endsWith(".edu") || value.endsWith(".ac.ke"))) {
        statusHint.textContent = "✔ Verified student educational domain detected";
        statusHint.className = "web2-status-hint valid";
      } else if (value.includes("@")) {
        statusHint.textContent = "ℹ General email domain (campus domain recommended)";
        statusHint.className = "web2-status-hint info";
      } else {
        statusHint.textContent = "";
      }
    });
  }

  form.addEventListener("submit", validateAndSubmitRegistration);
}

/**
 * Form Validation, Specific Errors, and Keyframes Confirmation Animation.
 */
function validateAndSubmitRegistration(event) {
  event.preventDefault();

  const fullName = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const messageBox = document.getElementById("form-message");
  const formCard = document.getElementById("form-card");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!fullName) {
    displayFeedback(messageBox, "Full Name is required and cannot be left blank.", "error");
    return;
  }

  if (!email) {
    displayFeedback(messageBox, "Campus Email address is required.", "error");
    return;
  } else if (!emailPattern.test(email)) {
    displayFeedback(messageBox, "Campus Email must contain a valid format with an '@' symbol and a domain (e.g., name@university.ac.ke).", "error");
    return;
  }

  if (password.length < 6) {
    displayFeedback(messageBox, "Password must contain at least 6 characters.", "error");
    return;
  }

  if (password !== confirmPassword) {
    displayFeedback(messageBox, "Password confirmation does not match the chosen password.", "error");
    return;
  }

  displayFeedback(messageBox, "Registration successful! Welcome to CampusMarket.", "success");

  if (formCard) {
    formCard.classList.remove("animate-pulse-success");
    void formCard.offsetWidth;
    formCard.classList.add("animate-pulse-success");
  }

  document.getElementById("register-form").reset();
  const statusHint = document.getElementById("email-web2-status");
  if (statusHint) statusHint.textContent = "";
}

function displayFeedback(box, text, type) {
  if (!box) return;
  box.textContent = text;
  box.className = `message-box ${type} message-visible`;
}