// Catalog product data for search filtering and calculations
const products = [
  { id: 1, name: "Introduction to Computer Science (8th Ed)", category: "books", price: 35.00, elementId: "product-1" },
  { id: 2, name: "Wireless Noise-Canceling Headphones", category: "electronics", price: 50.00, elementId: "product-2" },
  { id: 3, name: "Compact Mini-Fridge (3.2 cu ft)", category: "housing", price: 80.00, elementId: "product-3" },
  { id: 4, name: "Ergonomic Mesh Desk Chair", category: "housing", price: 45.00, elementId: "product-4" }
];

document.addEventListener("DOMContentLoaded", () => {
  // --- CATALOG PAGE EVENT LISTENERS ---
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-select");

  if (searchInput) {
    searchInput.addEventListener("input", filterProducts);
  }

  if (categorySelect) {
    categorySelect.addEventListener("change", filterProducts);
  }

  // Attach quantity change listeners dynamically
  products.forEach(product => {
    const qtyInput = document.getElementById(`qty-${product.id}`);
    if (qtyInput) {
      qtyInput.addEventListener("input", () => {
        calculateItemTotal(product.id, product.price);
      });
    }
  });

  // --- REGISTRATION FORM EVENT LISTENERS (PART 3) ---
  const registerForm = document.getElementById("register-form");
  const togglePasswordBtn = document.getElementById("toggle-password-btn");

  // 1. Password Show/Hide Interactive Toggle
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", () => {
      const passwordInput = document.getElementById("password");
      const confirmPasswordInput = document.getElementById("confirm-password");

      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        confirmPasswordInput.type = "text";
        togglePasswordBtn.textContent = "Hide";
      } else {
        passwordInput.type = "password";
        confirmPasswordInput.type = "password";
        togglePasswordBtn.textContent = "Show";
      }
    });
  }

  // 2. Form Submission & Validation with event.preventDefault()
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegistration);
  }
});

/**
 * Handles registration form submission and runs validation rules
 */
function handleRegistration(event) {
  // Prevent page refresh on submit
  event.preventDefault();

  const fullName = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const messageBox = document.getElementById("form-message");

  // Email format regex pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Rule 1: Required Field Validation
  if (!fullName || !email || !password || !confirmPassword) {
    showMessage("Please fill in all required fields.", "error");
    return;
  }

  // Rule 2: Format Check (Email format validation)
  if (!emailPattern.test(email)) {
    showMessage("Please enter a valid email address (e.g., student@university.edu).", "error");
    return;
  }

  // Rule 3: Custom Rule (Password match check and length constraint)
  if (password.length < 6) {
    showMessage("Password must be at least 6 characters long.", "error");
    return;
  }

  if (password !== confirmPassword) {
    showMessage("Passwords do not match. Please check and try again.", "error");
    return;
  }

  // If all validation rules pass:
  showMessage("Registration successful! Welcome to CampusMarket.", "success");
  document.getElementById("register-form").reset();
}

/**
 * Helper to display dynamic feedback message box
 */
function showMessage(text, type) {
  const messageBox = document.getElementById("form-message");
  messageBox.textContent = text;
  messageBox.className = `message-box ${type}`;
  messageBox.style.display = "block";
}

/**
 * Catalog filtering algorithm
 */
function filterProducts() {
  const searchInput = document.getElementById("search-input").value.toLowerCase().trim();
  const selectedCategory = document.getElementById("category-select").value;

  for (const product of products) {
    const cardElement = document.getElementById(product.elementId);
    if (!cardElement) continue;

    const matchesSearch = product.name.toLowerCase().includes(searchInput);
    const matchesCategory = (selectedCategory === "all") || (product.category === selectedCategory);

    if (matchesSearch && matchesCategory) {
      cardElement.style.display = "flex";
    } else {
      cardElement.style.display = "none";
    }
  }
}

/**
 * Catalog quantity price calculation
 */
function calculateItemTotal(productId, unitPrice) {
  const quantityInput = document.getElementById(`qty-${productId}`);
  const totalDisplay = document.getElementById(`total-${productId}`);

  if (quantityInput && totalDisplay) {
    let quantity = parseInt(quantityInput.value, 10);

    if (isNaN(quantity) || quantity < 0) {
      quantity = 0;
      quantityInput.value = 0;
    }

    const grandTotal = quantity * unitPrice;
    totalDisplay.textContent = grandTotal.toFixed(2);
  }
}