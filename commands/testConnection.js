class Cmd {

    constructor(command, message){
        this.command = command;
        this.message = message;
    }

    async run(){
        if(this.message.author.id === this.command.config.author.id){
            try{
                await this.command.database.test_connection();
            } catch(error){
                this.message.channel.send(`Database error: ${error}`);
            }
        }
    }
}

module.exports = Cmd;