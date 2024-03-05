import psycopg2
import json

# Function to execute SQL commands from a file
def execute_sql_file(cursor, file_path):
    with open(file_path, 'r') as sql_file:
        cursor.execute(sql_file.read())

# Function to import JSON data into a PostgreSQL table
def import_json_data(cursor, table_name, json_file_path):
    with open(json_file_path, 'r') as json_file:
        data = json.load(json_file)
        columns = ', '.join(data[0].keys())
        placeholders = ', '.join(['%s'] * len(data[0]))
        query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
        cursor.executemany(query, [tuple(row.values()) for row in data])

# AWS RDS PostgreSQL connection parameters
host = 'your_rds_instance_endpoint'
port = '5432'
database = 'your_database_name'
user = 'your_username'
password = 'your_password'

# Connect to the PostgreSQL database
connection = psycopg2.connect(
    host=host,
    port=port,
    database=database,
    user=user,
    password=password
)

# Create a cursor object
cursor = connection.cursor()

# Path to your SQL schema file
schema_file_path = 'path_to_your_schema_file.sql'

# Path to your JSON data files
json_data_files = {
    'table1': 'path_to_table1_data.json',
    'table2': 'path_to_table2_data.json',
    # Add more tables as needed
}

try:
    # Load schema
    execute_sql_file(cursor, schema_file_path)
    
    # Import data into each table
    for table_name, json_file_path in json_data_files.items():
        import_json_data(cursor, table_name, json_file_path)
    
    # Commit the transaction
    connection.commit()
    print("Data imported successfully!")

except (Exception, psycopg2.DatabaseError) as error:
    print("Error:", error)
    connection.rollback()

finally:
    # Close the cursor and connection
    cursor.close()
    connection.close()
