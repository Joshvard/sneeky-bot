/*
    Package designed to handle registration
    Here we will provide a means to give a new user access to functionality with the bot, and log them into the database for further interaction!

    All bot operations should use this module to register an unknown user, and should handle such an interaction here.

    During the runtime of this object, the register parameters should be handled and failed in a delicate manner -
    - if applicable
*/

class Cmd{

    constructor(database, message, suppress = false){
        this.database = database;
        this.message = message;
        this.connection;

        this.user = {
            name: "",
            discord_id: ""
        };

        // Suppresses channel messages to the user for this package (allowed by default, doesn't apply to critical errors)
        this.suppress = suppress;
    }

    set_user_data(user){
        this.user.name = user.name;
        this.user.discord_id = user.discord_id;
    }

    async register_user(){

        try{
            this.connection = await this.database.db_connect();
            let result = await this.database.db_query(this.connection, `SELECT users_id FROM users WHERE users_discord_id = ${this.user.discord_id}`);
        } catch(error){
            console.log(error);
            return false;
        }

        if(result.length > 0){
            if(!this.suppress){
                this.message.channel.send(`<@${this.user.discord_id}> You already exist in the system.`);
            }

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
        } catch(error){
            console.log(error);
            return false;
        }

        if(!this.suppress){
            this.message.channel.send(`<@${this.user.discord_id}> You have successfully been registered!`);
        }

        try{
            await this.database.db_query(this.connection, `INSERT INTO casino(
                users_discord_id,
                casino_credits
            )VALUES(
                ${this.message.author.id},
                500
            )`);
        } catch(error){
            console.log(error);
            return false;
        }

        if(!this.suppress){
           this.message.channel.send(`<@${this.user.discord_id}> You have successfully been registered!`);
        }
    }

    async run(){
        this.register_user();
    }
}

module.exports = Cmd;