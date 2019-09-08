
/*
    Package designed to handle casino play operations
    Here the controller object will be passed different casino commands and execute them with the casino object
    During the runtime of this object, the casino parameters should be handled and failed in a delicate manner -
    - if applicable
    Automatic registration is included in this module
*/

class Cmd{

    constructor(command, message, database){
        this.command = command;
        this.message = message;
        this.database = database;

        this.load_register = require("../commands/register.js");
        this.register = new this.load_register(this.database, this.message, true);

        this.user = {
            name: "",
            discord_id: ""
        };

        let casino_load = require('../lib/casino.js');
        this.casino = new casino_load(this.database);
    }

    set_user_data(user){
        this.user.name = user.name;
        this.user.discord_id = user.discord_id;
    }

    // Set and prepare our casino command, ready for logic testing
    set_control(mode){
        this.mode = mode;
    }

    async launch_casino(mode){
        switch(mode){
            case 'play':
                this.casino.play();
                break;

            case 'donate':
                this.casino.donate();
                break;
                
            case 'scavenge':
                this.casino.scavenge();
                break;
        }
    }

    // Run and execute the appropriate casino command if valid
    // Or else we terminate the command and hopefully explain why
    async run(){
        if(this.casino.check_player_exists(this.user.id)){
            register.set_user_data({name: this.message.author.username, discord_id: this.message.author.id});
            register.run();
        } else {
            try{
                await this.launch_casino(this.mode);
            } catch(error){
                this.message.channel.send(`<@${this.user.discord_id}> ${error.message}`);
            }
        }
    }
}

module.exports = Cmd;