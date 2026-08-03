
CREATE TABLE IF NOT EXISTS classes(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    standard_id INT NOT NULL REFERENCES standards(id)
);