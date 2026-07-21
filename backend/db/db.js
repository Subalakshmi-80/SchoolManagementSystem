const {Pool} = require('pg');

let pool;

if(process.env.DATABASE_URL){
    pool = new Pool({
        connectionString:process.env.DATABASE_URL,
        ssl:{
            rejectUnauthorized:false,
        },
    })
}
else{
 pool = new Pool({
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,
    user:process.env.DB_USER,
    database:process.env.DB_NAME,
    password:process.env.DB_PASSWORD,

});
}





module.exports = pool;
