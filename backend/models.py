from flask_sqlalchemy import SQLAlchemy
import uuid
from datetime import datetime


db = SQLAlchemy()




    
class Order(db.Model):
    __tablename__ = "orders"
    
    id = db.Column(db.Integer,primary_key=True)
    customer_name = db.Column(db.String(50),nullable=False)
    customer_email = db.Column(db.String(100),nullable=True)
    customer_phone = db.Column(db.String(15),nullable=True)
    address = db.Column(db.String(200),nullable=True)
    total_price = db.Column(db.Float,nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    order_items = db.relationship('OrderItem',backref='order',lazy=True)
    
    
    def __repr__(self):
        return f"<Order {self.id} - Total ${self.total_price}>"


class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)   
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    count = db.Column(db.Integer, nullable=False)
    item_price = db.Column(db.Float, nullable=False)
    
    def __repr__(self):
        return f"<OrderItem {self.order_id} x {self.count}"
    