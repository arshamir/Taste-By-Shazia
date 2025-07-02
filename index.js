
 document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname;
    const cartIcon = document.querySelector('.cart-icon-link'); // use a class you can target

    if (!path.includes('menu.html')) {
      if (cartIcon) cartIcon.style.display = 'none';
    }
  });
  document.addEventListener('DOMContentLoaded', function () {
  const cartIcon = document.getElementById('cart-icon');
  const cartPanel = document.getElementById('cart-panel');

  cartIcon.addEventListener('click', function () {
    if (cartPanel) {
      cartPanel.classList.add('active'); // Show the cart panel
    }
  });
});
  document.addEventListener("DOMContentLoaded", function () {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains("restaurant")) {
            entry.target.classList.add("visible", "fade-left");
          } else if (entry.target.classList.contains("chef")) {
            entry.target.classList.add("visible", "fade-right");
          }
          observer.unobserve(entry.target); // Stops observing once visible
        }
      });
    }, {
      threshold: 0.2 // Trigger when 20% visible
    });

    document.querySelectorAll(".restaurant, .chef").forEach(el => {
      observer.observe(el);
    });
  });
  document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".portion-card");
    const sections = document.querySelectorAll(".full-menu-section");

    cards.forEach(card => {
      card.addEventListener("click", () => {
        const targetId = card.getAttribute("data-target");

        // Hide all other sections
        sections.forEach(section => {
          section.style.display = "none";
        });

        // Show the selected section
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.style.display = "block";
          targetSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  });
   // Attach click to all portion cards
  document.querySelectorAll('.portion-card').forEach(card => {
    card.addEventListener('click', function () {
      const targetId = this.getAttribute('data-target');
      if (targetId) {
        showMenu(targetId);
      }
    });
  });
document.addEventListener('DOMContentLoaded', function () {
  // Handle all close buttons inside full-menu-sections
  document.querySelectorAll('.full-menu-section .close-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const section = this.closest('.full-menu-section');
      if (section) {
        section.style.display = 'none'; // or section.classList.remove('active') if you're using a class
      }
    });
  });
});
  document.addEventListener("DOMContentLoaded", function () {
    const lazyImages = document.querySelectorAll("img.lazy-image");
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.onload = () => img.classList.add("loaded");
          observer.unobserve(img);
        }
      });
    });
    lazyImages.forEach(img => observer.observe(img));
  });
// ✅ Global cart variable — only declare ONCE
let cart = JSON.parse(localStorage.getItem('cartItems')) || [];

document.addEventListener('DOMContentLoaded', function () {
  const cartPanel = document.getElementById('cart-panel');
  const cartItemsList = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');

  // ✅ Update Cart UI
  window.updateCart = function () {
    if (!cartItemsList || !cartTotalElement) return;

    cartItemsList.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
      const li = document.createElement('li');

      const span = document.createElement('span');
      span.textContent = `${item.name} - Rs. ${item.price}`;

      const controlsDiv = document.createElement('div');
      controlsDiv.className = 'quantity-controls';

      const plusBtn = document.createElement('button');
      plusBtn.textContent = '+';
      plusBtn.onclick = () => {
        item.quantity++;
        updateCart();
      };

      const quantitySpan = document.createElement('span');
      quantitySpan.textContent = item.quantity;

      const minusBtn = document.createElement('button');
      minusBtn.textContent = '−';
      minusBtn.onclick = () => {
        item.quantity--;
        if (item.quantity <= 0) {
          cart.splice(index, 1);
        }
        updateCart();
      };

      controlsDiv.appendChild(plusBtn);
      controlsDiv.appendChild(quantitySpan);
      controlsDiv.appendChild(minusBtn);

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Remove';
      deleteBtn.className = 'cart-btn';
      deleteBtn.onclick = () => {
        cart.splice(index, 1);
        updateCart();
      };

      const controlsRow = document.createElement('div');
      controlsRow.className = 'controls-row';
      controlsRow.appendChild(controlsDiv);
      controlsRow.appendChild(deleteBtn);

      li.appendChild(span);
      li.appendChild(controlsRow);
      cartItemsList.appendChild(li);

      total += item.price * item.quantity;
    });

    cartTotalElement.textContent = `Total: Rs. ${total}`;
    localStorage.setItem('cartItems', JSON.stringify(cart));

    const checkoutBtn = document.querySelector('.cart-btn.checkout');
    const addToCartBtn = document.querySelector('.cart-btn.add-to-cart');

    if (cart.length === 0) {
      checkoutBtn?.setAttribute('disabled', true);
      checkoutBtn?.classList.add('disabled');
      addToCartBtn?.setAttribute('disabled', true);
      addToCartBtn?.classList.add('disabled');
    } else {
      checkoutBtn?.removeAttribute('disabled');
      checkoutBtn?.classList.remove('disabled');
      addToCartBtn?.removeAttribute('disabled');
      addToCartBtn?.classList.remove('disabled');
    }
  };

  // ✅ Open Cart Panel
  window.openCart = function () {
    if (cartPanel) {
      cartPanel.classList.add('active');
    }
  };

  // ✅ Close Cart Panel
  window.closeCart = function () {
    if (cartPanel) {
      cartPanel.classList.remove('active');
    }
  };

  // ✅ Called by cart-panel Add to Cart button
  window.addToCartAndClose = function () {
    // Here, you can add any logic (if cart panel allows selecting items)
    closeCart();
    updateCart();
  };

  // ✅ Checkout
  window.openCheckout = function () {
    if (cart.length > 0) {
      window.location.href = 'checkout.html';
    }
  };

  // ✅ Run updateCart on page load
  updateCart();
});

// ✅ Menu "Add to Cart" Buttons
document.querySelectorAll('.order').forEach(button => {
  button.addEventListener('click', function () {
    const itemElement = this.closest('.menu-item');
    const name = itemElement.querySelector('h4').textContent;
    const priceText = itemElement.querySelector('p:nth-of-type(2)').textContent;
    const price = parseInt(priceText.replace(/[^0-9]/g, ''));

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    updateCart();
    openCart();
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('checkout-form');
  const thankYouMessage = document.getElementById('thank-you-message');
  const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
  const easypaisaSection = document.getElementById('easypaisa-section');
  const screenshot = document.getElementById('screenshot');
  const easypaisaName = document.getElementById('easypaisa-name');
  const easypaisaNumber = document.getElementById('easypaisa-number');

  // Show/hide Easypaisa fields
  paymentRadios.forEach(radio => {
    radio.addEventListener('change', function () {
      if (this.value === 'easypaisa') {
        easypaisaSection.style.display = 'block';
        screenshot.required = true;
        easypaisaName.required = true;
        easypaisaNumber.required = true;
      } else {
        easypaisaSection.style.display = 'none';
        screenshot.required = false;
        easypaisaName.required = false;
        easypaisaNumber.required = false;
      }
    });
  });

  // Handle form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Show thank-you message above form
    thankYouMessage.style.display = 'block';
    thankYouMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Hide only the form fields (not footer or entire page)
    form.style.display = 'none';

    // Clear cart so user can't resubmit
    localStorage.removeItem('cartItems');
  });

  // Modal logic
  document.getElementById('return-policy-link')?.addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('return-policy-modal').style.display = 'block';
  });

  document.getElementById('terms-link')?.addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('terms-modal').style.display = 'block';
  });

  document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', function () {
      const modalId = this.getAttribute('data-modal');
      document.getElementById(modalId).style.display = 'none';
    });
  });

  window.addEventListener('click', function (e) {
    document.querySelectorAll('.modal').forEach(modal => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('checkout-form');
  const thankYou = document.getElementById('thank-you-message');

  if (form && thankYou) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      form.reset(); // clear form fields

      thankYou.classList.add('visible'); // show the thank-you message

      // Optional smooth scroll if user is far away
      setTimeout(() => {
        thankYou.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });
  }
});
