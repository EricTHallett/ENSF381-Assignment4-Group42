"""
ENSF381 Assignment 4
Developed by:
Eric Hallett (30117108)
Henrique Sacht Aguiar (30247877)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import bcrypt
import time
import re
import random

app = Flask(__name__)
CORS(app)

USERS_FILE = "users.json"
FLAVORS_FILE = "flavors.json"
REVIEWS_FILE = "reviews.json"


def load_json(path):
    try:
        with open(path, "r", encoding="utf-8") as file:
            return json.load(file)
    except FileNotFoundError:
        return []

def save_json(path, data):
    with open(path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)

def get_next_user_id(users):
    if not users:
        return 1
    return max(user["userId"] for user in users) + 1

def find_user_by_id(user_id, users):
    for user in users:
        if user["userId"] == user_id:
            return user
    return None

def find_user_by_username(username, users):
    for user in users:
        if user["username"].lower() == username.lower():
            return user
    return None

def find_flavor_by_id(flavor_id, flavors):
    for flavor in flavors:
        if flavor["id"] == flavor_id:
            return flavor
    return None

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "Backend is running."
    })

@app.route("/reviews", methods=["GET"])
def get_reviews():
    reviews = load_json(REVIEWS_FILE)
    selected = random.sample(reviews, min(2, len(reviews)))
    return jsonify({
        "success": True,
        "message": "Reviews loaded.",
        "reviews": selected
    })

@app.route("/flavors", methods=["GET"])
def get_flavors():
    flavors = load_json(FLAVORS_FILE)
    return jsonify({
        "success": True,
        "message": "Flavors loaded.",
        "flavors": flavors
    })

@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received."
        }), 400

    username = data.get("username", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")
    confirm_password = data.get("confirmPassword", "")

    if not username or not email or not password or not confirm_password:
        return jsonify({
            "success": False,
            "message": "All fields are required."
        }), 400

    if confirm_password != password:
        return jsonify({
            "success": False,
            "message": "Passwords do not match."
        }), 400

    if len(username) < 3:
        return jsonify({
            "success": False,
            "message": "Username must be at least 3 characters."
        }), 400
    
    if len(username) > 20:
        return jsonify({
            "success": False,
            "message": "Username must be no more than 20 characters."
        }), 400
    
    if not username[0].isalpha():
        return jsonify({
            "success": False,
            "message": "Username must start with a letter."
        }), 400
    
    if not re.fullmatch(r'[a-zA-Z0-9_-]+', username):
        return jsonify({
            "success": False,
            "message": "Username may only contain letters, numbers, underscores, and hyphens."
        }), 400

    if not re.fullmatch(r'[^\s@]+@[^\s@]+\.[^\s@]+', email):
        return jsonify({
            "success": False,
            "message": "Invalid email address."
        }), 400

    if len(password) < 8:
        return jsonify({
            "success": False,
            "message": "Password must be at least 8 characters."
        }), 400

    if not re.search(r'[A-Z]', password):
        return jsonify({
            "success": False,
            "message": "Password must contain at least one uppercase letter."
        }), 400
    
    if not re.search(r'[a-z]', password):
        return jsonify({
            "success": False,
            "message": "Password must contain at least one lowercase letter."
        }), 400
    
    if not re.search(r'[0-9]', password):
        return jsonify({
            "success": False,
            "message": "Password must contain at least one number."
        }), 400
    
    if not re.search(r'[^a-zA-Z0-9]', password):
        return jsonify({
            "success": False,
            "message": "Password must contain at least one special character."
        }), 400

    users = load_json(USERS_FILE)

    for user in users:
        if user["username"].lower() == username.lower():
            return jsonify({
                "success": False,
                "message": "Username already taken."
            }), 400
        if user["email"].lower() == email.lower():
            return jsonify({
                "success": False,
                "message": "Email already taken."
            }), 400

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    new_user = {
        "userId": get_next_user_id(users),
        "username": username,
        "email": email,
        "password_hash": hashed_password,
        "cart": [],
        "orders": []
    }

    users.append(new_user)
    save_json(USERS_FILE, users)

    return jsonify({
        "success": True,
        "message": "Signup successful."
    }), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received."
        }), 400

    username = data.get("username", "").strip()
    password = data.get("password", "")

    users = load_json(USERS_FILE)
    user = find_user_by_username(username, users)

    if user is None:
        return jsonify({
            "success": False,
            "message": "Invalid username or password."
        }), 401

    if not bcrypt.checkpw(password.encode("utf-8"), user["password_hash"].encode("utf-8")):
        return jsonify({
            "success": False,
            "message": "Invalid username or password."
        }), 401

    return jsonify({
        "success": True,
        "message": "Login successful.",
        "userId": user["userId"],
        "username": user["username"]
    })

@app.route("/users", methods=["GET"])
def get_users():
    users = load_json(USERS_FILE)
    return jsonify({
        "success": True,
        "message": "Users loaded.",
        "users": users
    })

@app.route("/cart", methods=["GET"])
def get_cart():
    user_id = request.args.get("userId", type=int)

    users = load_json(USERS_FILE)
    user = find_user_by_id(user_id, users)

    if user is None:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Cart loaded.",
        "cart": user["cart"]
    })

@app.route("/cart", methods=["POST"])
def add_to_cart():
    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received."
        }), 400

    user_id = data.get("userId")
    flavor_id = data.get("flavorId")

    users = load_json(USERS_FILE)
    flavors = load_json(FLAVORS_FILE)

    user = find_user_by_id(user_id, users)
    if user is None:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    flavor = find_flavor_by_id(flavor_id, flavors)
    if flavor is None:
        return jsonify({
            "success": False,
            "message": "Flavor not found."
        }), 404

    for item in user["cart"]:
        if item["flavorId"] == flavor_id:
            return jsonify({
                "success": False,
                "message": "Flavor already in cart. Use PUT /cart to update quantity instead."
            }), 400

    cart_item = {
        "flavorId": flavor["id"],
        "name": flavor["name"],
        "price": flavor["price"],
        "quantity": 1
    }

    user["cart"].append(cart_item)
    save_json(USERS_FILE, users)

    return jsonify({
        "success": True,
        "message": "Flavor added to cart.",
        "cart": user["cart"]
    })

@app.route("/cart", methods=["PUT"])
def update_cart():
    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received."
        }), 400

    user_id = data.get("userId")
    flavor_id = data.get("flavorId")
    quantity = data.get("quantity")

    users = load_json(USERS_FILE)
    user = find_user_by_id(user_id, users)

    if user is None:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    if quantity is None or quantity < 1:
        return jsonify({
            "success": False,
            "message": "Quantity must be at least 1."
        }), 400

    for item in user["cart"]:
        if item["flavorId"] == flavor_id:
            item["quantity"] = quantity
            save_json(USERS_FILE, users)
            return jsonify({
                "success": True,
                "message": "Cart updated successfully.",
                "cart": user["cart"]
            })

    return jsonify({
        "success": False,
        "message": "Flavor not found in cart."
    }), 404

@app.route("/cart", methods=["DELETE"])
def delete_cart_item():
    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received."
        }), 400

    user_id = data.get("userId")
    flavor_id = data.get("flavorId")

    users = load_json(USERS_FILE)
    user = find_user_by_id(user_id, users)

    if user is None:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    original_length = len(user["cart"])
    user["cart"] = [item for item in user["cart"] if item["flavorId"] != flavor_id]

    if len(user["cart"]) == original_length:
        return jsonify({
            "success": False,
            "message": "Flavor not found in cart."
        }), 404

    save_json(USERS_FILE, users)

    return jsonify({
        "success": True,
        "message": "Flavor removed from cart.",
        "cart": user["cart"]
    })

@app.route("/orders", methods=["POST"])
def place_order():
    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "No data received."
        }), 400

    user_id = data.get("userId")

    users = load_json(USERS_FILE)
    user = find_user_by_id(user_id, users)

    if user is None:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    if not user["cart"]:
        return jsonify({
            "success": False,
            "message": "Cart is empty."
        }), 400

    order_id = len(user["orders"]) + 1
    total = 0

    for item in user["cart"]:
        total += item["price"] * item["quantity"]

    new_order = {
        "orderId": order_id,
        "items": user["cart"][:],
        "total": round(total, 2),
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }

    user["orders"].append(new_order)
    user["cart"] = []

    save_json(USERS_FILE, users)

    return jsonify({
        "success": True,
        "message": "Order placed successfully.",
        "orderId": order_id
    })

@app.route("/orders", methods=["GET"])
def get_orders():
    user_id = request.args.get("userId", type=int)

    users = load_json(USERS_FILE)
    user = find_user_by_id(user_id, users)

    if user is None:
        return jsonify({
            "success": False,
            "message": "User not found."
        }), 404

    return jsonify({
        "success": True,
        "message": "Order history loaded.",
        "orders": user["orders"]
    })

if __name__ == "__main__":
    app.run(debug=True)