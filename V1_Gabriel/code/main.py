import time
from dotenv import load_dotenv
import os
import pandas as pd
from llama_index.core.query_engine import PandasQueryEngine
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.core.agent import ReActAgent
from llama_index.llms.openai import OpenAI
from prompt import create_restaurant_prompt

def main():
    load_dotenv()
    os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

    # Load the CSV data
    csv_path = os.path.join("../data/atlanta", "yelp_atl_restaurants.csv")
    restaurant_df = pd.read_csv(csv_path)

    # Create a PandasQueryEngine
    restaurant_query_engine = PandasQueryEngine(df=restaurant_df, verbose=True)
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
    llm = OpenAI(model="gpt-3.5-turbo")
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
