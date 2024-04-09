# Testing SQL Query AI Bot User
try:
  import psycopg2
except ImportError:
  import subprocess
  subprocess.run(["pip", "install", "psycopg2-binary"])
  import psycopg2
  print("psycopg2 installed successfully!")


# Connect to the PostgreSQL server
conn = psycopg2.connect(
    host="envitas-db.cj44ees44tpz.us-east-1.rds.amazonaws.com",
    database="postgres",
    user="bot",
    password="envitas123"
)

# Create a cursor object to interact with the database
cur = conn.cursor()

# Set the search path to 'yelp' schema
cur.execute("SET search_path TO yelp")

# Execute the query
query = "SELECT name, address, city, state, stars, review_count FROM raw_business LIMIT 10;"
cur.execute(query)

# Fetch all the results
results = cur.fetchall()

# Print the results
for row in results:
    print(row)

# Close the cursor and connection
cur.close()
conn.close()
