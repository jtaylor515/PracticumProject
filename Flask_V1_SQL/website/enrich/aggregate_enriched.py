import psycopg2
import json

def fetch_review_to_business_mapping():
    # Database connection parameters
    host = "envitas-db.cj44ees44tpz.us-east-1.rds.amazonaws.com"
    database = "postgres"
    user = "bot"
    password = "envitas123"
    
    # Connect to the PostgreSQL database
    conn = psycopg2.connect(host=host, database=database, user=user, password=password)
    cur = conn.cursor()
    
    # Set the search path to the 'yelp' schema
    cur.execute("SET search_path TO yelp")
    
    # Fetch the mapping from review IDs to business IDs
    query = "SELECT review_id, business_id FROM raw_review"
    cur.execute(query)
    results = cur.fetchall()
    
    # Close the cursor and connection
    cur.close()
    conn.close()
    
    # Create a dictionary to map review IDs to business IDs
    review_to_business = {review_id: business_id for review_id, business_id in results}
    return review_to_business

def aggregate_reviews(review_to_business, json_filename):
    # Load JSON data
    with open(json_filename, 'r') as file:
        reviews = json.load(file)

    # Aggregate reviews by business ID
    business_reviews = {}
    for review_id, details in reviews.items():
        business_id = review_to_business.get(review_id)
        if business_id:
            if business_id not in business_reviews:
                business_reviews[business_id] = []
            business_reviews[business_id].append(details)

    return business_reviews

def save_to_json(data, output_filename):
    with open(output_filename, 'w') as file:
        json.dump(data, file, indent=4)

# Fetch the mapping from the database
review_to_business = fetch_review_to_business_mapping()

# Aggregate the reviews based on the fetched mapping
business_reviews = aggregate_reviews(review_to_business, 'enriched_final.json')

# Save the aggregated reviews to a JSON file
save_to_json(business_reviews, 'aggregated_reviews.json')
