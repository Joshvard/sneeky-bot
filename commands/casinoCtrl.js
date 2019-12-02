
/*
    Package designed to handle casino play operations
    Here the controller object will be passed different casino commands and execute them with the casino object
    During the runtime of this object, the casino parameters should be handled and failed in a delicate manner -
    - if applicable
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
        this.casino = new casino_load(this.database, this.message);
    }

    // Set the user data for the module
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

    // Similar behaviour for command handling
    // The first parameter found should always be the 'secondary command' (mode) followed by the parameters required
    async launch_casino(mode){
        switch(mode){
            case 'play':
                try{
                    this.command.check_parameters(1, this.params);

                    let bet = parseInt(this.params[0]);

                    if(Number.isInteger(bet)){
                        if(bet <= 0){
                            throw `<@${this.user.discord_id}> You must bet over 0 to play!\nIf you have no money, ask a friend for a donation or use &casino scavenge (On a cooldown).`;
                        }
                    } else {
                        throw `<@${this.user.discord_id}> Your parameters are incorrect!\nThe correct use of this command is &casino play (*numerical value you wish to bet*)`;
                    }

                    this.casino.play(this.user, bet);
                } catch(error){
                    this.message.channel.send(error);
                }
                break;

            case 'balance':
                this.casino.balance(this.user);
                break;

            case 'donate':
                this.casino.donate();
                break;

            case 'scavenge':
                this.casino.scavenge(this.user);
                break;

            default:
                this.message.channel.send(`<@${this.user.discord_id}> '${mode}' is not a valid casino command.\n\nPlease use '&help' if you are unsure how to use this command.`);
                break;
        }
    }

    // Run and execute the appropriate casino command if valid
    // Or else we terminate the command and hopefully explain why
    async run(){
        let player_exists = await this.casino.check_player_exists(this.user.discord_id);

        if(!player_exists){
            let load_register = require("../commands/register.js");
            let register = new load_register(this.database, this.message, true);
            register.set_user_data({name: this.user.name, discord_id: this.user.discord_id});
            register.run();

            this.message.channel.send(`<@${this.user.discord_id}> You don't seem to exist in my database...\nI've registered you ony our behalf, try the command again!`);
        } else {
            await this.launch_casino(this.mode);
        }
    }
}

module.exports = Cmd;