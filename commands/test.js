class Cmd {

    constructor(command, message){
        this.command = command;
        this.message = message;
    }

    async run(){
        if(this.message.author.id === this.command.config.author.id){
//            this.message.channel.send("Wha... wha... yo yo I'm awake, I swear!");
        }
    }
}

module.exports = Cmd;