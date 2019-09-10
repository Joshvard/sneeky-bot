
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

    // Set and prepare our casino command, store the extra parameters for processing
    set_params(params){
        this.mode = params[0];
        params.shift();
        this.params = params;
    }

    check_parameters(expected_param_count, expected_params, params){
        let check_state = true;
        
        if(expected_param_count !== params.length){
            throw `<@${this.user.discord_id}> Too many parameters were provided!\n
                    Please use &help if you are unsure how to use this command.`;
        }

        expected_params.forEach((val, i) => {
            if(!params.indexOf(val)){
                throw `<@${this.user.discord_id}> Expected parameter(s) was not provided!\n
                    Please use &help if you are unsure how to use this command.`;
            }
        });

        return check_state;
    }

    async launch_casino(mode){
        switch(mode){
            case 'play':
                try{
                    this.casino.check_parameters(2, ['play'], this.params);

                    if(Number.isInteger(this.params[2])){
                        if(this.params < 0){
                            throw `<@${this.user.discord_id}> You must bet over 0 to play!\n
                                If you have no money, ask a friend for a donation or use &scavenge (On a cooldown).`;
                        }
                    } else {
                        throw `<@${this.user.discord_id}> Your parameters are incorrect!\n
                        The correct use of this command is &casino play *numerical value you wish to bet*`;
                    }

                    this.casino.play(this.user.discord_id);
                } catch(error){
                    this.message.channel.send(error.message);
                }
                break;

            case 'balance':
                this.casino.balance();
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
        if(!this.casino.check_player_exists(this.user.id)){
            register.set_user_data({name: this.message.author.username, discord_id: this.message.author.id});
            register.run();
        } else {
            await this.launch_casino(this.mode);
        }
    }
}

module.exports = Cmd;