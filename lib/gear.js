class Gear{

    constructor(database, message){
        this.database = database;
        this.message = message;
    }

    async check_player_exists(id){

        try{
            this.connection = await this.database.db_connect();
        } catch(error){
            console.log(error);

            return false;
        }

        try{
            let result = await this.database.db_query(this.connection, `SELECT id FROM users WHERE users_discord_id = ${id}`);

            if(result.length > 0){
                return true;
            } else {
                return false;
            }
        } catch(error){
            console.log(error);

            return false;
        }
    }

    async check_codename_exists(codename){
        let query = `SELECT id FROM gear WHERE gear_codename = "${codename}"`;

        try{
            let connection = await this.database.db_connect();
            let result = await this.database.db_query(connection, query);
            this.database.db_close(connection);

            if(result.length > 0){
                return true;
            } else {
                return false;
            }
        } catch(error){
            console.log(error);
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
                "${user.discord_id}",
                "${data.screenshot}",
                ${data.score},
                NOW(),
                "${data.codename}"
            )`;

        let codename_exists = await this.check_codename_exists(data.codename);

        if(codename_exists){
            if(data.score !== null){
                this.message.channel.send(`<@${user.discord_id}> You already have a gear screenshot under the codename '${data.codename}'.\nPlease use a different codename, or use &gear update <${data.codename}> <${data.screenshot}> <${data.score}> to replace it.`);
            } else {
                this.message.channel.send(`<@${user.discord_id}> You already have a gear screenshot under the codename '${data.codename}'.\nPlease use a different codename, or use &gear update <${data.codename}> <${data.screenshot}> to replace it.`);
            }
        } else {
            try{
                let connection = await this.database.db_connect();
                let result = await this.database.db_query(connection, query);
                this.database.db_close(connection);

                if(result.affectedRows > 0){
                    this.message.channel.send(`<@${user.discord_id}> Your screenshot has been uploaded!`);
                }
            } catch(error){
                console.log(error);
                this.message.channel.send('There was a problem with the database operation, please contact the bot administrator.');
            }
        }
    }

    async download(user, data){
        let query = `SELECT gear_screenshot, gear_score, gear_codename FROM gear WHERE users_discord_id = "${user.discord_id}" AND gear_codename = "${data.codename}"`;

        try{
            let connection = await this.database.db_connect();
            let result = await this.database.db_query(connection, query);
            this.database.db_close(connection);

            if(result.length > 0){
                if(result[0]['gear_score'] !== null){
                    this.message.channel.send(`<@${user.discord_id}> ${result[0]['gear_screenshot']}\n\nFound under the name of '${data.codename}' with a gear score value of ${result[0]['gear_score']}.`);
                } else {
                    this.message.channel.send(`<@${user.discord_id}> ${result[0]['gear_screenshot']}\n\nFound under the name of '${data.codename}' with no gear score value declared.`);
                }
            } else {
                this.message.channel.send(`<@${user.discord_id}> No results found for the codename '${data.codename}'.`);
            }
        } catch(error){
            console.log(error);
            this.message.channel.send('There was a problem with the database operation, please contact the bot administrator.');
        }
    }

    async update(user, data){
        let query = `UPDATE gear 
            SET gear_screenshot = "${data.screenshot}", 
                gear_score = ${data.score}, 
                gear_creation_date = NOW()
            WHERE gear_codename = "${data.codename}" AND users_discord_id = "${user.discord_id}"`;

        try{
            let connection = await this.database.db_connect();
            let result = await this.database.db_query(connection, query);
            this.database.db_close(connection);

            if(result.length > 0){
                this.message.channel.send(`<@${user.discord_id}> Your screenshot has been updated under the codename '${data.codename}'!`);
            } else {
                this.message.channel.send(`<@${user.discord_id}> No results found for the codename'${data.codename}'.\nWill attempt to upload your screenshot link to the provided codename.`);

                this.upload(user, data);
            }
        } catch(error){
            console.log(error);
            this.message.channel.send('There was a problem with the database operation, please contact the bot administrator.');
        }
    }
}

module.exports = Gear;