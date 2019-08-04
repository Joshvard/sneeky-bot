class Commands{

    constructor(discord, client, database, config){
        this.discord = discord;
        this.client = client;
        this.database = database;
        this.config = config;
        this.commands = require('../includes/commands.json');
    }

    // Get the requested command
    get_command(command_request){
        command_request = command_request.split(' ')[0];
        command_request = this.sanitise_string(command_request);

        return command_request;
    }

    // Parameter validation
    verify_params(params, expectedNoOfParams){
        params.shift();

        if(params.length === expectedNoOfParams){
            params.forEach((val, index) => {
                params[index] = this.sanitise_string(val);
            });

            return params;
        } else {
            return false;
        }
    }

    get_params(string){
        let command = [];
        command[0] = string.split(' ')[0];

        if(string.split('')[1]){
            let long_args = string.substr(
                string.lastIndexOf("<") + 1, 
                string.lastIndexOf(">")
            );

            command[1] = long_args.replace(/\>/g, '');
        }

        return command;
    }

    pepegarise(string){
        this.pepega_str = string[0];

        return new Promise((resolve) => {
            let string = this.pepega_str;
            let newStr = [];
            
            for(let i = 0; i < string.length; i++){
                if(i % 2 === 0){
                    newStr[i] = string[i].toUpperCase();
                } else {
                    newStr[i] = string[i];
                }
            }
            
            return resolve(newStr.join().replace(/\,/g, ''));
        });
    }
    
    // Function designed to find and execute the requested command
    async launch_command(command, message){
        let params = this.get_params(command);
        let verified_command = params[0];

        switch(verified_command){
            case 'test':
                if(message.author.id === this.config.author.id){
                    message.channel.send("Wha... wha... yo yo I'm awake, I swear!");
                }
                break;
            
            case 'info':
                message.channel.send(`<@${message.author.id}>\n
                Name: ${message.author.username}\n
                Id: ${message.author.id}\n
                Tag: ${message.author.tag}\n
                Bot?: ${message.author.bot}\n
                Discriminator: ${message.author.discriminator}\n
                Timestamp: ${message.author.createdTimestamp}\n
                Created: ${message.author.createdAt}\n
                Avatar Id: ${message.author.avatar}`);
                break;

            case 'bot_info':
                message.channel.send(`&info`);
                break;

            case 'pepegarise':
                let args = this.verify_params(params, 1);

                if(args){
                    await this.pepegarise(args).then((pepegarised_str) => {
                        message.channel.send(pepegarised_str);
                    }); 
                } else {
                    message.channel.send(`There was an error with your parameters!\nUse '${this.config.prefix}help' to find out how to use this command.`)
                }
                break;

            case 'help':
                message.channel.send('Help section under construction.');
                break;
                
            case 'testConnection':
                if(message.author.id === this.config.author.id){
                    message.channel.send(await this.database.test_connection());
                }
                break;

            default:
                    message.channel.send(`'${verified_command}' is not a valid command.\n\nUse '${this.config.prefix}help' for a list of general commands.`);
                break;
        }   
    }

    // String clean function, eliminates common injection characters
    sanitise_string(string){
        string.replace('\'', '').replace('"', '').replace(';', '');
        return string;
    }
}

module.exports = Commands;