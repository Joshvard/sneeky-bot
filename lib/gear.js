class Gear{

    constructor(database, message){
        this.database = database;
        this.message = message;
    }

    async check_player_exists(id){

        try{
            this.connection = await this.database.db_connect();

            let result = await this.database.db_query(this.connection, `SELECT users_id FROM users WHERE users_discord_id = ${id}`);
        } catch(error){
            console.log(error);
            return false;
        }

        if(result.length > 0){
            return true;
        } else {
            return false;
        }
    }

    async check_codename_exists(codename){
        let query = `SELECT gear_id FROM gear WHERE gear_codename = "${codename}"`;

        try{
            let connection = await this.database.db_connect();
            let result = await this.database.db_query(connection, query);
            this.database.db_close(connection);
        } catch(error){
            console.log(error);
            return false
        }

        if(result.length > 0){
            return true;
        } else {
            return false;
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
            } catch(error){
                console.log(error);
                return false
            }

            if(result.affectedRows > 0){
                this.message.channel.send(`<@${user.discord_id}> Your screenshot has been uploaded!`);
            }
        }
    }

    async download(user, data){
        let query = `SELECT gear_screenshot, gear_score, gear_codename FROM gear WHERE users_discord_id = "${user.discord_id}" AND gear_codename = "${data.codename}"`;

        try{
            let connection = await this.database.db_connect();
            let result = await this.database.db_query(connection, query);
            this.database.db_close(connection);
        } catch(error){
            console.log(error);
            return false
        }

        if(result.length > 0){
            if(result[0]['gear_score'] !== null){
                this.message.channel.send(`<@${user.discord_id}> ${result[0]['gear_screenshot']}\n\nFound under the name of '${data.codename}' with a gear score value of ${result[0]['gear_score']}.`);
            } else {
                this.message.channel.send(`<@${user.discord_id}> ${result[0]['gear_screenshot']}\n\nFound under the name of '${data.codename}' with no gear score value declared.`);
            }
        } else {
            this.message.channel.send(`<@${user.discord_id}> No results found for the codename '${data.codename}'.`);
        }
    }

    async update(user, data){
        let update_query = `
            UPDATE gear 
            SET gear_screenshot = "${data.screenshot}", 
                gear_score = ${data.score}, 
                gear_creation_date = NOW() 
            WHERE gear_codename = "${data.codename}" AND users_discord_id = "${user.discord_id}"`;

        let insert_query = `
            INSERT INTO gear(
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
                "${data.codename}")`;

        let codename_exists = await this.check_codename_exists(data.codename);

        if(codename_exists){
            try{
                let connection = await this.database.db_connect();
                let result = await this.database.db_query(connection, update_query);
                this.database.db_close(connection);
            } catch(error){
                console.log(error);
                return false;
            }

            if(result.affectedRows > 0){
                this.message.channel.send(`<@${user.discord_id}> Your screenshot has been updated!`);
            }
        } else {
            try{
                let connection = await this.database.db_connect();
                let result = await this.database.db_query(connection, insert_query);
                this.database.db_close(connection);
            } catch(error){
                console.log(error);
                return false;
            }

            if(result.affectedRows > 0){
                this.message.channel.send(`<@${user.discord_id}> You don't have a screenshot under '${data.codename}'.\nIt's ok, I'll just upload it for you anyways :D!`);
            }
        }
    }
}

module.exports = Gear;