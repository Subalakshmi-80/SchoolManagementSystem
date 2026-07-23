const pool = require('../db/db');

const getPeriods = (req,res) =>{
    pool.query(`SELECT * FROM periods ORDER BY period_no ASC`,(err,result)=>{
        if(err){
            return res.status(500).send("Database Error");
        }
        if(result.rows.length ===0){
            return res.status(404).send("Periods Not Found.");
        }
        return res.status(200).send(result.rows)
    })
}


const createTimetable = (req,res) =>{
    const {class_id,day,period_id,subject_id} = req.body;

    pool.query(`SELECT * FROM timetable WHERE class_id=$1 AND day=$2 AND period_id=$3`,
        [class_id,day,period_id],(err,result)=>{
            if(err){
                return res.status(500).send("Database Error");
            }
            if(result.rows.length > 0){
                return res.status(409).send("Period allocated already for this class.")
            }
            pool.query(`INSERT INTO timetable(class_id,day,period_id,subject_id) VALUES($1,$2,$3,$4)`,
                [class_id,day,period_id,subject_id],
                (err,result) =>{
                    if(err){
                        return res.status(500).send("Database Error")
                    }
                    return res.status(201).send("Successfully created.")
                }
            )
        }
    )
}


const getTimetableByClass = (req,res) =>{
    const clsId = req.params.id;
    const {day} = req.query;

    pool.query(`SELECT t.id,
        t.day,
        t.class_id,
        t.period_id,
        t.subject_id,
        st.name || '-' || c.name AS class_name,
        s.subject_name,
        p.period_no,
        p.start_time,
        p.end_time
        FROM timetable t JOIN classes c ON c.id=t.class_id
        JOIN standards st ON c.standard_id= st.id
        JOIN subjects s ON t.subject_id = s.id
        JOIN periods p ON t.period_id = p.id
        WHERE class_id=$1 AND t.day = $2
        ORDER BY t.day, t.period_id ASC`,[clsId,day],
        (err,result)=>{
            if(err){
                return res.status(500).send(err);
            }
            return res.status(200).send(result.rows)
        }
    )
}

const updateTimetable = (req,res) =>{
    const {class_id,period_id,day,subject_id} = req.body;


            pool.query(`UPDATE timetable SET subject_id=$1 WHERE class_id=$2 AND period_id=$3 AND day=$4`,
                [subject_id,class_id,period_id,day],(err,result)=>{
                if(err){
                    
                    return res.status(500).send("Database Error")
                }
                if(result.rowsCount === 0){
                     return res.status(404).send("Timetable Not Found");
                }
                return res.status(200).send("Updated Successfully")
            })
        }
    

module.exports = {getPeriods,createTimetable,getTimetableByClass,updateTimetable}