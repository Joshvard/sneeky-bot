// QA testers: Sylpheii

class Cmd{

    constructor(database, message){
        this.database = database;
        this.message = message;
        this.connection;

        this.user = {
            name: "",
            discord_id: ""
        };
    }

    set_user_data(user){
        this.user.name = user.name;
        this.user.discord_id = user.discord_id;
    }

    async register_user(){

        try{
            this.connection = await this.database.db_connect();
        } catch(error){
            this.message.channel.send(`There was a problem with the database connection, please contact the bot administrator.`);
            return false;
        }

        try{
            let result = await this.database.db_query(this.connection, `SELECT users_id FROM users WHERE users_discord_id = ${this.user.discord_id}`);

            if(result.length > 0){
                this.message.channel.send('You already exist in the system.');
                return false;
            }
        } catch(error){
            this.message.channel.send('There was a problem with the database operation, please contact the bot administrator.');
            return false;
        }

        try{
            await this.database.db_query(this.connection, `INSERT INTO users(
                users_name,
                users_discord_id
            )VALUES(
                "${this.message.author.username}",
                ${this.message.author.id}
            )`);

            this.message.channel.send('You have successfully been registered!');
        } catch(error){
            this.message.channel.send(`Insertion query executed with a failure: ${error.message}`);
            return false;
        }
    }

    async run(){
        this.register_user();
    }
}

module.exports = Cmd;