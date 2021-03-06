/**
 * The main command module
 * 
 * Handle our command interactions here.
 * Command modules should be loaded and ran within their respective cases.
 * 
 * Contains some utility functions for command processing which should be inherited or made available via dependancy injection with this class.
 */

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
                let load_gearCtrl = require('../commands/gearCtrl.js');
                let gearCtrl = new load_gearCtrl(this, message, this.database);
                gearCtrl.set_user_data({name: message.author.username, discord_id: message.author.id});
                gearCtrl.set_params(params);
                gearCtrl.run();
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
            if(val.charAt(0) === '<' && val.charAt(val.length-1) !== '>'){
                param_element = val;
                str_flag = true;
            } else if(str_flag === true) {

                // Continue appending the sentance to the single parameters whilst we are inside the specified symbol blocks
                param_element += ` ${val}`;

                if(val.charAt(val.length-1) === '>'){
                    str_flag = false;
                    return_params[param_index] = param_element.replace(/\</g, '').replace(/\>/g, '');
                    param_index++;
                }
            } else {
                return_params[param_index] = val.replace(/\</g, '').replace(/\>/g, '');
                param_index++;
            }
        });

        return return_params;
    }

    // Simple check for multi-parameter commands
    check_parameters(expected_param_count, params){
        if(expected_param_count < params.length){
            throw `<@placeholder> Too many parameters were provided!\nPlease use &help if you are unsure how to use this command.`;
        } else if(expected_param_count > params.length){
            throw `<@placeholder> Not enough parameters were provided!\nPlease use &help if you are unsure how to use this command.`;
        }

        return true;
    }

    /**
     * Function designed to indicate the optional parameters to be used within a 
     * 
     * @param {An array containing the element index of the optional parameters} optional_index 
     * @param {The parameter object} params 
     * 
     * @return {Returns true if all optional parameters provided exist, false if any are missing}
     */
    check_optional_params(optional_index, params){
        let param_integrity = true;

        for(let i=0; i < optional_index.length; i++){
            if(params[optional_index[i]].length <= 0){
                param_integrity = false;
            }
        }

        return param_integrity;
    }

    // String clean function, eliminates common injection characters
    sanitise_string(string){
        string.replace('\'', '').replace('"', '').replace(';', '');
        return string;
    }

    check_author_is_mod(id){
        let connection = await this.database.db_connect();
        
        try{
            let query = `
            SELECT role_group.role_group_name 
            FROM role_group 
            LEFT JOIN users 
                ON users.role_group_id = role_group.role_group_id 
            WHERE users.users_id = ${id}`;

            let result = await this.database.db_qyert(connection, query);
        } catch(error){
            console.log(error);
            return false;
        }

        if(result.length <= 0){
            return false;
        }

        if(result[0] === 'mod'){
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Commands;