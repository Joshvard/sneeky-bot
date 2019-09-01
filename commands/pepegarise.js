class Cmd {

    constructor(command, message){
        this.command = command;
        this.message = message;
    }

    set_params(params){
        this.params = params;
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

    async run(){
        let args = this.command.verify_params(this.params, 1);

        if(args){
            await this.pepegarise(args).then((pepegarised_str) => {
                this.message.channel.send(pepegarised_str);
            }); 
        } else {
            this.message.channel.send(`There was an error with your parameters!\nUse '${this.command.config.prefix}help' to find out how to use this command.`)
        }
    }
}

module.exports = Cmd;