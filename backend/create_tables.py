from app import app, db

# Run this script to create the tables in the database
with app.app_context():
    db.create_all()
    print("Tables created successfully!")



#  fetch('http://127.0.0.1:5000/order', {
      
#       method: 'POST',
#       headers: {
#           'Content-Type': 'application/json'
#       },
#       body: JSON.stringify({
#           customer_name: document.getElementById("customerName").value,
#           customer_email: document.getElementById("customerEmail").value,
#           customer_phone: document.getElementById("customerPhone").value,
#           address: document.getElementById("address").value,
#           items: [
#              cartStore
#           ]
#       })
#   })
#   .then(response => response.json())
#   .then(data => console.log(data));2
