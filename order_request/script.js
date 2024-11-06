const allOrders = document.getElementById("all-orders");
const orderDetails = document.getElementById("order-details");
const orders = Array.from(document.querySelectorAll(".order"));
const cancelButton = document.getElementById("cancel-button");
const divOverlay = document.getElementById("div-overlay");


// let orderId = null;


function conv_date(dateString){
 // Use Date.parse() to safely parse the date
 const timestamp = Date.parse(dateString);
 if (isNaN(timestamp)) {
     console.error("Invalid date format:", dateString);
     return "Invalid Date";
 }

 const date = new Date(timestamp);

// Format the date as "DD/MM/YYYY"
const formattedDate = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
}).format(date);


return formattedDate;
}


async function getOrder(id) {
    try{
        const response = await fetch(`http://127.0.0.1:5000/orders/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
              },
        },
    );
    const orderData = await response.json();
    // console.log(orderData);
    return orderData;
    
    }catch(err){
        console.error("error retrieving order",err);
        
    }
}

// console.log(allOrders);
async function getAllOrders(){
    try{
        const response= await fetch("http://127.0.0.1:5000/allorders", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
              },
        },
    )

    

    const data= await response.json();
    console.log(data);
    for (let i =0; i<data['orders'].length;i++){
        getOrder(data['orders'][i].id);
        const div = document.createElement('div');
        div.classList.add("order");
        // console.log(data['orders'][i].customer_name);
        div.setAttribute("data-id",data['orders'][i].id);
        div.innerHTML = `
        <div class="order-1">
          <h2>${data['orders'][i].customer_name}</h2>
          <h2>${data['orders'][i].customer_phone}</h2>
        </div>

        <div class="order-2">
        <h2>$${data['orders'][i].total_price}</h2>
        <h2>${conv_date(data['orders'][i].created_at)}</h2>
        </div>
        `;

        allOrders.appendChild(div);
    }



    }catch(err){
        console.error("error loading order data",err);
    }



}

getAllOrders();


// orders.forEach((element,index)=>{
//     element.addEventListener("click",()=>{
//         console.log("something was clicked");
        
//         orderDetails.classList.remove("hide-element");
//         divOverlay.classList.remove("hide-element");
//     });
// });

// Assuming `allOrders` is the container that holds all `.order` elements
allOrders.addEventListener("click", async(event) => {
    // Check if the clicked element has the 'order' class or is a descendant of an `.order` element
    const orderElement = event.target.closest(".order");
    
    if (orderElement) {
        console.log("something was clicked");

        orderId = orderElement.getAttribute("data-id");
        const specificData = await getOrder(orderId);
        console.log(specificData);

         orderDetails.innerHTML = `
         <div id="cancel-button" class="math__sign__2"><img src="./assets/images/icon-remove-item.svg" alt="remove-item-svg"></div>

        <span><h4>Customer name:</h4><h4>${specificData.customer_name}</h4></span>
        <span><h4>Customer email:</h4><h4>${specificData.customer_email}</h4></span>
        <span><h4>Customer phone:</h4><h4>${specificData.customer_phone}</h4></span>
        <span><h4>Created at:</h4><h4>${conv_date(specificData.created_at)}</h4></span>
        <span><h4>Address:</h4><h4>${specificData.address}</h4></span>
        <span><h4>Transaction id:</h4><h4>${specificData.transaction_id}</h4></span>
        
        `;




        const showAllOrderDetails= document.createElement("div");
        showAllOrderDetails.id = "show-all-order-details";
        orderDetails.appendChild(showAllOrderDetails);

        for (let i=0; i<specificData.order_items.length; i++){
            const divOrderItem = document.createElement("div");
            divOrderItem.classList.add("display-order-cart-item");
            divOrderItem.innerHTML = `
            <div class="cart-flex">
          <div class="rose-500">${specificData.order_items[i].dessert_name}</div>
          <div class="cart-flex-inner-div"><span class="main-red">${specificData.order_items[i].count}x</span> <span class="rose-300">@ $${specificData.order_items[i].item_price.toFixed(2)}</span> </div>
          </div>
          <div class="price-quantity rose-500">$${specificData.order_items[i].total_mix}</div>
            `;

            showAllOrderDetails.appendChild(divOrderItem);
        }


        // showAllOrderDetails.innerHTML = `
        
        // <div class="display-order-cart-item">
        // <div class="cart-flex">
        //   <div class="rose-500">waffle</div>
        //   <div class="cart-flex-inner-div"><span class="main-red">2x</span> <span class="rose-300">@ $3.50</span> </div>
        //   </div>
        //   <div class="price-quantity rose-500">455</div>
        // </div>
        // `
        
       

        // Show the order details and overlay
        orderDetails.classList.remove("hide-element");
        divOverlay.classList.remove("hide-element");
    }
});


orderDetails.addEventListener("click",(event)=>{
    const cancel = event.target.closest("#cancel-button");

    if (cancel){
        orderDetails.classList.add("hide-element");
        divOverlay.classList.add("hide-element");
    }
})

cancelButton.addEventListener("click",()=>{
    orderDetails.classList.add("hide-element");
    divOverlay.classList.add("hide-element");
    
});
