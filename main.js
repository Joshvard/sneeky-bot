// Class designed to handle the app's main event loop
// Most our modules should be performed here
class ProgramHandler{
    // Inject our dependencies
    constructor(discord, config){
        this.discord = discord;
        this.client = new discord.Client();
        this.config = config;

        let Database = require('./lib/database');
        this.database = new Database(this.config);

        let Commands = require('./lib/commands');
        this.commands = new Commands(this.discord, this.client, this.database, this.config);

    }

    // Initialise the bot, wake her up!
    async init(){
        try{
            // Check for a database connection
            await this.database.test_connection();
        } catch(error){
            // Database connection failed, handle this occurance here
            console.log(error);
            process.exit();
        }

        this.client.login(this.config.token);
        this.client.once('ready', () => {
            console.log('Ready!');
        });
    }

    // Main event loop, 
    main(){
        this.init();

        // Listens for messages made in channels that the bot has access to
        // We perform a series of checks to validate the data we're looking for (ideally a command)
        // If the message does not start with the prefix, ignore the message entirely
        // Someone is attempting a command, clean the string and verify the command exists
        // We shall execute the command if it does exist
        this.client.on('message', message => {
            if(message.content.startsWith(this.config.prefix) && message.content.length !== 1 && message.author.id !== this.config.client.id){
                message.content.replace(this.config.prefix,'');
                if(this.config.testmode && message.author.id !== "161585838508081153"){
                    message.channel.send("I am currently under maintainance or being tested!");
                } else {
                    this.commands.launch_command(message.content.replace(this.config.prefix, ''), message);
                }
            }
        });
    }
}

module.exports = ProgramHandler;