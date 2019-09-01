class Cmd {

    constructor(message){
        this.message = message;
    }

    async run(){
        this.message.channel.send(`<@${this.message.author.id}>\n
            Name: ${this.message.author.username}\n
            Id: ${this.message.author.id}\n
            Tag: ${this.message.author.tag}\n
            Discriminator: ${this.message.author.discriminator}\n
            Timestamp: ${this.message.author.createdTimestamp}\n
            Created: ${this.message.author.createdAt}\n
            Avatar Id: ${this.message.author.avatar}`);
    }
}

module.exports = Cmd;