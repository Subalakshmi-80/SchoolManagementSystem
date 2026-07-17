const pool = require("../db/db")

const createSubject =(req,res) =>{
    const {subject_name} = req.body;
    pool.query(`SELECT * FROM subjects WHERE subject_name=$1`,[subject_name],
        (err,result) =>{
            if(err){
                return res.status(500).send("Database Error")
            }
            if(result.rows.length > 0){
                return res.status(409).send("Subject already Exists")
            }
            pool.query(`INSERT INTO subjects(subject_name) VALUES($1)`,[subject_name],(err,result)=>{
                if(err){
                    return res.status(500).send("Database Error")
                }
                return res.status(201).send("Subject created successfully.")
            })
        }
    )
}

const getSubjects = (req,res) =>{
    pool.query(`SELECT * FROM subjects ORDER BY id ASC`,(err,result)=>{
        if(err){
            return res.status(500).send("Database Error")
        }
        // if(result.rows.length === 0){
        //     return res.status(404).send("Subject not found.");
        // }
     
        return res.status(200).send(result.rows)
    })
}
const getOneSubject = (req,res) =>{
    const id = req.params.id;

    pool.query(`SELECT * FROM subjects WHERE id=$1`,[id],(err,result)=>{
        if(err){
            return res.status(500).send("Database Error");
        }
        if(result.rows.length === 0){
            return res.status(404).send("Subject not found.");
        }
        return res.status(200).send(result.rows[0])
    })
}



const updateSubject = (req,res) =>{
    const {subject_name} = req.body;

    const id = req.params.id;

    pool.query(`SELECT * FROM subjects WHERE id=$1`,[id],
        (err,result)=>{
           if(err){
             return res.status(500).send("Database Error")
           }
           if(result.rows.length === 0){
            return res.status(404).send("Subject not found.")
           }
           const subject = result.rows[0];

           const updatedSubjectName = subject_name || subject.subject_name;

           pool.query(`SELECT * FROM subjects WHERE subject_name=$1 AND id!=$2`,[updatedSubjectName,id],
            (err,result)=>{
                if(err){
                    return res.status(500).send("Database Error");
                }
                if(result.rows.length >0){
                    return res.status(409).send("Subject already Exists.")
                }

                pool.query(`UPDATE subjects SET subject_name=$1 WHERE id=$2`,[updatedSubjectName,id],
                    (err,result)=>{
                        if(err){
                            return res.status(500).send("Database Error")
                        }
                        return res.status(200).send("Subject Updated Successfully.")
                    }
                )
            }
           )
        }
    )


}


const deleteSubject = (req,res) =>{
    const id = req.params.id;
pool.query(`SELECT * FROM subjects WHERE id=$1`,[id],(err,result)=>{
    if(err){
        return res.status(500).send("Database Error");
    }
    if(result.rows.length === 0){
        return res.status(404).send("Subject Not Found.")
    }
     const subject = result.rows[0]
     pool.query(`DELETE FROM subjects WHERE id=$1`,[id],(err)=>{
        if(err){
            return res.status(500).send("Database Error")
        }
       
        return res.status(200).send({subject,msg:"Subject deleted Successfully."})
    })
})
   
}
module.exports = {createSubject,getSubjects,getOneSubject,updateSubject,deleteSubject}