const pool = require("../db/db")

const createClass = (req,res) =>{
const {name,standard_id} = req.body;

pool.query(`SELECT * FROM classes WHERE name=$1 AND standard_id=$2`,[name,standard_id],
    (err,result)=>{
        if(err){
            return res.status(500).send("Database Error")
        }
        if(result.rows.length >0){
            return res.status(409).send("Class Already Exists")
        }
        pool.query(`INSERT INTO classes(name,standard_id) VALUES($1,$2)`,[name,standard_id],
            (err,result)=>{
                if(err){
                    return res.status(500).send("Database Error");
                }
                return res.status(201).send("Class created successfully")
            }
        )
    }
)
}

const getClass = (req,res) =>{
    pool.query(`SELECT 
        c.id,
        c.name AS class_name,
        c.standard_id,
        s.name AS standard_name
         FROM classes c JOIN standards s ON s.id = c.standard_id ORDER BY c.id`,(err,result)=>{
            if(err){
                return res.status(500).send("Databse Error");
                 
            }
            if(result.rows.length === 0){
                return res.status(404).send("No Classes Found")
            }
            return res.status(200).send(result.rows)
         })

}

const getSingleClass = (req,res) =>{
    const clsId = req.params.id;
    pool.query(`SELECT 
        c.id,
        c.name AS class_name,
        c.standard_id,
        s.name AS standard_name 
        FROM classes c JOIN standards s ON c.standard_id = s.id
        WHERE c.id=$1`,[clsId],(err,result)=>{
            if(err){
                return res.status(500).send("Database Error");
                
            }
            if(result.rows.length === 0){
                return res.status(404).send("Class not found.");
            }
            return res.status(200).send(result.rows[0])
        })
}


const updateClass = (req,res) =>{
    const {class_name,standard_id} = req.body;
    const clsId = req.params.id;
    
   
        pool.query(`SELECT * FROM classes WHERE id=$1`,[clsId],(err,result)=>{
            if(err){
                return res.status(500).send("Database Error");
            }
            if(result.rows.length === 0){
                return res.status(404).send("Class not found");
            }

            const classes = result.rows[0];
            
            const updatedName = class_name || classes.name;
            const updatedStandardId = standard_id || classes.standard_id
             pool.query(`SELECT * FROM classes WHERE name = $1 AND standard_id=$2 AND id != $3 `,[updatedName,updatedStandardId,clsId],(err,result)=>{
        if(err){
            return res.status(500).send("Database Error")
        }
         if(result.rows.length >0){
            return res.status(409).send("Class Already Exists");
        }
      
   pool.query(`UPDATE classes SET name=$1,standard_id=$2 WHERE id=$3`,[updatedName,updatedStandardId,clsId],
                (err,result) =>{
                    if(err){
                        return res.status(500).send("Database Error");
                    }
                    return res.status(200).send(`Class updated Successfully`)
                }
            )  
         
        })
    })

}

const deleteClass = (req,res) =>{
    const clsId = req.params.id;

    pool.query(`SELECT * FROM classes WHERE id=$1`,[clsId],(err,result) => {
        if(err){
            return res.status(500).send("Database Error");
        }
        if(result.rows.length === 0){
            return res.status(404).send("Class not found.");
        }
        const classes = result.rows[0]
        pool.query(`DELETE FROM classes WHERE id=$1`,[clsId],(err,result)=>{
            if(err){
                return res.status(500).send("Database Error");
            }
            return res.status(200).send(classes);

        })
    })
}



module.exports ={createClass,getClass,getSingleClass,updateClass,deleteClass}