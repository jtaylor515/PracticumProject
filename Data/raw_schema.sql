CREATE TABLE IF NOT EXISTS raw_business (
    business_id VARCHAR(500),
    name VARCHAR(500),
    address VARCHAR(500),
    city VARCHAR(500),
    state VARCHAR(500),
    postal_code VARCHAR(500),
    latitude VARCHAR(500),
    longitude VARCHAR(500),
    stars VARCHAR(500),
    review_count VARCHAR(500),
    is_open VARCHAR(500),
    attributes jsonb,
    categories TEXT,
    hours jsonb
);

CREATE TABLE IF NOT EXISTS raw_checkin(
	business_id VARCHAR(500),
	date TEXT 
);

CREATE TABLE IF NOT EXISTS raw_photos(
	photo_id VARCHAR(500),
	business_id VARCHAR(500),
	caption TEXT,
	label VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS raw_review(
	review_id VARCHAR(500),
	user_id VARCHAR(500),
	business_id VARCHAR(500),
	stars VARCHAR(500),
	useful VARCHAR(500),
	funny VARCHAR(500),
	cool VARCHAR(500),
	text TEXT,
	date VARCHAR(500)	
);

CREATE TABLE IF NOT EXISTS raw_tip (
    user_id VARCHAR(500),
    business_id VARCHAR(500),
    text TEXT,
    date VARCHAR(500),
    complement_count VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS raw_user (
    user_id VARCHAR(500),
    name VARCHAR(500),
    review_count VARCHAR(500),
    yelping_since VARCHAR(500),
    useful VARCHAR(500),
    funny VARCHAR(500),
    cool VARCHAR(500),
    elite TEXT,
    friends TEXT,
    fans VARCHAR(500),
    average_stars VARCHAR(500),
    compliment_hot VARCHAR(500),
    compliment_more VARCHAR(500),
    compliment_profile VARCHAR(500),
    compliment_cute VARCHAR(500),
    compliment_list VARCHAR(500),
    comliment_note VARCHAR(500),
    compliment_plain VARCHAR(500),
    compliment_cool VARCHAR(500),
    compliment_funny VARCHAR(500),
    compliment_writer VARCHAR(500),
    compliment_photos VARCHAR(500)
);
