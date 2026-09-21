// Product data array for filtering and calculations
const products = [
  {
    id: 1,
    name: "Introduction to Computer Science (8th Ed)",
    category: "books",
    price: 35.00,
    elementId: "product-1"
  },
  {
    id: 2,
    name: "Wireless Noise-Canceling Headphones",
    category: "electronics",
    price: 50.00,
    elementId: "product-2"
  },
  {
    id: 3,
    name: "Compact Mini-Fridge (3.2 cu ft)",
    category: "housing",
    price: 80.00,
    elementId: "product-3"
  },
  {
    id: 4,
    name: "Ergonomic Mesh Desk Chair",
    category: "housing",
    price: 45.00,
    elementId: "product-4"
  }
];

/**
 * Filters visible products based on search input and selected category.
 * Demonstrates: Loop (for...of) and Decision Making (if/else).
 */
function filterProducts() {
  const searchInput = document.getElementById("search-input").value.toLowerCase().trim();
  const selectedCategory = document.getElementById("category-select").value;

  // Loop through all products in our catalog array
  for (const product of products) {
    const cardElement = document.getElementById(product.elementId);

    if (!cardElement) continue;

    // Condition 1: Check if product name matches search keyword
    const matchesSearch = product.name.toLowerCase().includes(searchInput);

    // Condition 2: Check if category matches selection ("all" shows everything)
    const matchesCategory = (selectedCategory === "all") || (product.category === selectedCategory);

    // Decision: If both conditions pass, display card; otherwise hide it
    if (matchesSearch && matchesCategory) {
      cardElement.style.display = "flex";
    } else {
      cardElement.style.display = "none";
    }
  }
}

/**
 * Calculates and updates live item cost based on selected quantity.
 * @param {number} productId - The ID of the target product
 * @param {number} unitPrice - Price per item
 */
function calculateItemTotal(productId, unitPrice) {
  const quantityInput = document.getElementById(`qty-${productId}`);
  const totalDisplay = document.getElementById(`total-${productId}`);

  if (quantityInput && totalDisplay) {
    let quantity = parseInt(quantityInput.value, 10);

    // Decision: Handle invalid or negative numbers
    if (isNaN(quantity) || quantity < 0) {
      quantity = 0;
      quantityInput.value = 0;
    }

    const grandTotal = quantity * unitPrice;
    totalDisplay.textContent = grandTotal.toFixed(2);
  }
}