
/*
    Package designed to handle gear upload operations
    Here the controller object will be passed different gear commands and execute them with the gear object
    During the runtime of this object, the gear parameters should be handled and failed in a delicate manner -
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

        let gear_load = require('../lib/gear.js');
        this.gear = new gear_load(this.database, this.message);
    }

    // Set the user data for the module
    set_user_data(user){
        this.user.name = user.name;
        this.user.discord_id = user.discord_id;
    }

    // Set and prepare our gear command, store the extra parameters for processing
    set_params(params){
        this.mode = params[0];
        params.shift();
        this.params = params;
    }

    // Similar behaviour for command handling
    // The first parameter found should always be the 'secondary command' (mode) followed by the parameters required
    async launch_gear(mode){

        let data = {
            codename: "",
            screenshot: "",
            score: null
        };
        
        switch(mode){
            case 'upload':
                data.codename = this.params[0];
                data.screenshot = this.params[1];

                if(typeof(this.params[2]) !== 'undefined' && this.command.check_optional_params([2], this.params)){
                    data.score = this.params[2];
                    this.params.pop();
                }

                try{
                    this.command.check_parameters(2, this.params);
                } catch(error){
                    this.message.channel.send(error);

                    return false;
                }
                
                this.gear.upload(this.user, data);
                break;

            case 'download':
                data.codename = this.params[0];
                data.screenshot = this.params[1];

                try{
                    this.command.check_parameters(1, this.params);
                } catch(error){
                    this.message.channel.send(error);

                    return false;
                }

                this.gear.download(this.user, data);
                break;

            case 'update':
                data.codename = this.params[0];
                data.screenshot = this.params[1];

                if(typeof(this.params[2]) !== 'undefined' && this.command.check_optional_params([2], this.params)){
                    data.score = this.params[2];
                    this.params.pop();
                }

                try{
                    this.command.check_parameters(2, this.params);
                } catch(error){
                    this.message.channel.send(error);

                    return false;
                }

                this.gear.update(this.user, data);
                break;

            default:
                this.message.channel.send(`<@${this.user.discord_id}> '${mode}' is not a valid gear command.\n\nPlease use '&help' if you are unsure how to use this command.`);
                break;
        }
    }

    // Run and execute the appropriate gear command if valid
    // Or else we terminate the command and hopefully explain why
    async run(){
        let player_exists = await this.gear.check_player_exists(this.user.discord_id);

        if(!player_exists){
            let load_register = require("../commands/register.js");
            let register = new load_register(this.database, this.message, true);
            register.set_user_data({name: this.user.name, discord_id: this.user.discord_id});
            register.run();

            this.message.channel.send(`<@${this.user.discord_id}> You don't seem to exist in my database...\nI've registered you ony our behalf, try the command again!`);
        } else {
            await this.launch_gear(this.mode);
        }
    }
}

module.exports = Cmd;