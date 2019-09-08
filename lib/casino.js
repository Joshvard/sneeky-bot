class Casino{

    constructor(database){
        this.database = database;

        try{
            this.connection = await this.database.db_connect();
        } catch(error){
            this.message.channel.send(`There was a problem with the database connection, please contact the bot administrator.`);
            return false;
        }
    }

    check_player_exists(id){
        try{
            let result = await this.database.db_query(this.connection, `SELECT users_id FROM users WHERE users_discord_id = ${id}`);

            if(result.length > 0){
                return true;
            } else {
                return false;
            }
        } catch(error){
            this.message.channel.send('There was a problem with the database operation, please contact the bot administrator.');
            return false;
        }
    }

    check_parameters(param_count, params){
        if(params.length > param_count){
            return false;
        }
        // TODO: decide on how parameter strings should be checked
        // - via json file (creates overhead for multi-commands)
        // - hardcoded as parameters (simpler, but looks messy)
    }

    play(){

    }

    donate(){
        
    }

    scavenge(){
        
    }
}

module.exports = Casino;