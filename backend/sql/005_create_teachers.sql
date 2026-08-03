
CREATE TABLE IF NOT EXISTS teachers(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    empid VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(20),
    last_name VARCHAR(20),
    gender VARCHAR(10),
    dob DATE,
    phone VARCHAR(20),
    classincharge VARCHAR(20),
    classsection VARCHAR(20),
    subject VARCHAR(20),
    qualification VARCHAR(20),
    address_line1 VARCHAR(50),
    address_line2 VARCHAR(50),
    city VARCHAR(50),
    state VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);