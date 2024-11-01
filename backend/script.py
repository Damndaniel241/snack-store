import json
from app import app,db # Import your db object from your main app
from models import Snack #Import the Snack model

# Ensure the app context is active for database operations
with app.app_context():
    
    #Load JSON data from file
    with open('../data.json','r') as file:
        snack_data = json.load(file)
        

    # Loop through each item in the JSON file and create Snack objects
    for item in snack_data:
        name = item['name']
        price = item['price']
        
        # Create and add the new Cake object to the session
        new_snack = Snack(name=name, price=price)
        db.session.add(new_snack)
        

    # Commit the session to save all snakes in the database
    try:
        db.session.commit()
        print("All snacks have been successfully added to the database!")
    except Exception as e:
        db.session.rollback() #Roll back if there's an error
        print(f"An error occurred: {e}") 


with app.app_context():
    db.create_all()
    print("Tables created successfully!")