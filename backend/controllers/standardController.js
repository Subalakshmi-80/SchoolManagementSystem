const pool = require("../db/db");

const createStandard = (req,res)=>{
const {name} = req.body;

if(!name){
    return res.status(400).send("Standard name is required")
}

pool.query(`SELECT * FROM standards WHERE name=$1`,[name],
    (err,result)=>{
        if(err){
            return res.status(500).send("Database Error");
        }
        if(result.rows.length > 0){
            return res.status(409).send("Standard Already Exists")
        }
pool.query(`INSERT INTO standards(name) VALUES($1)`,[name],
    (err,result)=>{
        if(err){
            return res.status(500).send("Database Error")
        }
        return res.status(201).send("Standard created successfully.")
    }
)
    }
)



}


const getStandards = (req,res )=>{
    pool.query(`SELECT * FROM  standards`,(err,result)=>{
        if(err){
            return res.status(500).send("Database Error");
        }
        return res.status(200).send(result.rows);
    }
    )
}

const getOneStandard = (req,res) =>{
    const id = req.params.id;

    pool.query(`SELECT * FROM standards WHERE id=$1`,[id],(err,result)=>{
        if(err){
            return res.status(500).send("Databse Error")
        }
        if(result.rows.length === 0){
            return res.status(404).send("Standard not found")
        }
        
        return res.status(200).send(result.rows);
       
    })
}

const updateStandard = (req,res)=>{
    const {name} = req.body;
    const id = req.params.id;

    pool.query(`SELECT * FROM standards WHERE id=$1`,[id],
        (err,result) =>{
            if(err){
                return res.status(500).send("Database Error");
            }
            if(result.rows.length === 0){
                return res.status(404).send("Standard not found")
            }
         
            const standard = result.rows[0];
            const updatedName = name || standard.name;
            
            pool.query(`UPDATE standards SET name=$1 WHERE id=$2`,[updatedName,id],
                (err,result)=>{
                    if(err){
                         return res.status(500).send("Database Error");
                    }
                    return res.status(200).send("Standard Updated Successfully")
                }
            )
        }
    )

}

const deleteStandard = (req,res) =>{
    const id = req.params.id;

    pool.query(`SELECT * FROM standards WHERE id =$1`,[id],
        (err,result)=>{
            if(err){
                return res.status(500).send("Database Error")
            }
            if(result.rows.length === 0){
                return res.status(404).send("Standard not found");
            }
            const standard = result.rows[0];

            pool.query(`DELETE FROM standards WHERE id=$1`,[id],(err)=>{
                if(err){
                    return res.status(500).send("Database Error");
                }
                return res.status(200).send(standard)
            })
        }
    )
}
module.exports={createStandard,getStandards,getOneStandard,updateStandard,deleteStandard};