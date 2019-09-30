class Gear{

    constructor(database, message){
        this.database = database;
        this.message = message;
    }

    async check_codename_exists(codename){
        let query = `SELECT id FROM gear WHERE gear_codename = ${codename}`;

        try{
            let connection = await this.database.db_connect();
            let result = await this.database.db_query(connection, query);
            this.database.db_close(connection);

            if(result){
                return true;
            } else {
                return false;
            }
        } catch(error){
            console.log(error);
            this.message.channel.send('There was a problem with the database operation, please contact the bot administrator.');
        }

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

        if(this.check_codename_exists(data.codename)){
            this.message.channel.send(`<@${user.discord_id} You already have a gear screenshot under the codename '${data.codename}'.\nPlease use a different codename, or use &gear update <${data.codename}> <${data.screenshot}> *optional*<${data.score}> to replace it.`);
        }

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

    async download(user, data){
        let query = `SELECT gear_screenshot, gear_score, gear_codename FROM gear WHERE users_discord_id = ${user.discord_id} AND gear_codename = ${data.codename}`;

        try{
            let connection = await this.database.db_connect();
            let result = await this.database.db_query(connection, query);
            this.database.db_close(connection);

            if(result){
                this.message.channel.send(`<@${user.discord_id} ${data.screenshot}\nFound under the name of '${data.codename}'.`);
            } else {
                this.message.channel.send(`<@${user.discord_id} No results found for the codename '${data.codename}'.`);
            }
        } catch(error){
            console.log(error);
            this.message.channel.send('There was a problem with the database operation, please contact the bot administrator.');
        }
    }

    async update(user, data){
        let query = `UPDATE gear 
            SET gear_screenshot = ${data.screenshot}, 
                gear_score = ${data.score}, 
                gear_creation_date = NOW()
            WHERE gear_codename = ${data.codename} AND users_discord_id = ${user.discord_id}`;

        try{
            let connection = await this.database.db_connect();
            let result = await this.database.db_query(connection, query);
            this.database.db_close(connection);

            if(result){
                this.message.channel.send(`<@${user.discord_id} Your screenshot has been updated under the codename '${data.codename}'!`);
            } else {
                this.message.channel.send(`<@${user.discord_id} No results found for the codename'${data.codename}'.\nWill attempt to upload your screenshot link to the provided codename.`);

                this.upload(user, data);
            }
        } catch(error){
            console.log(error);
            this.message.channel.send('There was a problem with the database operation, please contact the bot administrator.');
        }
    }
}