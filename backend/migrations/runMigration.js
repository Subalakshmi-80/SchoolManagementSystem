
    const fs = require('fs');
    const path = require('path');
    const pool = require('../db/db');

    async function runMigration() {
        await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations(
            id SERIAL PRIMARY KEY,
            file_name VARCHAR(100) UNIQUE NOT NULL);
            `);

        const sqlFolder = path.join(__dirname,"../sql"); //get the sql folder path

        const files = fs.readdirSync(sqlFolder); //read all sql files from the folder

        files.sort(); 

        const result = await pool.query(`SELECT file_name FROM schema_migrations`);

        const executedFiles = result.rows.map(row => row.file_name);

        for(const file of files){
            if(executedFiles.includes(file)){
                continue;
            }
            const sql = fs.readFileSync(path.join(sqlFolder,file),"utf8");

            try{
            await pool.query(sql);

            await pool.query(`INSERT INTO schema_migrations (file_name) VALUES($1)`,[file])
            }
            catch(err){
                console.log(`migration failed: ${file}`)
                console.log(err);
                throw err;
            }
     
        }

    }

    module.exports = runMigration