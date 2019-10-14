class Database{
    constructor(config){
        this.dbName = config.db_name;
        this.dbHost = config.db_host;
        this.dbUser = config.db_user;
        this.dbPass = config.db_pass;
        this.mysql = require('mysql');
    }

    db_connect(){
        return new Promise((resolve, reject) => {
            let connection = this.mysql.createConnection({
                connectionLimit : 50,
                host: this.dbHost,
                user: this.dbUser,
                password: this.dbPass,
                database: this.dbName
            });
            
            connection.connect((error) => {
                if(error){
                    reject(error);
                } else {
                    resolve(connection);
                }
            });
        });
    }

    async db_query(connection, query){
        return new Promise((resolve, reject) => {       
            connection.query(query, (error, result, fields) => {
                if(error){
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    db_close(connection){
        connection.end();
    }

    // For bot initialisation
    async test_connection(){
        try{
            this.connection = await this.db_connect();
            console.log("Bot has database access!");
            this.db_close(this.connection);
        } catch(error) {
            throw(error);
        }
    }
}

module.exports = Database;