const pool = require("../db/db");
const bcrypt = require("bcrypt");

const createStudent = (req, res) => {
    const { name, email, password, regno, first_name,
         last_name, gender, dob, phone, class: studentClass, section, 
         address_line1,address_line2,city,state } = req.body;
    if (!name || !email || !password || !regno) {
        return res.status(400).send("Please provide mandatory fields");
    }
    pool.query(`SELECT * FROM users WHERE email=$1`, [email], (err, result) => {
        if (err) {
            return res.status(500).send("Database Error")
        }
        if (result.rows.length > 0) {
            return res.status(409).send("Email already exists");
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                console.error("Error hashing password", err);
            } else {
                pool.query(`INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING id`,
                    [name, email, hash, "student"],
                    (err, result) => {
                        if (err) {
                            return res.status(500).send("error");
                        } else {

                            pool.query(`INSERT INTO students(user_id,regno,first_name,last_name,gender,dob,phone,class,section,address_line1,address_line2,city,state)
                                    VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
                                [result.rows[0].id, regno, first_name, last_name, gender, dob, phone, studentClass, section, address_line1,address_line2,city,state],
                                (err, result1) => {
                                    if (err) {
                                        return res.status(500).send("error");
                                    } else {
                                        res.status(201).send("Student data inserted successfully")

                                    }

                                })
                        }
                    })

            }

        })
    });


}


const getStudents = (req, res) => {
    pool.query(`SELECT  s.id,
    s.regno,
    s.first_name,
    s.last_name,
    s.gender,
    s.dob,
    s.phone,
    s.class,
    s.section,
    s.address_line1,
    s.address_line2,
    s.city,
    s.state,
    u.name,
    u.email,
    u.role FROM students s JOIN users u ON s.user_id = u.id`, (err, result) => {
        if (err) {
            return res.status(500).send("Database Error");
        }
        else {
            return res.status(200).json(result.rows);
        }
    })
}

const getOneStd = (req, res) => {
    const stdId = req.params.id;

    pool.query(`SELECT  s.id,
    s.regno,
    s.first_name,
    s.last_name,
    s.gender,
    s.dob,
    s.phone,
    s.class,
    s.section,
    s.address_line1,
    s.address_line2,
    s.city,
    s.state,
    u.name,
    u.email,
    u.role FROM students s JOIN users u ON S.user_id = u.id WHERE s.id=$1`, [stdId],
        (err, result) => {
            if (err) {
                return res.status(500).send("Database Error");
            } else {
                return res.status(200).json(result.rows);
            }
        })
}

const updateStd = (req, res) => {
    const studentId = req.params.id;

    const { regno,first_name, last_name, gender, dob, phone, class: studentClass, section, address_line1,address_line2,city,state } = req.body;

    pool.query(
        "SELECT * FROM students WHERE id = $1", [studentId],
        (err, result) => {
            if (err) {
                return res.status(500).send("Database Error");
            }

            if (result.rows.length === 0) {
                return res.status(404).send("Student not found");
            }

            const student = result.rows[0];

            const updatedRegno = regno || student.regno;
            const updatedFirstName = first_name || student.first_name;
            const updatedLastName = last_name || student.last_name;
            const updatedGender = gender || student.gender;
            const updatedDob = dob || student.dob;
            const updatedPhone = phone || student.phone;
            const updatedClass = studentClass || student.class;
            const updatedSection = section || student.section;
            const updatedAddressLine1 = address_line1 || student.address_line1;
            const updatedAddressLine2 = address_line2 || student.address_line2;
            const updatedCity= city || student.city;
            const updatedState = state || student.state;

            const fullName = updatedFirstName +" "+ updatedLastName;
            pool.query(
                `UPDATE students 
                 SET regno=$1,first_name=$2,last_name=$3,gender=$4,dob=$5,phone=$6,class=$7,section=$8,address_line1=$9 ,address_line2=$10,city=$11,state=$12 WHERE id=$13`,
                [
                   updatedRegno, updatedFirstName, updatedLastName, updatedGender, updatedDob, updatedPhone, updatedClass, updatedSection, updatedAddressLine1,updatedAddressLine2,updatedCity,updatedState,studentId
                ],
                (err) => {
                    if (err) {
                        return res.status(500).send("Update failed");
                    }
                    else {
                        pool.query(`UPDATE users SET name=$1 WHERE id=$2 `, [fullName, student.user_id], (err) => {
                            if (err) {
                                return res.status(500).send("Update failed");
                            }
                            else {

                                return res.status(200).send("Student updated successfully");
                            }
                        });
                    }
                }
            );
        }
);

};

const deleteStd = (req,res)=>{
    const StdId = req.params.id;

    pool.query(`SELECT * FROM students WHERE id=$1`,[StdId],(err,result)=>{
        if(err){
            return res.status(500).send("Database Error");
        }
         if (result.rows.length === 0) {
                return res.status(404).send("Student not found");
            }
       const student = result.rows[0];

       pool.query(`DELETE FROM students WHERE id=$1`,[StdId],(err,result)=>{
        if(err){
             return res.status(500).send("Database Error");
        }
        else{
            pool.query(`DELETE FROM users WHERE id=$1`,[student.user_id],(err,result)=>{
                if(err){
                     return res.status(500).send("Database Error");
                }
                else{
                    return res.status(200).send("Student deleted successfully")
                }

            })
        }
       })
    })
}

module.exports = { createStudent, getStudents, getOneStd, updateStd,deleteStd };