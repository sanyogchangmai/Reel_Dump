CREATE DATABASE reel_dump_dev;

CREATE TABLE reels(
    rid SERIAL PRIMARY KEY,
    uid int references users(uid) NOT NULL,
    reel_link varchar(300) NOT NULL UNIQUE,
    thumbnail varchar(300) NOT NULL,
    name varchar(100) UNIQUE DEFAULT NULL,
    category varchar(100) DEFAULT 'all',
    timestamp timestamp default current_timestamp
);