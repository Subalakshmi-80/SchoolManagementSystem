const pool = require('../db/db')

const createTest = (req, res) => {
    const {
        name,
        class_id,
        subject_id,
        test_date
    } = req.body;

    pool.query(`SELECT * FROM tests WHERE name=$1 AND class_id=$2 AND subject_id=$3 AND test_date=$4`,
        [name, class_id, subject_id, test_date],
        (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).send("Database Error")
            }
            if (result.rows.length > 0) {
                return res.status(409).send("Test Already Exists.")
            }
            pool.query(`INSERT INTO tests(name,class_id,subject_id,test_date) VALUES ($1,$2,$3,$4)`,
                [name, class_id, subject_id, test_date],

                (err, result) => {
                    if (err) {
                        return res.status(500).send("Database Error")
                    }
                    return res.status(201).send("Test Created Successfully")
                }

            )
        }
    )

}


const getTests = (req, res) => {
    pool.query(`SELECT 
        t.id,
        t.name,
         st.name || '-' ||c.name As class_name,
        s.subject_name,
         TO_CHAR(t.test_date, 'YYYY-MM-DD') AS test_date
       
        
         FROM tests t JOIN subjects s ON t.subject_id = s.id
        JOIN classes c ON t.class_id = c.id 
        JOIN standards st ON c.standard_id = st.id `, (err, result) => {
        if (err) {
            return res.status(500).send(err)
        }
        return res.status(200).send(result.rows)
    })
}

const getoneTest = (req, res) => {
    const id = req.params.id;

    pool.query(`SELECT
        t.id,
        t.name,
        t.class_id,
        t.subject_id,
        st.name || '-' || c.name AS class_name,
        s.subject_name,
        TO_CHAR(t.test_date, 'YYYY-MM-DD') AS test_date
        
        FROM tests t JOIN subjects s ON s.id = t.subject_id
        JOIN classes c ON t.class_id = c.id
        JOIN standards st ON st.id=c.standard_id 
        WHERE t.id=$1
        `, [id], (err, result) => {
        if (err) {
            return res.status(500).send("Database Error")
        }
        if (result.rows.length === 0) {
            return res.status(404).send("Test not found.")
        }
        return res.status(200).send(result.rows[0])
    })
}


const updateTest = (req, res) => {
    const {
        name,
        class_id,
        subject_id,
        test_date
    } = req.body;

    const id = req.params.id;

    pool.query(`SELECT * FROM tests WHERE name=$1 AND class_id=$2 AND subject_id=$3 AND test_date=$4 AND id !=$5`,
        [name, class_id, subject_id, test_date, id], (err, result) => {
            if (err) {
                return res.status(500).send("Database Error")
            }
            if (result.rows.length > 0) {
                return res.status(409).send("Test Already Exists");
            }
            pool.query(`SELECT * FROM tests WHERE id=$1`, [id],
                (err, result) => {
                    if (err) {
                        return res.status(500).send("Database Error")
                    }
                    if (result.rows.length === 0) {
                        return res.status(404).send("Test Not Found");
                    }
                    const tests = result.rows[0]

                    pool.query(`SELECT * FROM marks WHERE test_id=$1`, [id], (err, markResult) => {
                        if (err) {
                            return res.status(500).send("Database Error");
                        }

                        if (markResult.rows.length > 0 && class_id != tests.class_id) {
                            return res.status(409).send("Cannot change class. Marks have already been entered for this test.")
                        }
                        const updatedName = name || tests.name;
                        const updatedClassId = class_id || tests.class_id;
                        const updatedSubjectId = subject_id || tests.subject_id;
                        const updatedTestDate = test_date || tests.test_date;

                        pool.query(`UPDATE tests SET name=$1,class_id=$2,subject_id=$3,test_date=$4 WHERE id=$5`,
                            [updatedName, updatedClassId, updatedSubjectId, updatedTestDate, id],
                            (err, result) => {
                                if (err) {
                                    return res.status(500).send("Database Error")
                                }
                                return res.status(200).send("Test Updated Successfully.")
                            }
                        )
                    })



                }
            )
        }

    )

}


const deleteTest = (req, res) => {
    const id = req.params.id;

    pool.query(`SELECT * FROM tests WHERE id=$1`, [id],
        (err, result) => {
            if (err) {
                console.log(err)
                return res.status(500).send("Database Error");
            }
            if (result.rows.length === 0) {
                return res.status(404).send("Test not found.")
            }
            const test = result.rows[0]
            pool.query(`DELETE FROM marks WHERE test_id=$1`, [id], (err) => {
                if (err) {
                    return res.status(500).send("Database Error")
                }
                pool.query(`DELETE FROM tests WHERE id=$1`, [id],
                    (err) => {
                        if (err) {

                            return res.status(500).send("Database Error");
                        }
                        return res.status(200).send(`${test.name} deleted successfully`)
                    }
                )
            })

        }
    )
}


// get students by test

const getStudentByTest = (req, res) => {
    const testId = req.params.id;

    pool.query(`SELECT * FROM tests WHERE id=$1`, [testId], (err, result) => {
        if (err) {
            return res.status(500).send("Database Error");
        }
        if (result.rows.length === 0) {
            return res.status(404).send("Test Not Found.");
        }
        const cls_id = result.rows[0].class_id

        pool.query(`SELECT 
            s.id,
            s.regno,
            s.first_name,
            s.last_name,
            st.name || '-' || c.name AS class_name
            
            FROM students s 
            JOIN classes c ON  s.class_id=c.id
            JOIN standards st  ON st.id= c.standard_id 
            WHERE s.class_id=$1`, [cls_id], (err, result) => {
            if (err) {
                return res.status(500).send("Database Error1");
            }
            if (result.rows.length === 0) {
                return res.status(404).send("Students Not Found");
            }
            return res.status(200).send(result.rows)
        })
    })
}


//store marks

const storeMarks = (req, res) => {
    const testId = req.params.id;

    pool.query(`SELECT * FROM marks WHERE test_id=$1`, [testId], (err, result) => {
        if (err) {
            return res.status(500).send("Database Error")
        }
        if (result.rows.length > 0) {
            return res.status(409).send("Marks already entered for this test")
        }
        pool.query(`SELECT * FROM tests WHERE id=$1`, [testId], (err, result) => {

            if (err) {
                return res.status(500).send("Database Error");
            }
            if (result.rows.length === 0) {
                return res.status(404).send("Test Not Found")
            }

            let completed = 0
            const { marks } = req.body;

            for (let i = 0; i < marks.length; i++) {

                let stdId = marks[i].student_id;
                let mark = marks[i].mark


                pool.query(`INSERT INTO marks(test_id,student_id,std_marks) VALUES ($1,$2,$3)`,
                    [testId, stdId, mark], (err, result) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).send("Database Error")
                        }
                        completed++;

                        if (completed === marks.length) {
                            return res.status(201).send("marks Added Successfully.")
                        }


                    }
                )
            }

        })
    })

}


const viewMarks = (req, res) => {
    const testId = req.params.id;

    pool.query(`SELECT * FROM tests WHERE id=$1`, [testId],
        (err, result) => {
            if (err) {
                return res.status(500).send("Database Error");
            }
            if (result.rows.length === 0) {
                return res.status(404).send("Test Not Found.")
            }
            pool.query(`SELECT 
    s.id,
    s.regno,
    s.first_name,
    s.last_name,
    st.name || '-' || c.name AS class_name,
    s.id AS student_id,
    m.std_marks 
FROM marks m
JOIN students s ON m.student_id = s.id
JOIN classes c ON s.class_id = c.id
JOIN standards st ON c.standard_id = st.id
WHERE m.test_id = $1
ORDER BY s.regno ASC`, [testId], (err, result) => {
                if (err) {
                    return res.status(500).send("Database Error");
                }
                if (result.rows.length === 0) {
                    return res.status(404).send("No Marks Found.");
                }
                return res.status(200).send(result.rows)
            })
        }
    )
}


const updateMarks = (req, res) => {
    const testId = req.params.id;

    const {updateMark} = req.body;

    pool.query(`SELECT * FROM tests WHERE id=$1`, [testId],
        (err, result) => {
            if (err) {
                return res.status(500).send("Database Error")
            }
            if (result.rows.length === 0) {
                return res.status(404).send("Test Not Found.");
            }

            let completed = 0;

            for (let i = 0; i < updateMark.length; i++) {
                let std_id = updateMark[i].student_id;
                let std_mark = updateMark[i].std_marks;

                pool.query(`UPDATE marks SET std_marks=$1 WHERE student_id=$2 AND test_id=$3 `,
                    [std_mark, std_id, testId], (err, result) => {
                        if (err) {
                            console.log(err)
                            return res.status(500).send("Database Error")
                        }

                        completed++;

                        if (completed === updateMark.length) {
                            return res.status(200).send("Marks Updated Successfully")
                        }

                    }
                )
            }
        }
    )
}
module.exports = {
    createTest,
    getTests,
    getoneTest,
    updateTest,
    deleteTest,
    getStudentByTest,
    storeMarks,
    viewMarks,
    updateMarks
}