CREATE DATABASE reel_dump_dev;

CREATE TABLE users(
    uid SERIAL PRIMARY KEY,
    email varchar(50) NOT NULL UNIQUE,
    password varchar(200) NOT NULL,
    timestamp timestamp default current_timestamp
);

