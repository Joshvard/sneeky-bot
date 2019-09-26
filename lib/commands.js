class Commands{

    constructor(discord, client, database, config){
        this.discord = discord;
        this.client = client;
        this.database = database;
        this.config = config;
        this.commands = require('../includes/commands.json');
    }
    
    // Function designed to find and execute the requested command
    async launch_command(request, message){
        let verified_command = this.get_command(request);
        let params = this.get_params(request);

        switch(verified_command){
            case 'test':
                let load_test = require('../commands/test.js');
                let test = new load_test(this, message);
                test.run();
                break;
            
            case 'info':
                let load_info = require('../commands/info.js');
                let info = new load_info(message);
                info.run();
                break;

            case 'pepegarise':
                let load_pepegarise = require('../commands/pepegarise.js');
                let pepegarise = new load_pepegarise(this, message);
                pepegarise.set_params(params);
                pepegarise.run();
                break;

            case 'help':
                message.channel.send('Help section under construction.');
                break;
                
            case 'testConnection':
                let load_testConnection = require('../commands/testConnection.js');
                let testConnection = new load_testConnection(this, message);
                testConnection.run();
                break;

            case 'register':
                let load_register = require("../commands/register.js");
                let register = new load_register(this.database, message);
                register.set_user_data({name: message.author.username, discord_id: message.author.id});
                register.run();
                break;

            case 'gear':
                let load_gear = require('../commands/gear.js');
                let gear = new load_gear(this, message);
                gear.run();
                break;
                
            case 'casino':
                let load_casinoCtrl = require('../commands/casinoCtrl.js');
                let casinoCtrl = new load_casinoCtrl(this, message, this.database);
                casinoCtrl.set_user_data({name: message.author.username, discord_id: message.author.id});
                casinoCtrl.set_params(params);
                casinoCtrl.run();
                break;

            default:
                message.channel.send(`'${verified_command}' is not a valid command.\n\nUse '${this.config.prefix}help' for a list of general commands.`);
                break;
        }   
    }

    // Get the requested command
    get_command(command_request){
        command_request = command_request.split(' ')[0];
        command_request = this.sanitise_string(command_request);

        return command_request;
    }

    // Parameter validation
    verify_params(params, expectedNoOfParams){
        if(params.length === expectedNoOfParams){
            params.forEach((val, index) => {
                // Check if the parameter even contains a value
                if(params[index] === '') return params = false;

                params[index] = this.sanitise_string(val);
            });

            return params;
        } else {
            return false;
        }
    }

    // Multi-parameter commands need to be split into their respective components for the command to process
    // We will accomplish this by returning an array of the additional parameters after the command parameter itself
    get_params(string){
        let parameters = [];
        parameters = string.split(' ');
        parameters.shift();

        let return_params = [];
        let str_flag = false;
        let param_element = "";
        let param_index = 0;

        // Typically we want to split the parameters using spaces... this however would mess with parameters that need to be parsed as sentances
        // We can accomplish this by using symbols such as '<' and '>' to mark the sentance to be parsed to the command, we sort that out here
        parameters.forEach((val, i) => {
            if(val.charAt(0) === '<'){
                param_element = val;
                str_flag = true;
            } else if(str_flag === true) {

                // Continue appending the sentance to the single parameters whilst we are inside the specified symbol blocks
                param_element += ` ${val}`;

                if(val.charAt(val.length-1) === '>'){
                    str_flag = false;
                    return_params[param_index] = param_element;
                    param_index++;
                }
            } else {
                return_params[param_index] = val;
                param_index++;
            }
        });

        return return_params;
    }

    // Simple check for multi-parameter commands
    check_parameters(expected_param_count, params){
        let check_state = true;
        
        if(expected_param_count < params.length){
            throw `<@${this.user.discord_id}> Too many parameters were provided!\nPlease use &help if you are unsure how to use this command.`;
        } else if(expected_param_count > params.length){
            throw `<@${this.user.discord_id}> Not enough parameters were provided!\nPlease use &help if you are unsure how to use this command.`;
        }

        return check_state;
    }

    // String clean function, eliminates common injection characters
    sanitise_string(string){
        string.replace('\'', '').replace('"', '').replace(';', '');
        return string;
    }
}

module.exports = Commands;