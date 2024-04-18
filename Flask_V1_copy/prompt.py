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

Follow these instructions:
1. Identify the hard criteria from the user's query.
2. Convert the query to executable Python code using Pandas.
3. Filter the restaurant data based on the identified criteria.
4. Sort the filtered data by the 'stars' column in descending order.
5. Return the 'name', 'review_count', and 'stars' columns of the top 5 results.
6. The output should be a Pandas expression that can be executed on the DataFrame.

Example Pandas expressions:
- Filter by category and city, sort by stars, and return top 5 names, review counts, and stars:
df[(df['categories'].str.contains('Mexican')) & (df['city'] == 'Atlanta')].sort_values('stars', ascending=False).head(5)[['name', 'review_count', 'stars']]
- Filter by multiple categories and review count, sort by stars, and return top 5 names, review counts, and stars:
df[(df['categories'].str.contains('Italian|Pizza')) & (df['city'] == 'Atlanta') & (df['review_count'] > 100)].sort_values('stars', ascending=False).head(5)[['name', 'review_count', 'stars']]

Query: {query_str}
Expression:"""
    )

def create_response_prompt():
    return PromptTemplate(
        template="""\
The final answer to the user should only be a json object containing the information of the pandas rows you recieve. It should include the restaurant's: "id, name, review_count, and stars." Exactly as written here.
Output just a json object and nothing more.
"""
    )