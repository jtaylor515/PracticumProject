from llama_index.core import PromptTemplate

def create_restaurant_prompt():
    return PromptTemplate(
        template="""\
You are working with a pandas dataframe named 'df'. The dataframe contains information about restaurants in Atlanta.

Columns:
- name: Name of the restaurant (string)
- categories: Categories the restaurant belongs to (string)
- city: City where the restaurant is located (string)
- stars: Yelp rating of the restaurant (float)
- review_count: Number of reviews for the restaurant (integer)

Example Pandas expressions:
- Filter by category and city, sort by stars, and return top 5 names, review counts, and stars:
df[(df['categories'].str.contains('Mexican')) & (df['city'] == 'Atlanta')].sort_values('stars', ascending=False).head(5)[['name', 'review_count', 'stars']]
- Filter by multiple categories and review count, sort by stars, and return top 5 names, review counts, and stars:
df[(df['categories'].str.contains('Italian|Pizza')) & (df['city'] == 'Atlanta') & (df['review_count'] > 100)].sort_values('stars', ascending=False).head(5)[['name', 'review_count', 'stars']]

Query: {query_str}
Expression:"""
    )

instruction_str = (
    "Follow these instructions:\n"
    "1. Identify the hard criteria from the user's query.\n"
    "2. Convert the query to executable Python code using Pandas.\n"
    "3. Filter the restaurant data based on the identified criteria.\n"
    "4. Sort the filtered data by the 'stars' column in descending order.\n"
    "5. Return the 'name', 'review_count', and 'stars' columns of the top 5 results.\n"
    "6. The output should be a Pandas expression that can be executed on the DataFrame.\n"
)

pandas_prompt_str = (
    "You are working with a pandas dataframe in Python.\n"
    "The name of the dataframe is `df`.\n"
    "This is the result of `print(df.head())`:\n"
    "{df_str}\n\n"
    "Follow these instructions:\n"
    "{instruction_str}\n"
    "Query: {query_str}\n\n"
    "Expression:"
)

response_synthesis_prompt_str = (
    "Given an input question, synthesize a response from the query results.\n"
    "Query: {query_str}\n\n"
    "Pandas Output: {pandas_output}\n\n"
    "Always write the final restaurant answers in the following structure: `[%<number>%] Restaurant Name: <Restaurant Name>, Stars: <stars>, Reviews: <review_count> [%<number>%]`. Each restaurant's information should be enclosed between "[%" "%]" markers.\n"
    "Example structure for final response (ensure consistency and use this structure for responses):\n"
    "- `[%1%] Restaurant Name: Rico Rico Latin Kitchen, Stars: 5.0, Reviews: 21 [%1%]`\n"
    "- `[%2%] Restaurant Name: Low Fresh Meat Mexican Restaurant, Stars: 5.0, Reviews: 5 [%2%]`\n"
    "- `[%3%] Restaurant Name: Taqueria Rojas, Stars: 5.0, Reviews: 6 [%3%]`\n"
    "- `[%4%] Restaurant Name: Arepa Grill, Stars: 5.0, Reviews: 6 [%4%]`\n"
    "- `[%5%] Restaurant Name: Proposito, Stars: 5.0, Reviews: 28 [%5%]`\n"
    "Response: "
)
pandas_prompt = PromptTemplate(pandas_prompt_str).partial_format(
    instruction_str=instruction_str, df_str=df.head(5)
)


def create_response_synthesis_prompt():
    return PromptTemplate(
        response_synthesis_prompt_str="""\
    Given an input question, synthesize a response from the query results.
    Query: {query_str}
    Pandas Output: {pandas_output}
    Always write the final restaurant answers in the following structure: `[%<number>%] Restaurant Name: <Restaurant Name>, Stars: <stars>, Reviews: <review_count> [%<number>%]`. Each restaurant's information should be enclosed between [% %] markers.
    Example structure for final response (ensure consistency and use this structure for responses):
    - `[%1%] Restaurant Name: Rico Rico Latin Kitchen, Stars: 5.0, Reviews: 21 [%1%]`
    - `[%2%] Restaurant Name: Low Fresh Meat Mexican Restaurant, Stars: 5.0, Reviews: 5 [%2%]`
    - `[%3%] Restaurant Name: Taqueria Rojas, Stars: 5.0, Reviews: 6 [%3%]`
    - `[%4%] Restaurant Name: Arepa Grill, Stars: 5.0, Reviews: 6 [%4%]`
    - `[%5%] Restaurant Name: Proposito, Stars: 5.0, Reviews: 28 [%5%]`
    Response: """
    )