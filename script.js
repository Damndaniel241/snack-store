const addButton = document.getElementById("addBtn");
const removeButton = document.getElementById("removeBtn");
const delButton = document.getElementById("delBtn");
const numCount = document.getElementById("count-number");
let cartStore = {};
const itemsDisplay = document.getElementById("items__display");
const displayCartItems = document.getElementById("display-cart-items");
const confirmOrderButton = document.getElementById("confirm-order-button");
const submitDetailsButton = document.getElementById("submit-details-button");
const startNewOrder = document.getElementById("start-new-order");
const divDisplayOrder = document.getElementById("div-display-order");
const divOverlay = document.getElementById("div-overlay");
const displayOrderCart = document.getElementById("display-order-cart");
const emptyDiv = document.getElementById("empty-div");
const orderTotal = document.getElementById("order-total");
const orderTotal2 = document.getElementById("order-total-2");
const carbonNeutral = document.getElementById("carbon-neutral");
const displayOrderTotal = document.getElementById("display-order-total");
const customerForm = document.getElementById("customer-form");
let total_price = 0;

let masterArr = [];
// let editArr = [];
let displayArr = [cartStore];

function sumArr(arr) {
  let sum = 0;

  for (let i = 0; i < arr.length; i++) {
    sum += arr[i];
  }

  return sum;
}

async function loadData() {
  const response = await fetch("./data.json");
  const data = await response.json();
  masterArr = [...data];
  // console.log(masterArr);

  for (let item of masterArr) {
    const div = document.createElement("div");
    div.classList.add("cart__item");
    div.innerHTML = `
         <div data-cart-box-board=${item.category} data-item-image=${
           item.image.desktop
         } class="cart__box" style="background-image: url('${
           item.image.desktop
         }');background-size: cover; background-position: center;">


          <div data-item-price=${item.price} data-category=${
            item.category
          } class="add-cart-btn non-edit "><img class="add-to-cart-styling" src="./assets/images/icon-add-to-cart.svg" alt="add to cart svg"> Add to cart</div>
         </div>
        <div class="caption__section">
          <h6 class="item-h6-category">${item.category}</h6>
          <h5 class="item-h5-name">${item.name}</h5>
          <h5 class="item-h5-price">$${item.price.toFixed(2)}</h5>
        </div>`;

    itemsDisplay.appendChild(div);
  }

  const buttonsNonEdit = Array.from(document.querySelectorAll(".non-edit"));
  const cartBox = Array.from(document.querySelectorAll(".cart__box"));
  console.log(cartBox);

  console.log(buttonsNonEdit);

  function getAllCounts() {
    // Declare `allCounts` inside the function to ensure it resets on each call
    const allCounts = [];

    for (const item in cartStore) {
      if (cartStore.hasOwnProperty(item)) {
        allCounts.push(cartStore[item].count);
      }
    }

    console.log(allCounts); // Output the array of counts
    return sumArr(allCounts);
  }

  let count = 0;

  cartBox.forEach((element, index) => {
    element.addEventListener("mouseover", (event) => {
      if (event.target !== element) {
        // console.log(`Hovered on child: ${event.target.id}`);
        element.style.border = "2px solid hsl(14, 86%, 42%)";
      }
    });

    element.addEventListener("mouseout", (event) => {
      if (event.target !== element) {
        // console.log(`mouse left child: ${event.target.id}`);
        element.style.border = "initial";
      }
    });
  });

  async function submitOrder() {
    const orderCart = {
      customer_name: document.getElementById("customerName").value,
      customer_email: document.getElementById("customerEmail").value,
      customer_phone: document.getElementById("customerPhone").value,
      address: document.getElementById("address").value,
      items: [cartStore],
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderCart),
      });

      if (response.ok) {
        console.log("order Placed successfully!");

        customerForm.classList.add("hide-element");
        divDisplayOrder.classList.remove("hide-element");

        // setTimeout(() => {
        // }, 4000);
      } else {
        const error = await response.json();
        console.log("error placing order: " + error.message);
      }
    } catch (err) {
      console.error("Error: ", err);
    }
  }

  submitDetailsButton.addEventListener("click", (event) => {
    event.preventDefault();

    submitOrder();
  });

  confirmOrderButton.addEventListener("click", () => {
    divOverlay.classList.remove("hide-element");

    customerForm.classList.remove("hide-element");

    displayOrderTotal.innerHTML = `
    <h5>Order Total</h5>
        <h2>$${total_price.toFixed(2)}</h2>
    `;
  });

  buttonsNonEdit.forEach((element, index) => {
    const itemCategory = element.getAttribute("data-category");
    const itemPrice = parseFloat(element.getAttribute("data-item-price"));
    // const itemImage = element.getAttribute("data-item-image");

    startNewOrder.addEventListener("click", () => {
      cartStore[itemCategory] = {
        count: 0,
        price: itemPrice,
        total_mix: 0,
      };

      count = 0;
      total_price = 0;

      console.log("cartstore new state", cartStore[itemCategory]);
      displayCartItems.replaceChildren();
      displayOrderCart.replaceChildren();
      numCount.textContent = `your cart (${count})`;

      confirmOrderButton.classList.add("hide-element");
      emptyDiv.classList.remove("hide-element");
      orderTotal.style.display = "none";
      carbonNeutral.style.display = "none";

      divOverlay.classList.add("hide-element");
      divDisplayOrder.classList.add("hide-element");
    });

    cartStore[itemCategory] = {
      count: 0,
      price: itemPrice,
      total_mix: count * itemPrice,
    };

    element.addEventListener("mouseenter", () => {
      element.style.color = "white";
      element.style.backgroundColor = "var(--mainRed)";
      element.innerHTML = `
      <div class="value-functionality">
      <span id="dec-cart-${index}" class="math__sign"><img src="./assets/images/icon-decrement-quantity.svg" alt="icon-decrement-quantity"></span>
            <span id="cart-count-${index}">${cartStore[itemCategory].count}</span>
            <span id="inc-cart-${index}" class="math__sign"><img src="./assets/images/icon-increment-quantity.svg" alt="icon-increment-quantity"></span>
      </div>
            `;

      function addDeleteFunctionality(itemCategory) {
        const deleteButton = document.querySelector(
          `#item-${itemCategory} .math__sign__2`,
        );

        deleteButton.addEventListener("click", () => {
          // Remove the item from the cart store
          // delete cartStore[itemCategory];
          // console.log(`${itemCategory} was deleted from cartStore`);

          // reset the item's count value to zero
          cartStore[itemCategory].count = 0;
          // Remove the item's HTML element from the DOM
          const itemDiv = document.querySelector(`#item-${itemCategory}`);
          if (itemDiv) {
            itemDiv.remove();
          }

          // Recalculate total count and price
          count = getAllCounts();
          total_price = Object.values(cartStore).reduce(
            (sum, item) => sum + item.price * item.count,
            0,
          );

          console.log(`Total price after deletion: $${total_price.toFixed(2)}`);
          numCount.textContent = `your cart (${count})`;

          // Optionally: Update cart count display
          cartCount.textContent = count;

          if (count > 0) {
            confirmOrderButton.classList.remove("hide-element");
            emptyDiv.classList.add("hide-element");
            orderTotal.style.display = "flex";
            orderTotal2.textContent = `$${total_price.toFixed(2)}`;
            carbonNeutral.style.display = "flex";
          } else {
            confirmOrderButton.classList.add("hide-element");
            emptyDiv.classList.remove("hide-element");
            orderTotal.style.display = "none";
            carbonNeutral.style.display = "none";
          }
        });
      }

      const decCart = document.getElementById(`dec-cart-${index}`);
      const cartCount = document.getElementById(`cart-count-${index}`);
      const incCart = document.getElementById(`inc-cart-${index}`);

      decCart.addEventListener("click", () => {
        if (cartStore[itemCategory].count > 0) {
          cartStore[itemCategory].count = cartStore[itemCategory].count - 1;
          cartStore[itemCategory].total_mix =
            cartStore[itemCategory].count * cartStore[itemCategory].price;
          cartCount.textContent = cartStore[itemCategory].count;
          console.log(
            `${itemCategory} was decreased, current count: ${cartStore[itemCategory].count}`,
          );

          count = getAllCounts();

          total_price = Math.max(0, total_price - itemPrice);
          console.log(`Total price: $${total_price.toFixed(2)}`);
          numCount.textContent = `your cart (${count})`;

          if (count > 0) {
            confirmOrderButton.classList.remove("hide-element");
            emptyDiv.classList.add("hide-element");
            orderTotal.style.display = "flex";
            orderTotal2.textContent = `$${total_price.toFixed(2)}`;
            carbonNeutral.style.display = "flex";
          } else {
            confirmOrderButton.classList.add("hide-element");
            emptyDiv.classList.remove("hide-element");
            orderTotal.style.display = "none";
            carbonNeutral.style.display = "none";
          }

          let divMajorItemDisplay = document.querySelector(
            `#item-${itemCategory}`,
          );

          if (cartStore[itemCategory].count > 0) {
            // If the item count is still greater than 0, update the item's display
            divMajorItemDisplay.innerHTML = `

              <div class="major-item">
                <div class="name-of-item">${itemCategory}</div>
                <div class="price-of-item"><span>${
                  cartStore[itemCategory].count
                }x</span><span class="price-of-item-span-1">@ $${cartStore[
                  itemCategory
                ].price.toFixed(2)}</span>
                <span class="price-of-item-span-2">$${cartStore[
                  itemCategory
                ].total_mix.toFixed(2)}</span>
                </div>
              </div>
              <div class="math__sign__2"><img src="./assets/images/icon-remove-item.svg" alt="remove-item-svg"></div>

          `;
          } else {
            // If the item count is 0, remove the item from the cart display
            if (divMajorItemDisplay) {
              divMajorItemDisplay.remove();
            }
          }

          console.log("cartStore current state ", cartStore);
        } else {
          console.log(`${itemCategory} count is already 0`);
        }

        console.log(
          "divMajorItemDisplay = ",
          Array.from(document.querySelectorAll(".major-item-display")),
        );
        addDeleteFunctionality(itemCategory);
      });

      incCart.addEventListener("click", () => {
        cartStore[itemCategory].count = cartStore[itemCategory].count + 1;
        cartStore[itemCategory].total_mix =
          cartStore[itemCategory].count * cartStore[itemCategory].price;
        cartCount.textContent = cartStore[itemCategory].count;
        console.log(
          `${itemCategory} was increased, current count: ${cartStore[itemCategory].count}`,
        );

        count = getAllCounts();

        console.log("cartStore current state ", cartStore);
        // console.log("displayArr current state ",displayArr);

        let filteredDesserts = Object.fromEntries(
          Object.entries(cartStore).filter(([key, value]) => value.count > 0),
        );
        console.log("filtered = ", filteredDesserts);
        //   console.log(Object.values(filteredDesserts));

        for (let item in filteredDesserts) {
          const dessert = filteredDesserts[item];

          let divMajorItemDisplay = document.querySelector(`#item-${item}`);

          if (divMajorItemDisplay) {
            divMajorItemDisplay.innerHTML = `
           <div class="major-item">
                <div class="name-of-item">${item}</div>
                <div class="price-of-item"><span>${
                  dessert.count
                }x</span><span class="price-of-item-span-1">@ $${dessert.price.toFixed(
                  2,
                )}</span>
                <span class="price-of-item-span-2">$${dessert.total_mix.toFixed(
                  2,
                )}</span>

                </div>
              </div>
              <div class="math__sign__2"><img src="./assets/images/icon-remove-item.svg" alt="remove-item-svg"></div>
          `;
          } else {
            divMajorItemDisplay = document.createElement("div");
            divMajorItemDisplay.classList.add("major-item-display");
            divMajorItemDisplay.id = `item-${item}`;
            displayCartItems.appendChild(divMajorItemDisplay);

            divMajorItemDisplay.innerHTML = `

                <div class="major-item">
                  <div class="name-of-item">${item}</div>
                  <div class="price-of-item"><span>${
                    dessert.count
                  }x</span><span class="price-of-item-span-1">@ $${dessert.price.toFixed(
                    2,
                  )}</span>
                  <span class="price-of-item-span-2">$${dessert.total_mix.toFixed(
                    2,
                  )}</span>
                  </div>
                </div>
                <div class="math__sign__2"><img src="./assets/images/icon-remove-item.svg" alt="remove-item-svg"></div>

            `;
          }

          let divDisplayOrderItem = document.getElementById(
            `item-display-order-${item}`,
          );

          if (divDisplayOrderItem) {
            divDisplayOrderItem.classList.add("display-order-cart-item");
            divDisplayOrderItem.innerHTML = `

            <div class="cart-flex">
                <div class="rose-500">${item}</div>
                <div class="cart-flex-inner-div"><span class="main-red">${
                  dessert.count
                }x</span><span class="rose-300">@ ${dessert.price.toFixed(
                  2,
                )}</span> </div>
              </div>
              <div class="price-quantity rose-500">$${dessert.total_mix.toFixed(
                2,
              )}</div>
            `;
          } else {
            divDisplayOrderItem = document.createElement("div");
            divDisplayOrderItem.classList.add("display-order-cart-item");
            divDisplayOrderItem.id = `item-display-order-${item}`;
            displayOrderCart.appendChild(divDisplayOrderItem);
            divDisplayOrderItem.innerHTML = `

          <div class="cart-flex">
                <div class="rose-500">${item}</div>
                <div class="cart-flex-inner-div"><span class="main-red">${
                  dessert.count
                }x</span><span class="rose-300">@ ${dessert.price.toFixed(
                  2,
                )}</span> </div>
                </div>
                <div class="price-quantity rose-500">$${dessert.total_mix.toFixed(
                  2,
                )}</div>


        `;
          }

          addDeleteFunctionality(item);
        }

        console.log(
          "divMajorItemDisplay = ",
          Array.from(document.querySelectorAll(".major-item-display")),
        );

        total_price += itemPrice;
        console.log(`Total price: $${total_price.toFixed(2)}`);
        numCount.textContent = `your cart (${count})`;

        if (count > 0) {
          confirmOrderButton.classList.remove("hide-element");
          emptyDiv.classList.add("hide-element");
          orderTotal.style.display = "flex";
          orderTotal2.textContent = `$${total_price.toFixed(2)}`;
          carbonNeutral.style.display = "flex";
        } else {
          confirmOrderButton.classList.add("hide-element");
          emptyDiv.classList.remove("hide-element");
          orderTotal.style.display = "none";
          carbonNeutral.style.display = "none";
        }
      });
    });

    element.addEventListener("mouseleave", () => {
      element.style.color = "inherit";
      element.style.backgroundColor = "white";

      element.innerHTML = `<img class="add-to-cart-styling" src="./assets/images/icon-add-to-cart.svg" alt="add to cart svg"> Add to cart`;
    });
  });
}

loadData();
