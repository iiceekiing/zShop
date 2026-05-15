/*
  ================================================================
  SHOPLEARN — main.js
  ================================================================
  This file controls ALL the interactive behaviour on the website.
  If you remove the <script src="main.js"> line from index.html,
  the page will still LOOK great (CSS still works), but buttons
  will not respond and the cart will not work.

  HOW JAVASCRIPT WORKS IN A BROWSER:
  — JavaScript reads and changes the HTML on the page.
  — It can listen for events (clicks, typing, scrolling).
  — It can store data in localStorage (saves in the browser).
  — It can show or hide elements by changing their class names.

  NOTE FOR BEGINNERS:
  We are NOT using arrow functions (=>), let/const shortcuts,
  or any advanced modern syntax. Everything here is written in
  the most readable, beginner-friendly way possible.
  ================================================================
*/


/* ================================================================
   SECTION 1: WAIT FOR THE PAGE TO FULLY LOAD
   ================================================================
   "DOMContentLoaded" fires when all the HTML has been read.
   We wrap ALL our code inside this so that JavaScript does not
   try to find HTML elements before they exist on the page.
   DOM = Document Object Model (the browser's version of your HTML)
*/

document.addEventListener("DOMContentLoaded", function () {

  /*
    Every time any page loads, we want to:
    1. Update the cart count badge in the header
    2. Set up the hamburger menu button
  */

  updateCartCount();
  setupHamburgerMenu();

});


/* ================================================================
   SECTION 2: LOCAL STORAGE HELPERS
   ================================================================
   localStorage is like a small notebook the browser keeps for
   your website. Data saved here stays even if you close the tab.

   We store the cart as a JSON string.
   JSON = JavaScript Object Notation (a way to store data as text)

   Example of what gets saved:
   [
     { "id": "1", "name": "Wireless Earbuds Pro", "price": "29.99", "quantity": 2 },
     { "id": "3", "name": "AeroRun Shoes", "price": "39.99", "quantity": 1 }
   ]
*/

/*
  getCart()
  — Reads the cart from localStorage.
  — If nothing is saved yet, returns an empty array [].
*/
function getCart() {
  var cartData = localStorage.getItem("shoplearn_cart");

  if (cartData === null) {
    return [];
  }

  return JSON.parse(cartData);
}

/*
  saveCart(cart)
  — Saves the cart array into localStorage as a JSON string.
  — JSON.stringify() converts an array/object into a text string.
*/
function saveCart(cart) {
  localStorage.setItem("shoplearn_cart", JSON.stringify(cart));
}


/* ================================================================
   SECTION 3: CART COUNT IN THE NAVIGATION
   ================================================================
   The nav bar shows a number like: 🛒 Cart (3)
   This function reads the cart and updates that number.
*/

function updateCartCount() {
  var cart = getCart();

  /*
    Count the total number of items (not just unique products).
    If the user has 2 earbuds + 3 shoes, total = 5.
  */
  var totalItems = 0;

  for (var i = 0; i < cart.length; i = i + 1) {
    totalItems = totalItems + cart[i].quantity;
  }

  /*
    Find the <span id="cart-count"> element in the HTML and
    update its text content to show the new total.
  */
  var cartCountElement = document.getElementById("cart-count");

  if (cartCountElement !== null) {
    cartCountElement.textContent = totalItems;
  }
}


/* ================================================================
   SECTION 4: ADD TO CART
   ================================================================
   This function runs when a user clicks "Add to Cart".
   The button in HTML looks like this:
   <button onclick="addToCart(this)" data-id="1" data-name="..." data-price="...">

   "this" passes the button itself into the function.
   We use "this" to read the data-id, data-name, data-price values.
*/

function addToCart(buttonElement) {
  /*
    Read product information from the button's data attributes.
    dataset.id reads the data-id attribute.
    dataset.name reads the data-name attribute.
    dataset.price reads the data-price attribute.
  */
  var productId    = buttonElement.dataset.id;
  var productName  = buttonElement.dataset.name;
  var productPrice = buttonElement.dataset.price;

  /* Load the current cart from localStorage */
  var cart = getCart();

  /*
    Check if this product is already in the cart.
    We loop through every item and compare the id.
    foundIndex will be -1 if the product is NOT in the cart yet.
  */
  var foundIndex = -1;

  for (var i = 0; i < cart.length; i = i + 1) {
    if (cart[i].id === productId) {
      foundIndex = i;
    }
  }

  if (foundIndex === -1) {
    /*
      Product is NOT in the cart yet.
      Create a new item object and add it to the cart array.
    */
    var newItem = {
      id:       productId,
      name:     productName,
      price:    productPrice,
      quantity: 1
    };

    cart.push(newItem);

  } else {
    /*
      Product IS already in the cart.
      Just increase the quantity by 1.
    */
    cart[foundIndex].quantity = cart[foundIndex].quantity + 1;
  }

  /* Save the updated cart back to localStorage */
  saveCart(cart);

  /* Update the cart count number in the nav */
  updateCartCount();

  /* Show a "Item added to cart!" notification */
  showToast();
}


/* ================================================================
   SECTION 5: TOAST NOTIFICATION
   ================================================================
   A "toast" is a small pop-up message that appears briefly.
   We show it when an item is added to cart.

   How it works:
   1. Find the toast element in the HTML.
   2. Add the "show" class — CSS makes it visible.
   3. Wait 2.5 seconds, then remove "show" — CSS hides it again.
*/

function showToast() {
  var toastElement = document.getElementById("toast-message");

  if (toastElement === null) {
    return;
  }

  /* Add the class that makes the toast visible */
  toastElement.classList.add("show");

  /* After 2500 milliseconds (2.5 seconds), hide it again */
  setTimeout(function () {
    toastElement.classList.remove("show");
  }, 2500);
}


/* ================================================================
   SECTION 6: HAMBURGER MENU (Mobile Navigation)
   ================================================================
   On small screens (phones), the nav links are hidden.
   Clicking the ☰ button toggles them open or closed.
*/

function setupHamburgerMenu() {
  var hamburgerButton = document.getElementById("hamburger-btn");
  var mainNav         = document.querySelector(".main-nav");

  if (hamburgerButton === null || mainNav === null) {
    return;
  }

  hamburgerButton.addEventListener("click", function () {
    /*
      classList.toggle("open") means:
      — If the "open" class is NOT there, ADD it.
      — If the "open" class IS there, REMOVE it.
      CSS has .main-nav.open { display: block } to show the menu.
    */
    mainNav.classList.toggle("open");
  });
}


/* ================================================================
   SECTION 7: RENDER THE CART PAGE
   ================================================================
   cart.html calls this function when it loads.
   It reads the cart from localStorage and builds the HTML
   to display each item, the totals, and the checkout button.
*/

function renderCart() {
  var cart          = getCart();
  var cartContainer = document.getElementById("cart-items-container");
  var cartSummary   = document.getElementById("cart-summary");

  if (cartContainer === null) {
    return;
  }

  /* If cart is empty, show a friendly message */
  if (cart.length === 0) {
    cartContainer.innerHTML =
      '<div class="cart-empty-message">' +
        '<p>🛒 Your cart is empty!</p>' +
        '<a href="index.html">Browse Products</a>' +
      '</div>';

    /* Hide the summary box if cart is empty */
    if (cartSummary !== null) {
      cartSummary.style.display = "none";
    }

    return;
  }

  /* Build HTML for each cart item */
  var itemsHTML = '<div class="cart-items-list">';

  for (var i = 0; i < cart.length; i = i + 1) {
    var item      = cart[i];
    var itemTotal = (parseFloat(item.price) * item.quantity).toFixed(2);

    itemsHTML = itemsHTML +
      '<div class="cart-item" id="cart-item-' + item.id + '">' +

        /* Item name */
        '<span class="cart-item-name">' + item.name + '</span>' +

        /* Quantity controls: minus, number, plus */
        '<div class="cart-item-controls">' +
          '<button class="qty-btn" onclick="decreaseQuantity(\'' + item.id + '\')" >−</button>' +
          '<span class="qty-display">' + item.quantity + '</span>' +
          '<button class="qty-btn" onclick="increaseQuantity(\'' + item.id + '\')" >+</button>' +
        '</div>' +

        /* Item price × quantity */
        '<span class="cart-item-price">$' + itemTotal + '</span>' +

        /* Remove button */
        '<button class="btn-remove" onclick="removeFromCart(\'' + item.id + '\')" >Remove</button>' +

      '</div>';
  }

  itemsHTML = itemsHTML + '</div>';

  cartContainer.innerHTML = itemsHTML;

  /* Now update the summary section */
  renderCartSummary();
}


/* ================================================================
   SECTION 8: CART SUMMARY (Subtotal, Shipping, Total)
   ================================================================
*/

function renderCartSummary() {
  var cart        = getCart();
  var cartSummary = document.getElementById("cart-summary");

  if (cartSummary === null) {
    return;
  }

  /* Calculate the subtotal by looping through all items */
  var subtotal = 0;

  for (var i = 0; i < cart.length; i = i + 1) {
    subtotal = subtotal + (parseFloat(cart[i].price) * cart[i].quantity);
  }

  /* Shipping is free over $50, otherwise $5.99 */
  var shipping = 0;

  if (subtotal < 50) {
    shipping = 5.99;
  }

  var total = subtotal + shipping;

  /* Display a shipping message */
  var shippingText = "$" + shipping.toFixed(2);

  if (shipping === 0) {
    shippingText = "FREE ✅";
  }

  cartSummary.innerHTML =
    '<div class="cart-summary-row">' +
      '<span>Subtotal</span>' +
      '<span>$' + subtotal.toFixed(2) + '</span>' +
    '</div>' +
    '<div class="cart-summary-row">' +
      '<span>Shipping</span>' +
      '<span>' + shippingText + '</span>' +
    '</div>' +
    '<div class="cart-summary-row total">' +
      '<span>Total</span>' +
      '<span>$' + total.toFixed(2) + '</span>' +
    '</div>' +
    '<button class="btn-checkout" onclick="window.location.href=\'checkout.html\'">Proceed to Checkout →</button>';
}


/* ================================================================
   SECTION 9: INCREASE / DECREASE / REMOVE CART ITEMS
   ================================================================
*/

function increaseQuantity(productId) {
  var cart = getCart();

  for (var i = 0; i < cart.length; i = i + 1) {
    if (cart[i].id === productId) {
      cart[i].quantity = cart[i].quantity + 1;
    }
  }

  saveCart(cart);
  updateCartCount();
  renderCart();
}

function decreaseQuantity(productId) {
  var cart = getCart();

  for (var i = 0; i < cart.length; i = i + 1) {
    if (cart[i].id === productId) {

      if (cart[i].quantity > 1) {
        /* If quantity is more than 1, just reduce it */
        cart[i].quantity = cart[i].quantity - 1;
      } else {
        /* If quantity is 1 and user clicks minus, remove the item */
        cart.splice(i, 1);
      }

    }
  }

  saveCart(cart);
  updateCartCount();
  renderCart();
}

function removeFromCart(productId) {
  var cart = getCart();

  /* Build a new array that does NOT include the removed item */
  var updatedCart = [];

  for (var i = 0; i < cart.length; i = i + 1) {
    if (cart[i].id !== productId) {
      updatedCart.push(cart[i]);
    }
  }

  saveCart(updatedCart);
  updateCartCount();
  renderCart();
}


/* ================================================================
   SECTION 10: SIGN UP FORM VALIDATION
   ================================================================
   Runs when the user submits the Sign Up form.
   Checks that fields are not empty and passwords match.
   Saves the user to localStorage (no real server needed!).
*/

function handleSignUp(event) {
  /*
    event.preventDefault() stops the form from refreshing the page.
    By default, forms reload the page when submitted. We stop that
    so JavaScript can handle it instead.
  */
  event.preventDefault();

  /* Get input values */
  var name     = document.getElementById("signup-name").value.trim();
  var email    = document.getElementById("signup-email").value.trim();
  var password = document.getElementById("signup-password").value;
  var confirm  = document.getElementById("signup-confirm").value;

  /* Hide any previous error messages */
  clearErrors();

  /* Validate: name must not be empty */
  if (name === "") {
    showError("error-name", "Please enter your full name.");
    return;
  }

  /* Validate: email must not be empty */
  if (email === "") {
    showError("error-email", "Please enter your email address.");
    return;
  }

  /* Validate: password must be at least 6 characters */
  if (password.length < 6) {
    showError("error-password", "Password must be at least 6 characters.");
    return;
  }

  /* Validate: passwords must match */
  if (password !== confirm) {
    showError("error-confirm", "Passwords do not match.");
    return;
  }

  /* 
    Save user to localStorage.
    In a real website, this would be sent to a server.
    We store only the name and email (NEVER store plain passwords in real apps!).
  */
  var user = {
    name:  name,
    email: email
  };

  localStorage.setItem("shoplearn_user", JSON.stringify(user));

  /* Redirect to the sign in page after successful sign up */
  alert("Account created successfully! Please sign in.");
  window.location.href = "signin.html";
}


/* ================================================================
   SECTION 11: SIGN IN FORM VALIDATION
   ================================================================
   Checks the email matches what was saved during sign up.
   (Password check is skipped since we did not store it safely.)
*/

function handleSignIn(event) {
  event.preventDefault();

  var email    = document.getElementById("signin-email").value.trim();
  var password = document.getElementById("signin-password").value;

  clearErrors();

  if (email === "") {
    showError("error-signin-email", "Please enter your email address.");
    return;
  }

  if (password === "") {
    showError("error-signin-password", "Please enter your password.");
    return;
  }

  /*
    Check if a user account exists in localStorage.
    In a real app, this check would happen on a secure server.
  */
  var savedUserData = localStorage.getItem("shoplearn_user");

  if (savedUserData === null) {
    showError("error-signin-email", "No account found. Please sign up first.");
    return;
  }

  var savedUser = JSON.parse(savedUserData);

  if (savedUser.email !== email) {
    showError("error-signin-email", "Email address not recognised.");
    return;
  }

  /* Save a "logged in" flag in localStorage */
  localStorage.setItem("shoplearn_logged_in", "true");
  localStorage.setItem("shoplearn_current_user", savedUser.name);

  /* Go back to the homepage */
  alert("Welcome back, " + savedUser.name + "!");
  window.location.href = "index.html";
}


/* ================================================================
   SECTION 12: FORM ERROR HELPERS
   ================================================================
*/

function showError(elementId, message) {
  var errorElement = document.getElementById(elementId);

  if (errorElement !== null) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

function clearErrors() {
  /* Find every element with the class "form-error" and hide it */
  var errorElements = document.querySelectorAll(".form-error");

  for (var i = 0; i < errorElements.length; i = i + 1) {
    errorElements[i].style.display = "none";
    errorElements[i].textContent = "";
  }
}


/* ================================================================
   SECTION 13: CHECKOUT FORM
   ================================================================
   Handles the final order form on checkout.html.
*/

function handleCheckout(event) {
  event.preventDefault();

  var firstName = document.getElementById("checkout-firstname").value.trim();
  var lastName  = document.getElementById("checkout-lastname").value.trim();
  var address   = document.getElementById("checkout-address").value.trim();
  var city      = document.getElementById("checkout-city").value.trim();
  var card      = document.getElementById("checkout-card").value.trim();

  clearErrors();

  /* Basic validation */
  if (firstName === "") {
    showError("error-checkout-firstname", "Please enter your first name.");
    return;
  }

  if (lastName === "") {
    showError("error-checkout-lastname", "Please enter your last name.");
    return;
  }

  if (address === "") {
    showError("error-checkout-address", "Please enter your delivery address.");
    return;
  }

  if (city === "") {
    showError("error-checkout-city", "Please enter your city.");
    return;
  }

  if (card.length < 16) {
    showError("error-checkout-card", "Please enter a valid 16-digit card number.");
    return;
  }

  /*
    Order placed!
    Clear the cart from localStorage and show a success message.
  */
  localStorage.removeItem("shoplearn_cart");
  updateCartCount();

  /* Hide the form and show the success message */
  var checkoutForm    = document.getElementById("checkout-form-section");
  var successMessage  = document.getElementById("order-success");

  if (checkoutForm !== null) {
    checkoutForm.style.display = "none";
  }

  if (successMessage !== null) {
    successMessage.style.display = "block";
  }
}


/* ================================================================
   SECTION 14: DISPLAY CHECKOUT ORDER SUMMARY
   ================================================================
   Shows a summary of the items being purchased on checkout.html.
*/

function renderCheckoutSummary() {
  var summaryContainer = document.getElementById("checkout-order-summary");

  if (summaryContainer === null) {
    return;
  }

  var cart = getCart();

  if (cart.length === 0) {
    /* If cart is empty, send user back to shop */
    window.location.href = "index.html";
    return;
  }

  var summaryHTML = "";
  var subtotal    = 0;

  for (var i = 0; i < cart.length; i = i + 1) {
    var item      = cart[i];
    var itemTotal = parseFloat(item.price) * item.quantity;
    subtotal      = subtotal + itemTotal;

    summaryHTML = summaryHTML +
      '<div class="cart-summary-row">' +
        '<span>' + item.name + ' × ' + item.quantity + '</span>' +
        '<span>$' + itemTotal.toFixed(2) + '</span>' +
      '</div>';
  }

  var shipping = subtotal < 50 ? 5.99 : 0;
  var total    = subtotal + shipping;

  var shippingLabel = "$" + shipping.toFixed(2);
  if (shipping === 0) {
    shippingLabel = "FREE ✅";
  }

  summaryHTML = summaryHTML +
    '<div class="cart-summary-row" style="border-top: 2px solid #e5e7eb; margin-top: 10px; padding-top: 14px;">' +
      '<span>Shipping</span><span>' + shippingLabel + '</span>' +
    '</div>' +
    '<div class="cart-summary-row total">' +
      '<span>Total</span><span>$' + total.toFixed(2) + '</span>' +
    '</div>';

  summaryContainer.innerHTML = summaryHTML;
}