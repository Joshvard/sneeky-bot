class Attendance{

    constructor(database, message){
        this.database = database;
        this.message = message;
    }

    async signup(user){
        try{
            this.connection = await this.database.db_connect();
        } catch(error){
            console.log(error);
            return false;
        }

        try{
            let result = await this.database.db_query(this.connection, `SELECT attendance_is_signed_up FROM attendance WHERE users_discord_id = ${user.discord_id}`);
            console.log(result);

            if(result.length <= 0){
                return false;
            }
        } catch(error){
            console.log(error);

            return false;
        }

        if(result[0]['attendance_is_signed_up'] === 1){
            this.message.channel.send(`<@${user.discord_id}> You're already signed up!`);
            return false; 
        }

        try{
            let update_query = `
                UPDATE attendance 
                SET attendance_last_signup = NOW(),
                    attendance_is_signed_up = 1
                WHERE users_discord_id = ${user.discord_id}`;

            let update_result = this.database.db_query(this.connection, update_query);
            
            if(update_result.affectedRows > 0){
                console.log(`Couldn't update user id ${user.discord_id}, in attendance module.`);
                return false;
            } else {
                this.message.channel.send(`<@${user.discord_id}> You have been signed up!`);
            }
        } catch(error){
            console.log(error);
            return false;
        }
    }

    async signout(){
        
    }

    async vacation(){

    }

    async set_late(){

    }

    async set_vacation(){

    }

    async set_proof(){

    }

    async data(){

    }
}

module.exports = Attendance;