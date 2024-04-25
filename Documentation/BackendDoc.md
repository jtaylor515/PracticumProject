## Data

[Data](https://www.yelp.com/dataset/documentation/main)

## Data Pipeline

1. Download JSON Data
2. Convert JSON to CSV
3. Copy to PostgreSQL AWS RDS through EC2 pipe
4. Query direct to RDS from LlamaIndex running on EC2

## Enriched Data Pipeline

1. Filter data to Philadelphia and randomly select 10% of reviews for each restuarant
2. Enrich the text of each review with specified GPT Prompt
3. Final enriched data has review_id and enriched text in JSON format

## LlamaIndex Pipeline

TODO: GABRIEL FILL OUT

## Hosting Pipeline

Private EC2 running NGINX reverse proxy to public IP from Flask app run by `main.py`
