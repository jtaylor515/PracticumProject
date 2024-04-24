from flask import Blueprint, render_template, request, flash, jsonify
from flask_login import login_required, current_user
from .models import Note
from . import db
import json
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager
import time
from dotenv import load_dotenv
import os
from llama_index.core.indices.struct_store.sql_query import SQLTableRetrieverQueryEngine
from llama_index.core.objects import SQLTableNodeMapping, ObjectIndex, SQLTableSchema
from llama_index.core import VectorStoreIndex, SQLDatabase
from llama_index.llms.openai import OpenAI
from sqlalchemy import create_engine, text, inspect

try:
    import psycopg2
except ImportError:
    import subprocess
    subprocess.run(["pip", "install", "psycopg2-binary"])
    import psycopg2

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
    load_dotenv()
    os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

    # Create a SQLAlchemy engine
    db_url = "postgresql://bot:envitas123@envitas-db.cj44ees44tpz.us-east-1.rds.amazonaws.com/postgres"
    engine = create_engine(db_url)

    # Define the table name
    table_name = "raw_business"

    # Manually create the table schema
    table_schema_obj = SQLTableSchema(
        table_name="raw_business",
        columns=[
            {"name": "business_id", "type": "varchar"},
            {"name": "name", "type": "varchar"},
            {"name": "address", "type": "varchar"},
            {"name": "city", "type": "varchar"},
            {"name": "state", "type": "varchar"},
            {"name": "postal_code", "type": "varchar"},
            {"name": "latitude", "type": "varchar"},
            {"name": "longitude", "type": "varchar"},
            {"name": "stars", "type": "varchar"},
            {"name": "review_count", "type": "varchar"},
            {"name": "is_open", "type": "varchar"},
            {"name": "attributes", "type": "jsonb"},
            {"name": "categories", "type": "text"},
            {"name": "hours", "type": "jsonb"},
        ],
    )

    # Create SQLDatabase object with the 'yelp' schema
    sql_database = SQLDatabase(engine=engine, schema='yelp')

    # Set up the OpenAI LLM
    os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
    llm = OpenAI(temperature=0.1, model="gpt-3.5-turbo")

    table_node_mapping = SQLTableNodeMapping(sql_database)

    obj_index = ObjectIndex.from_objects(
        [table_schema_obj],
        table_node_mapping,
        VectorStoreIndex,
    )

    query_engine = SQLTableRetrieverQueryEngine(
        sql_database, obj_index.as_retriever(similarity_top_k=1), llm=llm
    )

    search_query = request.json['query']
    print(request.json['query'])

    context_prompt = """
    Recommend me 5 restaurants as json objects in this exact format, in your sql query, make sure to always display these 4 fields too (id, name, review_count, stars) Always order the results on the SQL table by review_count.
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
        },
        ...
    ]
    }
    User's restaurant query:
    """

    response = query_engine.query(context_prompt + search_query)
    print(response)

    try:
        json_data = json.loads(str(response))

        # Extract the restaurant IDs from the JSON response
        restaurant_ids = [restaurant['id'] for restaurant in json_data['recommendations']]
        print(restaurant_ids)

        # Connect to the database
        conn = psycopg2.connect(
            host="envitas-db.cj44ees44tpz.us-east-1.rds.amazonaws.com",
            database="postgres",
            user="bot",
            password="envitas123"
        )

        # Create a cursor object
        cur = conn.cursor()

        # Set the search path to 'yelp' schema
        cur.execute("SET search_path TO yelp")

        # Fetch photo IDs for each restaurant ID
        photo_ids = {}
        for restaurant_id in restaurant_ids:
            query = "SELECT photo_id FROM new_photos WHERE business_id = %s"
            cur.execute(query, (restaurant_id,))
            results = cur.fetchall()
            photo_ids[restaurant_id] = [result[0] for result in results]

        print(photo_ids)

        # Close the cursor and connection
        cur.close()
        conn.close()

        # Add the photo IDs to the JSON response
        for i, restaurant in enumerate(json_data['recommendations']):
            restaurant['photo_ids'] = photo_ids[restaurant['id']]

        print(json_data)
        return jsonify(json_data)
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON response"}), 400
