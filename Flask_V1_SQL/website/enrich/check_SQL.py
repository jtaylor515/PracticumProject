import psycopg2

print("Connecting to the database...")
# Connect to the database
conn = psycopg2.connect(
    host="envitas-db.cj44ees44tpz.us-east-1.rds.amazonaws.com",
    database="postgres",
    user="postgres",
    password="password"
)

# Create a cursor object
cur = conn.cursor()

# Set the search path to 'yelp' schema
cur.execute("SET search_path TO yelp")

print("Fetching column names and the first entry from new_raw_business...")
# Fetch column names from the table
cur.execute("SELECT * FROM new_raw_review LIMIT 0;")
colnames = [desc[0] for desc in cur.description]
print("Column Names:", colnames)

# Fetch the first entry from the table
cur.execute("SELECT * FROM new_raw_review LIMIT 2;")
first_entry = cur.fetchall()
print("First Entry:", first_entry)

print("Closing the connection...")
# Close the cursor and connection
cur.close()
conn.close()

print("Script execution completed.")
