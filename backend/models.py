from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy.dialects.sqlite import UUID
import uuid
from datetime import datetime
# from sqlalchemy.types import TypeDecorator, CHAR



db = SQLAlchemy()




# class GUID(TypeDecorator):
#     """Platform-independent GUID type.

#     Uses CHAR(36) to store UUIDs as strings.
#     """
    
#     impl = CHAR(36)
    
#     def process_bind_param(self,value,dialect):
#         if value is None:
#             return value
#         if isinstance(value, uuid.UUID):
#             return str(value)
        
#         raise ValueError("value %s is not a valid uuid.UUID" % value)
    
#     def process_result_value(self, value, dialect):
#         if value is None:
#             return value
#         return uuid.UUID(value)
        



    
class Order(db.Model):
    __tablename__ = "orders"
    
    id = db.Column(db.Integer,primary_key=True)
    customer_name = db.Column(db.String(50),nullable=False)
    customer_email = db.Column(db.String(100),nullable=True)
    customer_phone = db.Column(db.String(15),nullable=True)
    address = db.Column(db.String(200),nullable=True)
    total_price = db.Column(db.Float,nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    order_items = db.relationship('OrderItem',backref='order', lazy=True)
    transaction_id = db.Column(db.String(36), default=lambda: str(uuid.uuid4()), unique=True, nullable=False)
    
    
    def __repr__(self):
        return f"<Order {self.id} - Total ${self.total_price}>"

    def to_json(self):
        order_instance = {
            'id': self.id,
            'customer_name':self.customer_name,
            'customer_email':self.customer_email,
            'customer_phone':self.customer_phone,
            'address':self.address,
            'total_price':self.total_price,
            'created_at':self.created_at,
            'transaction_id':self.transaction_id,
            'order_items': [item.to_json() for item in self.order_items] 
        }
        return order_instance

class OrderItem(db.Model):
    __tablename__ = 'order_items'
    
    id = db.Column(db.Integer, primary_key=True)  
    dessert_name = db.Column(db.String(50),nullable=False) 
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    count = db.Column(db.Integer, nullable=False)
    item_price = db.Column(db.Float, nullable=False)
    total_mix= db.Column(db.Float, nullable=False)
    
    def __repr__(self):
        return f"<OrderItem {self.order_id} x {self.count}"
    
    def to_json(self):
        
            
        order_item_instance = {
            'id': self.id,
            'dessert_name':self.dessert_name,
            'order_id':self.order_id,
            'count':self.count,
            'item_price':self.item_price,
            'total_mix':self.total_mix,
                }

        
            
        #     order_item_list.append(order_item_instance)
        return order_item_instance
    