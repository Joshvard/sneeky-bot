class Cmd {

    constructor(command, message){
        this.command = command;
        this.message = message;
    }

    async run(){
        if(this.message.author.id === this.command.config.author.id){
            this.message.channel.send(await this.command.database.test_connection());
        }
    }
}

module.exports = Cmd;