
CREATE TABLE IF NOT EXISTS timetable(
id SERIAL PRIMARY KEY,
class_id INT REFERENCES classes(id),
day VARCHAR(20) NOT NULL,
period_id INT REFERENCES periods(id),
subject_id INT REFERENCES subjects(id),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);