// Central Shared Data Source (Integration Rule 1)
const catalogData = [
  {
    id: 1,
    name: "Introduction to Computer Science (8th Ed)",
    category: "books",
    price: 35.00,
    elementId: "product-1",
    imgUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    altText: "Cover of Introduction to Computer Science 8th edition textbook"
  },
  {
    id: 2,
    name: "Wireless Noise-Canceling Headphones",
    category: "electronics",
    price: 50.00,
    elementId: "product-2",
    imgUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    altText: "Black wireless noise-canceling over-ear headphones"
  },
  {
    id: 3,
    name: "Compact Mini-Fridge (3.2 cu ft)",
    category: "housing",
    price: 80.00,
    elementId: "product-3",
    imgUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    altText: "Compact silver dorm room mini fridge with door closed"
  },
  {
    id: 4,
    name: "Ergonomic Mesh Desk Chair",
    category: "housing",
    price: 45.00,
    elementId: "product-4",
    imgUrl: "https://images.unsplash.com/photo-1580481072645-022f9a6d1270?auto=format&fit=crop&w=600&q=80",
    altText: "Black ergonomic mesh study desk chair with armrests"
  }
];

// State variables
let activeGalleryItems = [...catalogData];
let currentGalleryIndex = 0;

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Catalog & Gallery Page
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-select");

  if (searchInput && categorySelect) {
    searchInput.addEventListener("input", filterCatalogAndGallery);
    categorySelect.addEventListener("change", filterCatalogAndGallery);

    // Initial setup of gallery slideshow
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

  // Initialize Registration Page
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    setupRegistrationPage();
  }
});

/**
 * Part 1, Requirement 1: Filtered results drive what the gallery shows.
 * The filter function updates both product card displays AND the shared array driving the slideshow gallery.
 */
function filterCatalogAndGallery() {
  const searchVal = document.getElementById("search-input").value.toLowerCase().trim();
  const categoryVal = document.getElementById("category-select").value;

  activeGalleryItems = [];

  // Loop through items and evaluate matching criteria
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

  // Reset gallery pointer and refresh slideshow state
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
      // Wraparound calculation
      currentGalleryIndex = (currentGalleryIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
      updateGalleryDisplay();
    });

    nextBtn.addEventListener("click", () => {
      if (activeGalleryItems.length === 0) return;
      // Wraparound calculation
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
 * Invalid quantities fail validation and clear/exclude total cost safely.
 */
function handleValidatedCalculation(event, product) {
  const inputEl = event.target;
  const rawValue = inputEl.value.trim();
  const errorDisplay = document.getElementById(`calc-error-${product.id}`);
  const totalDisplay = document.getElementById(`total-${product.id}`);

  const parsedQty = Number(rawValue);

  // Validation Rule Checks
  if (rawValue === "" || isNaN(parsedQty)) {
    showCalcError(errorDisplay, "Please enter a valid numeric quantity.");
    totalDisplay.textContent = "0.00";
    return;
  }

  if (!Number.isInteger(parsedQty) || parsedQty < 0) {
    showCalcError(errorDisplay, "Quantity must be a positive whole number.");
    totalDisplay.textContent = "0.00";
    return;
  }

  // Clear errors and run calculation on valid input
  hideCalcError(errorDisplay);
  const grandTotal = parsedQty * product.price;
  totalDisplay.textContent = grandTotal.toFixed(2);
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

  // Show/Hide Password Toggle
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

  // Web 2.0 Live Dynamic Hint/Domain Indicator
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

  // Submit Handler
  form.addEventListener("submit", validateAndSubmitRegistration);
}

/**
 * Part 1, Requirements 3 & 4: Form Validation, Specific Errors, and Keyframes Confirmation Animation.
 */
function validateAndSubmitRegistration(event) {
  event.preventDefault(); // Prevent page reload

  const fullName = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const messageBox = document.getElementById("form-message");
  const formCard = document.getElementById("form-card");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation Rule 1: Required Fields
  if (!fullName) {
    displayFeedback(messageBox, "Full Name is required and cannot be left blank.", "error");
    return;
  }

  // Validation Rule 2: Email Format
  if (!email) {
    displayFeedback(messageBox, "Campus Email address is required.", "error");
    return;
  } else if (!emailPattern.test(email)) {
    displayFeedback(messageBox, "Campus Email must contain a valid format with an '@' symbol and a domain (e.g., name@university.ac.ke).", "error");
    return;
  }

  // Validation Rule 3: Custom Password Matching & Length
  if (password.length < 6) {
    displayFeedback(messageBox, "Password must contain at least 6 characters.", "error");
    return;
  }

  if (password !== confirmPassword) {
    displayFeedback(messageBox, "Password confirmation does not match the chosen password.", "error");
    return;
  }

  // --- Successful Action Confirmation (Requirement 3) ---
  displayFeedback(messageBox, "Registration successful! Welcome to CampusMarket.", "success");

  // Trigger CSS keyframe success animation on card via classList
  formCard.classList.remove("animate-pulse-success");
  void formCard.offsetWidth; // Force DOM reflow to re-trigger animation
  formCard.classList.add("animate-pulse-success");

  document.getElementById("register-form").reset();
  document.getElementById("email-web2-status").textContent = "";
}

/**
 * Part 1, Requirement 4: Animated smooth transition feedback display.
 */
function displayFeedback(box, text, type) {
  box.textContent = text;
  box.className = `message-box ${type} message-visible`;
}