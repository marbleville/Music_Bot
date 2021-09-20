const { Client, MessageEmbed, Intents } = require('discord.js');
const ytdl = require('ytdl-core');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, 
    Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES] });
const token = 'TOKEN';
const Prefix = '+';
const { opus } = require('@discordjs/opus');

let queue = [];
let connection;

bot.on('ready', () => {
    console.log('Bot Online');
})

bot.on('messageCreate', message => {
    let args = message.content.substring(Prefix.length).split(" ");
    if (!message.content.startsWith(Prefix)) return;

    switch(args[0]) {
        case 'play':
            if (message.member.voice)
                {
                    if (args[1]) {
                    var valid = /^(ftp|http|https):\/\/[^ "]+$/.test(args[1]);
                    if (valid) {
                        //get video by url
                        const songInfo = await ytdl.getInfo(args[1]);
                        const song = {
                            title: songInfo.videoDetails.title,
                            url: songInfo.videoDetails.video_url,
                        };
                        queue.push(song);
                        message.channel.send(`Added ${song.title} to the queue.`);
                        if (queue.length === 1) {
                            message.channel.send(`Playing ${song.title} in <#${message.member.voice.channel.id}>`)
                        }
                        play(message);
                    } else {
                        //search by keyword
                    }
                }
            } else {
                message.channel.send(`<@${message.author.id}>, you must be in a VC to listen to music!`);
            }
        break;
    }
})

function play(message) {
    //grab data from next song in queue and play to the channel.
    let c = message.member.voice.channel;

    connection = joinVoiceChannel({
        channelId: c.id,
        guildId: c.guild.id,
        adapterCreator: c.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer({
        behaviors: {
            noSubscriber: NoSubscriberBehavior.Pause,
        },
    });
    const resource = createAudioResource('./beep.mp3');
    connection.subscribe(player);
    //player.play(resource);
    let ct = 0;
    player.play(resource);
}

bot.login(token);