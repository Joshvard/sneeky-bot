class Gear{

    constructor(database, message){
        this.database = database;
        this.message = message;
    }

    async upload(user, data){
        let query = `INSERT INTO gear(
                users_discord_id,
                gear_screenshot,
                gear_score,
                gear_creation_date,
                gear_codename
            )VALUES(
                ${user.discord_id},
                ${data.screenshot},
                ${data.score},
                NOW(),
                ${data.codename}
            )`;

        try{
            let connection = await this.database.db_connect();

            let result = await this.database.db_query(connection, query);
            this.database.db_close(connection);

            if(result){
                this.message.channel.send(`<@${user.discord_id} Your screenshot has been uploaded!`);
            }
        } catch(error){
            console.log(error);
            this.message.channel.send('There was a problem with the database operation, please contact the bot administrator.');
        }
    }

    download(user){

    }

    update(user, data){
        let query = `UPDATE gear 
            SET gear_screenshot = ${data.screenshot}, 
                gear_score = ${data.score}, 
                gear_creation_date = NOW(), 
                gear_codename = ${data.codename}
            WHERE users_discord_id = ${user.discord_id}`;
    }
}