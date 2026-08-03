CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id),

    regno VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    gender VARCHAR(20),
    dob DATE,
    phone VARCHAR(15),

    class_id INT NOT NULL REFERENCES classes(id),

    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);