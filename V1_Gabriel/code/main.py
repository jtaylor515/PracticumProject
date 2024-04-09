import os
import time
from dotenv import load_dotenv
from llama_index.llms.openai import OpenAI
from llama_index.core import SQLDatabase
from llama_index.core.query_engine import NLSQLTableQueryEngine
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.core.agent import ReActAgent
from sqlalchemy import create_engine
from prompt import create_restaurant_prompt

def main():
    load_dotenv()
    os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

    # Connect to the PostgreSQL server
    conn_string = "postgresql://bot:envitas123@envitas-db.cj44ees44tpz.us-east-1.rds.amazonaws.com/postgres"
    engine = create_engine(conn_string)

    # Create a SQLDatabase object
    sql_database = SQLDatabase(engine, schema="yelp", include_tables=["raw_business"])

    # Create an NLSQLTableQueryEngine
    restaurant_query_engine = NLSQLTableQueryEngine(sql_database=sql_database, llm=OpenAI(), verbose=True)
    restaurant_prompt = create_restaurant_prompt()
    restaurant_query_engine.update_prompts({"pandas_prompt": restaurant_prompt})

    # Create a tool for the restaurant data
    restaurant_tool = QueryEngineTool(
        query_engine=restaurant_query_engine,
        metadata=ToolMetadata(
            name="restaurant_data",
            description="Provides information about restaurants in Atlanta based on the Yelp academic dataset",
        ),
    )

    # Create an agent
    llm = OpenAI(model="gpt-4-turbo-preview")
    agent = ReActAgent.from_tools([restaurant_tool], llm=llm, verbose=True)

    # User interaction loop
    while True:
        prompt = input("Enter a restaurant search query (q to quit): ")
        if prompt == "q":
            break

        # Timing start for query processing
        start_time = time.time()
        result = agent.query(prompt)
        # Timing end for query processing
        end_time = time.time()
        query_processing_time = end_time - start_time

        # Count characters sent to LLM
        characters_sent = len(prompt) + len(restaurant_prompt.template)

        print(f"Query processing time: {query_processing_time} seconds")
        print(f"Characters sent to LLM: {characters_sent}")
        print(f"Result: {result}")

if __name__ == "__main__":
    main()