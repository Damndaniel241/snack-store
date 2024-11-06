
"""Main application file for Flask app."""
from flask import Flask ,request,jsonify
from models import db, Order,OrderItem
from flask_admin import Admin
from flask_migrate import Migrate
from flask_cors import CORS



admin = Admin()


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mydatabase4.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CORS_HEADERS'] = 'Content-Type'
app.secret_key = 'supersecretkey'
db.init_app(app)
migrate = Migrate(app, db)
admin.init_app(app)

cors = CORS(app, resources={r"/*": {"origins":"*"}})

@app.route('/order', methods=['POST'])
# @cross_origin(origin='localhost',headers=['Content- Type','application/json'])
def place_order():
    data = request.get_json()
    
    #Extract customer info
    customer_name = data['customer_name']
    customer_email = data.get('customer_email')
    customer_phone = data.get('customer_phone')
    address = data.get('address')
    items = data['items'] #list of items with `snack_id` and `quanitiy`
    # print("items = ",items)
    
    total_price = 0
    for item in items:
        for item_name, details in item.items():
            count = details.get('count')
            price = details.get('price')
            if count is None or price is None:
                return jsonify({"error": "Each item must have 'count' and 'price' keys."}), 400
            total_price += count * price
    #create the order
    new_order = Order(
        customer_name=customer_name,
        customer_email=customer_email,
        customer_phone=customer_phone,
        address=address,
        total_price=total_price 
    )
    
    db.session.add(new_order)
    db.session.commit()
    
    
    

    for item in items:
        for item_name, details in item.items():
            dessert_name = item_name
            count=details.get('count')
            price=details.get('price')
            total_mix=details.get('total_mix')
            
            if count>0:
                order_item = OrderItem(
                dessert_name=dessert_name,
                order_id=new_order.id,
                count=count,
                item_price=price,
                total_mix=total_mix
                )
            
                db.session.add(order_item)
        
    db.session.commit()
    return jsonify({"message": "order placed successfully!"}), 201

    

@app.route('/allorders', methods=['GET'])
def get_all_orders():
    orders = Order.query.all()
    return jsonify({ 'orders': [order.to_json() for order in orders]})

@app.route('/orders/<int:id>', methods=['GET'])
def get_order(id):
    order = Order.query.get_or_404(id)
    return jsonify(order.to_json())
    

    
