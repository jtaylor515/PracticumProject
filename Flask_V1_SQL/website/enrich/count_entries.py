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

print("Counting entries with is_open set to 1...")
# Count the number of entries with is_open set to 1
count_query_1 = '''
    SELECT COUNT(*)
    FROM new_raw_business
    WHERE is_open = '1';
'''
cur.execute(count_query_1)
count_1 = cur.fetchone()[0]

print("Counting entries with is_open set to 0...")
# Count the number of entries with is_open set to 0
count_query_0 = '''
    SELECT COUNT(*)
    FROM new_raw_business
    WHERE is_open = '0';
'''
cur.execute(count_query_0)
count_0 = cur.fetchone()[0]

print("Results:")
print(f"Number of entries with is_open set to 1: {count_1}")
print(f"Number of entries with is_open set to 0: {count_0}")

print("Closing the connection...")
# Close the cursor and connection
cur.close()
conn.close()

print("Script execution completed.")