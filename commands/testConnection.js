/**
 * Basic database connection test object
 */

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
                console.log(error);
            }
        }
    }
}

module.exports = Cmd;