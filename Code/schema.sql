CREATE TABLE Businesses (
  business_id VARCHAR(22) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  state CHAR(2),
  postal_code VARCHAR(10),
  latitude FLOAT,
  longitude FLOAT,
  stars DECIMAL(2, 1),
  review_count INT,
  is_open TINYINT,
  
  /* Additional columns for attributes (consider storing as JSONB) */
  attributes JSONB,
  
  /* Foreign key for referencing categories table */
  category_id INT,
  FOREIGN KEY (category_id) REFERENCES Categories(category_id)
);

CREATE TABLE Reviews (
  review_id VARCHAR(22) PRIMARY KEY,
  user_id VARCHAR(22) NOT NULL,
  business_id VARCHAR(22) NOT NULL,
  stars INT,
  date DATE NOT NULL,
  text TEXT,
  useful INT,
  funny INT,
  cool INT,

  /* Foreign key for referencing users and businesses table */
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (business_id) REFERENCES Businesses(business_id)
);

CREATE TABLE Users (
  user_id VARCHAR(22) PRIMARY KEY,
  name VARCHAR(255),
  review_count INT,
  yelping_since DATE,

  /* Additional columns for various user data (consider storing as JSONB) */
  user_data JSONB,

  /* Foreign key for referencing friends table */
  friend_id INT,
  FOREIGN KEY (friend_id) REFERENCES Users(user_id)
);

CREATE TABLE Checkins (
  business_id VARCHAR(22) NOT NULL,
  checkin_time DATETIME,
  
  /* Foreign key for referencing businesses table */
  PRIMARY KEY (business_id, checkin_time),
  FOREIGN KEY (business_id) REFERENCES Businesses(business_id)
);

CREATE TABLE Tips (
  tip_id INT PRIMARY KEY AUTO_INCREMENT,
  text TEXT NOT NULL,
  date DATE NOT NULL,
  compliment_count INT,
  
  /* Foreign key for referencing businesses and users table */
  business_id VARCHAR(22) NOT NULL,
  user_id VARCHAR(22) NOT NULL,
  FOREIGN KEY (business_id) REFERENCES Businesses(business_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Photos (
  photo_id VARCHAR(22) PRIMARY KEY,
  business_id VARCHAR(22) NOT NULL,
  caption VARCHAR(255),
  label VARCHAR(255),
  
  /* Foreign key for referencing businesses table */
  FOREIGN KEY (business_id) REFERENCES Businesses(business_id)
);

CREATE TABLE Categories (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(255) NOT NULL UNIQUE
);
