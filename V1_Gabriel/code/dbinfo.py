import psycopg2

# Connect to the PostgreSQL server
conn = psycopg2.connect(
    host="envitas-db.cj44ees44tpz.us-east-1.rds.amazonaws.com",
    database="postgres",
    user="bot",
    password="envitas123"
)

# Create a cursor object to interact with the database
cur = conn.cursor()

# Set the search path to the 'yelp' schema
cur.execute("SET search_path TO yelp;")

# Check if the 'raw_business' table exists in the 'yelp' schema
cur.execute("""
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'yelp'
        AND table_name = 'raw_business'
    );
""")

# Fetch the result
result = cur.fetchone()

if result[0]:
    print("The 'raw_business' table exists in the 'yelp' schema.")
else:
    print("The 'raw_business' table does not exist in the 'yelp' schema.")

# Close the cursor and connection
cur.close()
conn.close()