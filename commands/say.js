module.exports = {
    description: 'Repito lo que digas',
    run: async (message) =>{
        const args = message.content.split(' ').slice(1).join(' ');
        if (args.lenght < 1) {
            return message.reply('Provee un argumento válido')
        }
        message.reply(args)
    }
}