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

    // TODO: Create table for casino data and extract the data from the balance data on id
    get_balance(id){
        let query = `SELECT casino_balance WHERE users_discord_id = ${id}`;

        return query;
    }

    play(player){
        let balance = this.get_balance(player.discord_id);
    }

    balance(){
        
    }

    donate(){
        
    }

    scavenge(){
        
    }
}

module.exports = Casino;