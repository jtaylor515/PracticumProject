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

    json_prompt = """\
    "Final answer should be in json format, and nothing more. Include id, name, review_count, and stars. Exaclty as the names of the items and the collums as shown on the pandas table. Ex format: {
    "recommendations": [
    {
        "id": "244",
        "name": "The Iberian Pig",
        "review_count": 184,
        "stars": 4.5
    },
    {
        "id": "2585",
        "name": "Buena Vida Tapas & Sol",
        "review_count": 124,
        "stars": 4.5
    } ] }
    """
    response = agent.query(search_query + json_prompt)
    try:
        json_data = json.loads(str(response))
        return jsonify(json_data)
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON response"}), 400