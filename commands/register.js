
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
        } catch(error){
            console.log(error);
            return false;
        }

        try{
            let result = await this.database.db_query(this.connection, `SELECT id FROM users WHERE users_discord_id = ${this.user.discord_id}`);

            if(result.length > 0){
                if(!this.suppress){
                    this.message.channel.send(`<@${this.user.discord_id}> You already exist in the system.`);
                }

                return false;
            }
        } catch(error){
            console.log(error);
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

            if(!this.suppress){
                this.message.channel.send(`<@${this.user.discord_id}> You have successfully been registered!`);
            }
        } catch(error){
            console.log(error);
            return false;
        }

        try{
            await this.database.db_query(this.connection, `INSERT INTO casino(
                users_discord_id,
                casino_credits
            )VALUES(
                ${this.message.author.id},
                500
            )`);

            if(!this.suppress){
               this.message.channel.send(`<@${this.user.discord_id}> You have successfully been registered!`);
            }
        } catch(error){
            console.log(error);
            return false;
        }
    }

    async run(){
        this.register_user();
    }
}

module.exports = Cmd;