from llama_index.core import PromptTemplate

def create_restaurant_prompt():
    restaurant_prompt = PromptTemplate(
        "Based on the restaurants information provided, please help me find the most relevant restaurants for the following query: {query}",
        "Please provide the final answer in the specified JSON format, including only the requested information from the matching restaurants.",
    )
    return restaurant_prompt