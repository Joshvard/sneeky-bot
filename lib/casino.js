class Casino{

    constructor(database, message){
        this.database = database;
        this.message = message;
    }

    async check_player_exists(id){

        try{
            this.connection = await this.database.db_connect();
        } catch(error){
            console.log(error);
            this.message.channel.send('There was a problem with the database operation, please contact the bot administrator.');

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
            this.message.channel.send('There was a problem with the database operation, please contact the bot administrator.');

            return false;
        }
    }

    async get_balance(id){
        let query = `SELECT casino_credits FROM casino WHERE users_discord_id = ${id}`;

        try{
            this.connection = await this.database.db_connect();
        } catch(error){
            console.log(error);
            this.message.channel.send('There was a problem with the database operation, please contact the bot administrator.');

            return false;
        }

        try{
            let result = await this.database.db_query(this.connection, query);
            let balance = result[0]['casino_credits'];
            this.database.db_close(this.connection);
    
            return balance;
        } catch(error){
            console.log(error);
            this.message.channel.send('There was a problem with the database operation, please contact the bot administrator.');

            return false;
        }
    }

    async play(player, bet){
        let balance = await this.get_balance(player.discord_id);

        if(bet > balance){
            this.message.channel.send(`<@${player.discord_id}> Your bet is over your balance amount: ${balance}.\nTry a bet below or equal to your balance.`);

            return true;
        }

        let random_roll = parseInt(Math.random() * 100);
        balance -= bet;

        if(random_roll > 50){
            balance += (bet * 2);
            this.message.channel.send(`<@${player.discord_id}> You won the dice role!\nWinnings: ${(bet * 2)}.\nNew balance: ${balance}.`);
        } else {
            this.message.channel.send(`<@${player.discord_id}> You lost the dice role...\nLosses: ${bet}.\nNew balance: ${balance}.`);
        }

        try{
            this.connection = await this.database.db_connect();

            await this.database.db_query(this.connection, `UPDATE casino
                SET casino_credits = ${balance}
                WHERE users_discord_id = ${player.discord_id}
            `);
        } catch(error){
            console.log(error);
            this.message.channel.send('There was a problem with the database operation, please contact the bot administrator.');

            return false;
        }

        return true;
    }

    async balance(player){
        let balance = await this.get_balance(player.discord_id);

        this.message.channel.send(`<@${player.discord_id}> Your balance: ${balance}.`);
    }

    donate(){
        
    }

    async scavenge(player){
        let balance = await this.get_balance(player.discord_id);

        if(balance > 0){
            this.message.channel.send(`<@${player.discord_id}> You find some cash, but you already have money in your balance... asshole.`);

            return true;
        }

        try{
            this.connection = await this.database.db_connect();

            balance += 500;
            
            await this.database.db_query(this.connection, `UPDATE casino
                SET casino_credits = 500
                WHERE users_discord_id = ${player.discord_id}
            `);

            this.message.channel.send(`<@${player.discord_id}> You scavenge the casino and find some cash :D.\nNew balance: ${balance}.`);

            return true;

        } catch(error){
            console.log(error);
            this.message.channel.send('There was a problem with the database operation, please contact the bot administrator.');

            return false;
        }
    }
}

module.exports = Casino;