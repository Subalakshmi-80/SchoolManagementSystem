const pool = require("../db/db");
const bcrypt = require("bcrypt");


const createTeacher = (req,res)=>{
    const {name,email,password,empid,first_name,last_name,gender,dob,phone, classIncharge,classsection,subject,qualification,address}=req.body;

    if(!email || !password || !name || !empid){
        return res.status(400).send("please provide mandatory fields");
    }
    pool.query(`SELECT * FROM users WHERE email = $1`,[email],(err,result)=>{
        if(err){
            return res.status(500).send("Database Error");
        }
        if(result.rows.length>0){
            return res.status(409).send("Email Alraedy Exists");
        }
        bcrypt.hash(password,10,(err,hash)=>{
            if(err){
                return res.status(400).send("Error Try Again Later")
            }
            pool.query(`INSERT INTO users(name,email,password,role) VALUES ($1,$2,$3,$4) RETURNING id`,[name,email,hash,"teacher"],
                (err,result)=>{
                    if(err){
                        return res.status(500).send(err.message);
                    }
                    pool.query(`INSERT INTO teachers(user_id,empid,first_name,last_name,gender,dob,phone,classIncharge,classsection,subject,qualification,address_line1,address_line2,state,city)
                        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
                        [result.rows[0].id,empid,first_name,last_name,gender,dob,phone,classIncharge,classsection,subject,qualification,address],
                        (err,result)=>{
                            if(err){
                                return res.status(500).send(err.message);
                            }
                            return res.status(201).send("Teacher data Inserted Successfully");
                        }

                    )
            })
        })
    })
}

const getTeacher = (req,res)=>{
    pool.query(`SELECT t.id,u.name,u.email,u.role,
        t.empid,
        t.first_name,
        t.last_name,
        t.gender,
        t.dob,
        t.phone,
        t.classIncharge,
        t.classsection,
        t.subject,
        t.qualification,
        t.address FROM teachers t JOIN users u ON t.user_id = u.id`,
        (err,result) => {
            if(err){
                return res.status(500).send(err.message);
            }
            if(result.rows.length === 0){
                return res.status(404).send("Teacher Not Found");
            }
            else{
                return res.status(200).send(result.rows)
            }
        }

    );       

}

const getSingleTeacher = (req,res) =>{
    const teacherId = req.params.id;

    pool.query(`SELECT t.id,
        u.name,
        u.email,
        u.role,
        t.first_name,
        t.last_name,
        t.gender,
        t.dob,
        t.phone,
        t.classIncharge,
        t.classsection,
        t.subject,
        t.qualification,
        t.address FROM teachers t JOIN users u ON t.user_id = u.id WHERE t.id=$1`,[teacherId],
        (err,result)=>{
            if(err){
                return res.status(500).send(err.message);
            }
            if(result.rows.length===0){
                return res.status(404).send("Teacher Not Found")
            }
            else{
                return res.status(200).send(result.rows[0])
            }
        })
}

const updateTeacher = (req,res) =>{
    const teacherId = req.params.id;

    const {empid,first_name,last_name,gender,dob,phone,classIncharge,classsection,subject,qualification,address} = req.body;

    pool.query(`SELECT * FROM teachers WHERE id=$1`,[teacherId],(err,result)=>{
        if(err){
            return  res.status(500).send(err.message);
        }
        if(result.rows.length === 0){
            return res.status(404).send("Teacher not found")
        }
        const teacher = result.rows[0]

        const updatedEmpid= empid || teacher.empid;
        const updatedFirstName =  first_name || teacher.first_name;
        const updatedLastName = last_name || teacher.last_name;
        const updatedGender = gender || teacher.gender;
        const updatedDob = dob || teacher.dob;
        const updatedPhone = phone || teacher.phone;
        const updatedClassIncharge = classIncharge || teacher.classIncharge;
        const updatedClasssection = classsection || teacher.classsection;
        const updatedSubject = subject || teacher.subject;
        const updatedQualification = qualification || teacher.qualification;
        const updatedAddress = address || teacher.address;

        const fullName = updatedFirstName + " "+updatedLastName
        
        pool.query(`UPDATE teachers 
            SET empid=$1,first_name=$2,last_name=$3,gender=$4,dob=$5,phone=$6,classIncharge=$7,classsection=$8,subject=$9,qualification=$10,address=$11 WHERE id=$12`,
        [updatedEmpid,updatedFirstName,updatedLastName,updatedGender,updatedDob,updatedPhone,updatedClassIncharge,updatedClasssection,updatedSubject,updatedQualification,updatedAddress,teacherId]
    ,(err,result)=>{
        if(err){
            return res.status(500).send(err.message);
        }
        else{
            pool.query(`UPDATE users SET name=$1 WHERE id=$2`,[fullName,teacher.user_id],(err,result)=>{
                if(err){
                    return res.status(500).send(err.message);
                }
                else{
                    return res.status(200).send("Teacher Updated Successfully");
                }
            })
        }
    }
    )
    })

}

const deleteTeacher = (req,res) => {
    const teacherId = req.params.id;

    pool.query(`SELECT * FROM teachers WHERE id=$1`,[teacherId],
        (err,result)=>{
            
          
          
            if(err){
                return res.status(500).send(err.message);
            }
            if(result.rows.length === 0){
                return res.status(400).send("Teacher Not Found");
            }
  const teacher = result.rows[0]

            pool.query('DELETE FROM teachers WHERE id=$1',[teacherId],(err,result) =>{
                if(err){
                    return res.status(500).send(err.message);
                }
                else{
                    pool.query(`DELETE FROM users WHERE id=$1`,[teacher.user_id],
                        (err,result)=>{
                            if(err){
                                return res.status(500).send(err.message);
                            }
                            else{
                                return res.status(200).send("Teacher data deleted successfully");
                            }
                        }
                    )
                }
            })

        }
    )
}
 

module.exports ={createTeacher,getTeacher,getSingleTeacher,updateTeacher,deleteTeacher};