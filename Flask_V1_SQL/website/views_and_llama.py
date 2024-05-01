import json
import os
from flask import Blueprint, render_template, request, jsonify
from flask_login import current_user
from dotenv import load_dotenv
from llama_index.core.indices.struct_store.sql_query import SQLTableRetrieverQueryEngine
from llama_index.core.objects import SQLTableNodeMapping, ObjectIndex, SQLTableSchema
from llama_index.core import VectorStoreIndex, SQLDatabase
from llama_index.llms.openai import OpenAI
from sqlalchemy import create_engine

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
    table_name = "new_raw_business"

    # Manually create the table schema
    table_schema_obj = SQLTableSchema(
        table_name="new_raw_business",
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
        sql_database, obj_index.as_retriever(similarity_top_k=10), llm=llm
    )

    search_query = request.json['query']
    print(request.json['query'])

    context_prompt = """
    Recommend me 5 restaurants from our database as json objects in this EXACT format bellow, make sure to always display these 5 fields too (id, name, review_count, stars, relevant_categories). Include a maximum of 8 of relevant categories you deem appropriate (try your best to include the ones mentioned on the user's query). Pick and order the results based on your best judgement, on the relevant categories and the user's query. Include the relevant categories exactly as their are listed on the database. ONLY include restaurants that are on the database. Reply only with the JSON.
    Example entry format (not to be included):
    {
        "recommendations": [
            {
                "id": "1mHwv5rp5aKqVcFtNTBVVQ",
                "name": "The Iberian Pig",
                "review_count": 184,
                "stars": 4.5,
                "relevant_categories": {
                    "Spanish": true,
                    "Food": 5.0,
                    "Pan con Tomates": 4.8
                }
            },
            {
                "id": "FmHwv5rp5wKqVcFiNTAVVQ",
                "name": "Buena Vida Tapas & Sol",
                "review_count": 124,
                "stars": 4.5,
                "relevant_categories": {
                    "Tapas": true,
                    "outdoor seating": true,
                    "Service": 5.0,
                    "Desert": 3.2,
                    "House's Special Cuban Sandwich": 4.6
                }
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
            # Fetch photo IDs from new_photos table
            query = "SELECT photo_id FROM new_photos WHERE business_id = %s"
            cur.execute(query, (restaurant_id,))
            new_photo_results = cur.fetchall()

            # Start with photo IDs from new_photos
            photo_list = [result[0] for result in new_photo_results]
            unique_photo_ids = set(photo_list)  # Use a set to track what we've seen

            # Fetch photo IDs from raw_photos table
            query = "SELECT photo_id FROM raw_photos WHERE business_id = %s"
            cur.execute(query, (restaurant_id,))
            raw_photo_results = cur.fetchall()

            # Append only new unique photo IDs from raw_photos
            for result in raw_photo_results:
                if result[0] not in unique_photo_ids:
                    photo_list.append(result[0])
                    unique_photo_ids.add(result[0])

            photo_ids[restaurant_id] = photo_list

        print(photo_ids)

        # Fetch restaurant details from the new_raw_business table
        restaurant_details = {}
        for restaurant_id in restaurant_ids:
            query = "SELECT address, city, state, hours FROM new_raw_business WHERE business_id = %s"
            cur.execute(query, (restaurant_id,))
            result = cur.fetchone()
            if result:
                restaurant_details[restaurant_id] = {
                    'address': result[0],
                    'city': result[1],
                    'state': result[2],
                    'hours': result[3]
                }
            else:
                restaurant_details[restaurant_id] = {
                    'address': '',
                    'city': '',
                    'state': '',
                    'hours': {}
                }

        print(restaurant_details)

        # Fetch the best review based on highest stars and most useful votes
        reviews = {}
        for restaurant_id in restaurant_ids:
            query = """
            SELECT text, stars 
            FROM new_raw_review 
            WHERE business_id = %s 
            ORDER BY CAST(stars AS INTEGER) DESC, CAST(useful AS INTEGER) DESC 
            LIMIT 1
            """
            cur.execute(query, (restaurant_id,))
            result = cur.fetchone()
            if result:
                reviews[restaurant_id] = {
                    'text': result[0],
                    'stars': result[1]
                }
            else:
                reviews[restaurant_id] = {
                    'text': 'No reviews available for this restaurant.',
                    'stars': 'N/A'
                }

        # Close the cursor and connection
        cur.close()
        conn.close()

        # Add the photo IDs, addresses, and hours to the JSON response
        for i, restaurant in enumerate(json_data['recommendations']):
            restaurant['photo_ids'] = photo_ids[restaurant['id']]
            restaurant['address'] = restaurant_details[restaurant['id']]['address']
            restaurant['city'] = restaurant_details[restaurant['id']]['city']
            restaurant['state'] = restaurant_details[restaurant['id']]['state']
            restaurant['hours'] = restaurant_details[restaurant['id']]['hours']
            restaurant_id = restaurant['id']
            restaurant['review'] = reviews[restaurant_id]['text']
            restaurant['review_stars'] = reviews[restaurant_id]['stars']

        print(json_data)
        return jsonify(json_data)

    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON response"}), 400