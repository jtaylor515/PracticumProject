from flask import Blueprint, render_template, request, flash, jsonify
from flask_login import login_required, current_user
from .models import Note
from . import db
import json
from .__init__ import load_backend

views = Blueprint('views', __name__)

@views.route('/')
def home():
    return render_template("home.html", user=current_user)

@views.route('/reservations')
def dashboard():
    return render_template("reservations.html")

@views.route('/restaurant-search')
def restaurant_search():
    return render_template("restaurant_search.html")

@views.route('/api/search', methods=['POST'])
def search():
    agent = load_backend()  
    search_query = request.json['query']
    
    # Simulate the response object from OpenAI or your custom setup
    response = agent.query(search_query)
    
    # Properly convert the response object's content to string
    # Precondition: Assuming your response from agent.query() 
    # already returns a complete string description of the restaurants
    response_string = str(response)  # Example direct conversion (adjust based on the actual response object you have)

    # Option to further process the response_string if needed, then send as JSON
    return jsonify({"result": response_string})