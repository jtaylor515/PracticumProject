from flask import Blueprint, render_template, request, flash, jsonify
from flask_login import login_required, current_user
from .models import Note
from . import db
import json

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