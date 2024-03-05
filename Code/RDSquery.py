import psycopg2

# Database connection parameters
host = 'your-rds-endpoint.amazonaws.com'
port = '5432'
database = 'your_database_name'
user = 'your_username'
password = 'your_password'

# Connect to the database
try:
    conn = psycopg2.connect(
        dbname=database,
        user=user,
        password=password,
        host=host,
        port=port
    )
    print("Connected to the database successfully!")
except psycopg2.Error as e:
    print("Unable to connect to the database.")
    print(e)
    exit()

# Open a cursor to perform database operations
cur = conn.cursor()

# Execute a sample query
try:
    cur.execute("SELECT * FROM your_table;")
    rows = cur.fetchall()
    for row in rows:
        print(row)
except psycopg2.Error as e:
    print("Error executing query:")
    print(e)

# Close cursor and connection
cur.close()
conn.close()
