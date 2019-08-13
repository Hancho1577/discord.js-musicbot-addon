const ytdl = require('ytdl-core');
const {YTSearcher} = require('ytsearcher');
const ytpl = require('ytpl');
const Discord = require('discord.js');
const PACKAGE = require('./package.json');

exports.start = (client, options) => {
try {
    if (process.version.slice(1).split('.')[0] < 8) {
      console.error(new Error(`[MusicBot] node v8 or higher is needed, please update`));
      process.exit(1);
    };

    /**
      * Class of the Music Bot.
      * @class
      * @param {Client} A Discord.js client
      * @param {object} Object passed for options
    */
    class Music {
      constructor(client, options) {
        // Data Objects
        this.commands = new Map();
        this.commandsArray = [];
        this.aliases = new Map();
        this.queues = new Map();
        this.client = client;

        // Play Command options
        this.play = {
          enabled: (options.play == undefined ? true : (options.play && typeof options.play.enabled !== 'undefined' ? options.play && options.play.enabled : true)),
          run: "playFunction",
          alt: (options && options.play && options.play.alt) || [],
          help: (options && options.play && options.play.help) || "이름 또는 링크로 노래를 즉시 재생합니다.",
          name: (options && options.play && options.play.name) || "play",
          usage: (options && options.play && options.play.usage) || null,
          exclude: Boolean((options && options.play && options.play.exclude)),
          masked: "play"
        };

		this.join = {
            enabled: true,
            run: "joinFunction",
            alt: (options && options.join && options.join.alt) || [],
            help: (options && options.join && options.join.help) || "음성채널에 참가합니다. (``^j,^join,^참가``)",
            name: (options && options.join && options.join.name) || "참가",
            usage: (options && options.join && options.join.usage) || null,
            exclude: Boolean((options && options.join && options.join.exclude)),
            masked: "join"
        };

        // Help Command options
        this.help = {
          enabled: (options.help == undefined ? true : (options.help && typeof options.help.enabled !== 'undefined' ? options.help && options.help.enabled : true)),
          run: "helpFunction",
          alt: (options && options.help && options.help.alt) || [],
          help: (options && options.help && options.help.help) || "도움말 명령어입니다.",
          name: (options && options.help && options.help.name) || "help",
          usage: (options && options.help && options.help.usage) || null,
          exclude: Boolean((options && options.help && options.help.exclude)),
          masked: "help"
        };

        // Pause Command options
        this.pause = {
          enabled: (options.pause == undefined ? true : (options.pause && typeof options.pause.enabled !== 'undefined' ? options.pause && options.pause.enabled : true)),
          run: "pauseFunction",
          alt: (options && options.pause && options.pause.alt) || [],
          help: (options && options.pause && options.pause.help) || "노래를 일시 정지 합니다.",
          name: (options && options.pause && options.pause.name) || "pause",
          usage: (options && options.pause && options.pause.usage) || null,
          exclude: Boolean((options && options.pause && options.pause.exclude)),
          masked: "pause"
        };

        // Resume Command options
        this.resume = {
          enabled: (options.resume == undefined ? true : (options.resume && typeof options.resume.enabled !== 'undefined' ? options.resume && options.resume.enabled : true)),
          run: "resumeFunction",
          alt: (options && options.resume && options.resume.alt) || [],
          help: (options && options.resume && options.resume.help) || "노래를 다시 재생합니다.",
          name: (options && options.resume && options.resume.name) || "resume",
          usage: (options && options.resume && options.resume.usage) || null,
          exclude: Boolean((options && options.resume && options.resume.exclude)),
          masked: "resume"
        };

        // Leave Command options
        this.leave = {
          enabled: (options.leave == undefined ? true : (options.leave && typeof options.leave.enabled !== 'undefined' ? options.leave && options.leave.enabled : true)),
          run: "leaveFunction",
          alt: (options && options.leave && options.leave.alt) || [],
          help: (options && options.leave && options.leave.help) || "보이스채널을 퇴장합니다.",
          name: (options && options.leave && options.leave.name) || "leave",
          usage: (options && options.leave && options.leave.usage) || null,
          exclude: Boolean((options && options.leave && options.leave.exclude)),
          masked: "leave"
        };

        // Queue Command options
        this.queue = {
          enabled: (options.queue == undefined ? true : (options.queue && typeof options.queue.enabled !== 'undefined' ? options.queue && options.queue.enabled : true)),
          run: "queueFunction",
          alt: (options && options.queue && options.queue.alt) || [],
          help: (options && options.queue && options.queue.help) || "현재 큐(플레이리스트)를 보여줍니다.",
          name: (options && options.queue && options.queue.name) || "queue",
          usage: (options && options.queue && options.queue.usage) || null,
          exclude: Boolean((options && options.queue && options.queue.exclude)),
          masked: "queue"
        };

        // Nowplaying Command options
        this.np = {
          enabled: (options.np == undefined ? true : (options.np && typeof options.np.enabled !== 'undefined' ? options.np && options.np.enabled : true)),
          run: "npFunction",
          alt: (options && options.np && options.np.alt) || [],
          help: (options && options.np && options.np.help) || "현재 재생중인 노래의 정보를 알려줍니다.",
          name: (options && options.np && options.np.name) || "np",
          usage: (options && options.np && options.np.usage) || null,
          exclude: Boolean((options && options.np && options.np.exclude)),
          masked: "np"
        };

        // Loop Command options
        this.loop = {
          enabled: (options.loop == undefined ? true : (options.loop && typeof options.loop.enabled !== 'undefined' ? options.loop && options.loop.enabled : true)),
          run: "loopFunction",
          alt: (options && options.loop && options.loop.alt) || [],
          help: (options && options.loop && options.loop.help) || "반복을 설정할 수 있습니다.",
          name: (options && options.loop && options.loop.name) || "loop",
          usage: (options && options.loop && options.loop.usage) || null,
          exclude: Boolean((options && options.loop && options.loop.exclude)),
          masked: "loop"
        };

        // Search Command options
        this.search = {
          enabled: (options.search == undefined ? true : (options.search && typeof options.search.enabled !== 'undefined' ? options.search && options.search.enabled : true)),
          run: "searchFunction",
          alt: (options && options.search && options.search.alt) || [],
          help: (options && options.search && options.search.help) || "영상을 검색하고 재생합니다. (Play명령어보다 추천합니다)",
          name: (options && options.search && options.search.name) || "search",
          usage: (options && options.search && options.search.usage) || null,
          exclude: Boolean((options && options.search && options.search.exclude)),
          masked: "search"
        };

        // Clear Command options
        this.clearqueue = {
          enabled: (options.clearqueue == undefined ? true : (options.clearqueue && typeof options.clearqueue.enabled !== 'undefined' ? options.clearqueue && options.clearqueue.enabled : true)),
          run: "clearFunction",
          alt: (options && options.clear && options.clear.alt) || [],
          help: (options && options.clear && options.clear.help) || "큐를 초기화합니다.",
          name: (options && options.clear && options.clear.name) || "clear",
          usage: (options && options.clear && options.clear.usage) || null,
          exclude: Boolean((options && options.clearqueue && options.clearqueue.exclude)),
          masked: "clearqueue"
        };

        // Volume Command options
        this.volume = {
          enabled: (options.volume == undefined ? true : (options.volume && typeof options.volume.enabled !== 'undefined' ? options.volume && options.volume.enabled : true)),
          run: "volumeFunction",
          alt: (options && options.volume && options.volume.alt) || [],
          help: (options && options.volume && options.volume.help) || "봇의 볼륨(소리)을 조절합니다.",
          name: (options && options.volume && options.volume.name) || "volume",
          usage: (options && options.volume && options.volume.usage) || null,
          exclude: Boolean((options && options.volume && options.volume.exclude)),
          masked: "volume"
        };

        this.remove = {
          enabled: (options.remove == undefined ? true : (options.remove && typeof options.remove.enabled !== 'undefined' ? options.remove && options.remove.enabled : true)),
          run: "removeFunction",
          alt: (options && options.remove && options.remove.alt) || [],
          help: (options && options.remove && options.remove.help) || "큐에서 노래를 제거합니다.",
          name: (options && options.remove && options.remove.name) || "remove",
          usage: (options && options.remove && options.remove.usage) || "{{prefix}}remove [position]",
          exclude: Boolean((options && options.remove && options.remove.exclude)),
          masked: "remove"
        };

        // Skip Command options
        this.skip = {
          enabled: (options.skip == undefined ? true : (options.skip && typeof options.skip.enabled !== 'undefined' ? options.skip && options.skip.enabled : true)),
          run: "skipFunction",
          alt: (options && options.skip && options.skip.alt) || [],
          help: (options && options.skip && options.skip.help) || "노래를 건너뜁니다. 사용법: `skip [번호]`",
          name: (options && options.skip && options.skip.name) || "skip",
          usage: (options && options.skip && options.skip.usage) || null,
          exclude: Boolean((options && options.skip && options.skip.exclude)),
          masked: "skip"
        };

        this.embedColor = (options && options.embedColor) || 'LUMINOUS_VIVID_PINK';
        this.anyoneCanSkip = (options && typeof options.anyoneCanSkip !== 'undefined' ? options && options.anyoneCanSkip : false);
        this.anyoneCanLeave = (options && typeof options.anyoneCanLeave !== 'undefined' ? options && options.anyoneCanLeave : false);
        this.djRole = (options && options.djRole) || "DJ";
        this.anyoneCanPause = (options && typeof options.anyoneCanPause !== 'undefined' ? options && options.anyoneCanPause : false);
        this.anyoneCanAdjust = (options && typeof options.anyoneCanAdjust !== 'undefined' ? options && options.anyoneCanAdjust : false);
        this.youtubeKey = (options && options.youtubeKey);
        this.botPrefix = (options && options.botPrefix) || "!";
        this.defVolume = (options && options.defVolume) || 50;
        this.maxQueueSize = (options && options.maxQueueSize) || 50;
        this.ownerOverMember = (options && typeof options.ownerOverMember !== 'undefined' ? options && options.ownerOverMember : false);
        this.botAdmins = (options && options.botAdmins) || [];
        this.ownerID = (options && options.ownerID);
        this.logging = (options && typeof options.logging !== 'undefined' ? options && options.logging : true);
        this.requesterName = (options && typeof options.requesterName !== 'undefined' ? options && options.requesterName : true);
        this.inlineEmbeds = (options && typeof options.inlineEmbeds !== 'undefined' ? options && options.inlineEmbeds : false);
        this.clearOnLeave = (options && typeof options.clearOnLeave !== 'undefined' ? options && options.clearOnLeave : true);
        this.messageHelp = (options && typeof options.messageHelp !== 'undefined' ? options && options.messageHelp : false);
        this.dateLocal = (options && options.dateLocal) || 'en-US';
        this.bigPicture = (options && typeof options.bigPicture !== 'undefined' ? options && options.bigPicture : false);
        this.messageNewSong = (options && typeof options.messageNewSong !== 'undefined' ? options && options.messageNewSong : true);
        this.insertMusic = (options && typeof options.insertMusic !== 'undefined' ? options && options.insertMusic : false);
        this.defaultPrefix = (options && options.defaultPrefix) || "!";
		this.bitRate = (options && options.bitRate) || "120000";

        // Cooldown Settings
        this.cooldown = {
          enabled: (options && options.cooldown ? options && options.cooldown.enabled : true),
          timer: parseInt((options && options.cooldown && options.cooldown.timer) || 10000),
          exclude: (options && options.cooldown && options.cooldown.exclude) || ["volume","queue","pause","resume","np"]
        };

        this.musicPresence = options.musicPresence || false;
        this.clearPresence = options.clearPresence || false;
        this.recentTalk = new Set();
      }

      /**
      * Updates positions of all songs in a queue.
      * @function doSomething
      * @memberOf my.namespace.Music
      * @param {object} A Discord.js client
      */
      async updatePositions(obj, server) {
        return new Promise((resolve, reject) => {
                  if (!obj || typeof obj !== "object") reject();
                  let mm = 0;
                  var newsongs = [];
                  obj.forEach(s => {
                    if (s.position !== mm) s.position = mm;
                    newsongs.push(s);
                    mm++;
                  });
                  this.queues.get(server).last.position = 0;
                  resolve(newsongs);
                });
      };

      isAdmin(member) {
        if (member.roles.find(r => r.name == this.djRole)) return true;
        if (this.ownerOverMember && member.id === this.botOwner) return true;
        if (this.botAdmins.includes(member.id)) return true;
        return member.hasPermission("ADMINISTRATOR");
      };

      canSkip(member, queue) {
        if (this.anyoneCanSkip) return true;
        else if (this.botAdmins.includes(member.id)) return true;
        else if (this.ownerOverMember && member.id === this.botOwner) return true;
        else if (queue.last.requester === member.id) return true;
        else if (this.isAdmin(member)) return true;
        else return false;
      };

      canAdjust(member, queue) {
        if (this.anyoneCanAdjust) return true;
        else if (this.botAdmins.includes(member.id)) return true;
        else if (this.ownerOverMember && member.id === this.botOwner) return true;
        else if (queue.last.requester === member.id) return true;
        else if (this.isAdmin(member)) return true;
        else return false;
      };

      getQueue(server) {
          if (!this.queues.has(server)) {
            this.queues.set(server, {songs: new Array(), last: null, loop: "none", id: server,volume: this.defVolume});
          };
          return this.queues.get(server);
      };

      setLast(server, last) {
        return new Promise((resolve, reject) => {
          if (this.queues.has(server)) {
            let q = this.queues.get(server);
            q.last = last;
            this.queues.set(server, q);
            resolve(this.queues.get(server));
          } else {
            reject("no server queue");
          };
        });
      };

      getLast(server) {
        return new Promise((resolve, reject) => {
          let q = this.queues.has(server) ? this.queues.get(server).last : null;
          if (!q || !q.last) resolve(null)
          else if (q.last) resolve(q.last);
        });
      };

      emptyQueue(server) {
        return new Promise((resolve, reject) => {
          if (!musicbot.queues.has(server)) reject(new Error(`[emptyQueue] no queue found for ${server}`));
          musicbot.queues.set(server, {songs: [], last: null, loop: "none", id: server, volume: this.defVolume});
          resolve(musicbot.queues.get(server));
        });
      };

      updatePresence(queue, client, clear) {
        return new Promise((resolve, reject) => {
          if (!queue || !client) reject("invalid arguments");
          if (queue.songs.length > 0 && queue.last) {
            client.user.setPresence({
              game: {
                name: "🎵 | " + queue.last.title,
                type: 'PLAYING'
              }
            });
            resolve(client.user.presence);
          } else {
            if (clear) {
              client.user.setPresence({ game: { name: null} });
              resolve(client.user.presence);
            } else {
              client.user.setPresence({
                game: {
                  name: "🎵 | nothing",
                  type: 'PLAYING'
                }
              });
              resolve(client.user.presence);
            };
          };
        });
      };

      updatePrefix(server, prefix) {
        if (typeof prefix == undefined) prefix = this.defaultPrefix;
        if (typeof this.botPrefix != "object") this.botPrefix = new Map();
          this.botPrefix.set(server, {prefix: prefix});
      };
    };

    var musicbot = new Music(client, options);
    if (musicbot.insertMusic == true) client.music = musicbot;
    else exports.bot = musicbot;

    musicbot.searcher = new YTSearcher(musicbot.youtubeKey);
    musicbot.changeKey = (key) => {
      return new Promise((resolve, reject) => {
        if (!key || typeof key !== "string") reject("key must be a string");
        musicbot.youtubeKey = key;
        musicbot.searcher.key = key;
        resolve(musicbot);
      });
    };

    client.on("ready", () => {
      console.log(`------- Music Bot -------\n> Version: ${PACKAGE.version}\n> Extra Logging: ${musicbot.logging}.\n> Node.js Version: ${process.version}\n------- Music Bot -------`);
      if (musicbot.cooldown.exclude.includes("skip")) console.warn(`[MUSIC] Excluding SKIP CMD from cooldowns can cause issues.`);
      if (musicbot.cooldown.exclude.includes("play")) console.warn(`[MUSIC] Excluding PLAY CMD from cooldowns can cause issues.`);
      if (musicbot.cooldown.exclude.includes("remove")) console.warn(`[MUSIC] Excluding REMOVE CMD from cooldowns can cause issues.`);
      if (musicbot.cooldown.exclude.includes("search")) console.warn(`[MUSIC] Excluding SEARCH CMD from cooldowns can cause issues.`);
      setTimeout(() => { if (musicbot.musicPresence == true && musicbot.client.guilds.length > 1) console.warn(`[MUSIC] MusicPresence is enabled with more than one server!`); }, 2000);
    });

    client.on("message", (msg) => {
      const message = msg.content.trim();
      const prefix = typeof musicbot.botPrefix == "object" ? (musicbot.botPrefix.has(msg.guild.id) ? musicbot.botPrefix.get(msg.guild.id).prefix : musicbot.defaultPrefix) : musicbot.botPrefix;
      const command = message.substring(prefix.length).split(/[ \n]/)[0].trim();
      const suffix = message.substring(prefix.length + command.length).trim();
      const args = message.slice(prefix.length + command.length).trim().split(/ +/g);

      if (message.startsWith(prefix) && !msg.author.bot && msg.channel.type == "text") {
        if (musicbot.commands.has(command)) {
          let tCmd = musicbot.commands.get(command);
          if (tCmd.enabled) {
            if (!musicbot.cooldown.enabled == true && !musicbot.cooldown.exclude.includes(tCmd.masked)) {
              if (musicbot.recentTalk.has(msg.author.id)) {
                if (musicbot.cooldown.enabled == true && !musicbot.cooldown.exclude.includes(tCmd.masked)) return msg.channel.send(musicbot.note("fail", "You must wait to use music commands again."));
              }
              musicbot.recentTalk.add(msg.author.id);
              setTimeout(() => { musicbot.recentTalk.delete(msg.author.id) }, musicbot.cooldown.timer);
            }
            return musicbot[tCmd.run](msg, suffix, args);
          }
        } else if (musicbot.aliases.has(command)) {
          let aCmd = musicbot.aliases.get(command);
          if (aCmd.enabled) {
            if (musicbot.recentTalk.has(msg.author.id)) {
              if (musicbot.cooldown.enabled == true && !musicbot.cooldown.exclude.includes(aCmd.masked)) return msg.channel.send(musicbot.note("fail", "You must wait to use music commands again."));
            }
            if (!musicbot.cooldown.enabled == true && !musicbot.cooldown.exclude.includes(aCmd.masked)) {
              musicbot.recentTalk.add(msg.author.id);
              setTimeout(() => { musicbot.recentTalk.delete(msg.author.id) }, musicbot.cooldown.timer);
            }
            return musicbot[aCmd.run](msg, suffix, args);
          }
        };
      };
    });
	musicbot.joinFunction = (msg) =>{
		new Promise((resolve, reject) => {
		          const voiceConnection2 = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
          if (voiceConnection2 === null) {
            if (msg.member.voiceChannel && msg.member.voiceChannel.joinable) {
              msg.member.voiceChannel.join()
                .then(connection => {
				msg.channel.send(musicbot.note('note', '보이스채널에 참가하였습니다.'));
                  resolve(connection);

                })
                .catch((error) => {
                  console.log(error);
                });
            } else if (!msg.member.voiceChannel.joinable) {
              msg.channel.send(musicbot.note('fail', '보이스채널에 접속할 수 있는 권한이 없습니다.'))
              reject();
            } else {
              musicbot.emptyQueue(msg.guild.id).then(() => {
                reject();
              })
            }
          } else {
            resolve(voiceConnection2);

          }
	})
	}
    musicbot.playFunction = (msg, suffix, args) => {
      if (msg.member.voiceChannel === undefined) return msg.channel.send(musicbot.note('fail', `먼저 보이스채널에 들어가주세요!`));
      if (!suffix) return msg.channel.send(musicbot.note('fail', '영상 제목 또는 링크를 입력해주세요! 예시: '));
      let q = musicbot.getQueue(msg.guild.id)
      if (q.songs.length >= musicbot.maxQueueSize && musicbot.maxQueueSize !== 0) return msg.channel.send(musicbot.note('fail', '큐가 가득 찼습니다!'));
      var searchstring = suffix.trim();
      if (searchstring.includes("https://youtu.be/") || searchstring.includes("https://www.youtube.com/") && searchstring.includes("&")) searchstring = searchstring.split("&")[0];


      if (searchstring.startsWith('http') && searchstring.includes("list=")) {
        msg.channel.send(musicbot.note("search", `플레이리스트의 노래들을 확인중입니다.`));
        var playid = searchstring.toString()
        .split('list=')[1];
        if (playid.toString()
        .includes('?')) playid = playid.split('?')[0];
        if (playid.toString()
        .includes('&t=')) playid = playid.split('&t=')[0];

        ytpl(playid, function(err, playlist) {
          if(err) return msg.channel.send(musicbot.note('fail', `플레이리스트를 확인하는중 오류가 발생했습니다.!`));
          if (playlist.items.length <= 0) return msg.channel.send(musicbot.note('fail', `플레이리스트에서 영상을 찾지 못했습니다.`));
          var index = 0;
          var ran = 0;
          const queue = musicbot.getQueue(msg.guild.id);

          playlist.items.forEach(video => {
            ran++;
            if (queue.songs.length == (musicbot.maxQueueSize + 1) && musicbot.maxQueueSize !== 0 || !video) return;
            video.url = `https://www.youtube.com/watch?v=` + video.id;
            video.channelTitle = video.author.name;
            video.channelURL = video.author.ref;
            video.requester = msg.author.id;
            video.position = musicbot.queues.get(msg.guild.id).songs ? musicbot.queues.get(msg.guild.id).songs.length : 0;
            video.queuedOn = new Date().toLocaleDateString(musicbot.dateLocal, { weekday: 'long', hour: 'numeric' });
            video.requesterAvatarURL = msg.author.displayAvatarURL;
            queue.songs.push(video);
            if (queue.songs.length === 1) musicbot.executeQueue(msg, queue);
            index++;

            if (ran >= playlist.items.length) {
              if (index == 0) msg.channel.send(musicbot.note('fail', `플레이리스트에서 영상을 찾지 못했습니다!`))
              else if (index == 1) msg.channel.send(musicbot.note('note', `노래를 추가했습니다..`));
              else if (index > 1) msg.channel.send(musicbot.note('note', `Queued ${index} songs.`));
            }
          });
        });
      } else {
        msg.channel.send(musicbot.note("search", `\`Searching: ${searchstring}\`~`));
        new Promise(async (resolve, reject) => {
          let result = await musicbot.searcher.search(searchstring, { type: 'video' });
          resolve(result.first)
        }).then((res) => {
          if (!res) return msg.channel.send(musicbot.note("fail", "문제가 발생하였습니다. 다시 시도해주세요!"));
          res.requester = msg.author.id;
          res.channelURL = `https://www.youtube.com/channel/${res.channelId}`;
          res.queuedOn = new Date().toLocaleDateString(musicbot.dateLocal, { weekday: 'long', hour: 'numeric' });
          if (musicbot.requesterName) res.requesterAvatarURL = msg.author.displayAvatarURL;
          const queue = musicbot.getQueue(msg.guild.id)
          res.position = queue.songs.length ? queue.songs.length : 0;
          queue.songs.push(res);

          if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
            const embed = new Discord.RichEmbed();
            try {
              embed.setAuthor('큐에 추가되었습니다', client.user.avatarURL);
              var songTitle = res.title.replace(/\\/g, '\\\\')
              .replace(/\`/g, '\\`')
              .replace(/\*/g, '\\*')
              .replace(/_/g, '\\_')
              .replace(/~/g, '\\~')
              .replace(/`/g, '\\`');
              embed.setColor(musicbot.embedColor);
              embed.addField(res.channelTitle, `[${songTitle}](${res.url})`, musicbot.inlineEmbeds);
              embed.addField("추가된 시간:", res.queuedOn, musicbot.inlineEmbeds);
              if (!musicbot.bigPicture) embed.setThumbnail(`https://img.youtube.com/vi/${res.id}/maxresdefault.jpg`);
              if (musicbot.bigPicture) embed.setImage(`https://img.youtube.com/vi/${res.id}/maxresdefault.jpg`);
              const resMem = client.users.get(res.requester);
              if (musicbot.requesterName && resMem) embed.setFooter(`Requested by ${client.users.get(res.requester).username}`, res.requesterAvatarURL);
              if (musicbot.requesterName && !resMem) embed.setFooter(`Requested by \`UnknownUser (ID: ${res.requester})\``, res.requesterAvatarURL);
              msg.channel.send({
                embed
              });
            } catch (e) {
              console.error(`[${msg.guild.name}] [playCmd] ` + e.stack);
            };
          } else {
            try {
              var songTitle = res.title.replace(/\\/g, '\\\\')
              .replace(/\`/g, '\\`')
              .replace(/\*/g, '\\*')
              .replace(/_/g, '\\_')
              .replace(/~/g, '\\~')
              .replace(/`/g, '\\`');
              msg.channel.send(`재생중: **${songTitle}**\nRequested By: ${client.users.get(res.requester).username}\n추가된 시간: ${res.queuedOn}`)
            } catch (e) {
              console.error(`[${msg.guild.name}] [npCmd] ` + e.stack);
            };
          };
          if (queue.songs.length === 1 || !client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id)) musicbot.executeQueue(msg, queue);
        }).catch((res) => {
          console.log(new Error(res));
        });
      };
    };

    musicbot.helpFunction = (msg, suffix, args) => {
      let command = suffix.trim();
      if (!suffix) {
        if (msg.channel.permissionsFor(msg.guild.me)
          .has('EMBED_LINKS')) {
          const embed = new Discord.RichEmbed();
          embed.setAuthor("Commands", msg.author.displayAvatarURL);
          embed.setDescription(` \`${musicbot.botPrefix}${musicbot.help.name} 명령어이름\` 을 입력해서 명령어를 사용할 수 있습니다. (예시: ^검색). \`${musicbot.djRole}\`(역할) 는 모든 명령어를 자유롭게 사용할 수 있습니다.`);
          // embed.addField(musicbot.helpCmd, musicbot.helpHelp);
          const newCmds = Array.from(musicbot.commands);
          let index = 0;
          let max = musicbot.commandsArray.length;
          embed.setColor(musicbot.embedColor);
          for (var i = 0; i < musicbot.commandsArray.length; i++) {
            if (!musicbot.commandsArray[i].exclude) embed.addField(musicbot.commandsArray[i].name, musicbot.commandsArray[i].help);
            index++;
            if (index == max) {
              if (musicbot.messageHelp) {
                let sent = false;
                msg.author.send({
                    embed
                  })
                  .then(() => {
                    sent = true;
                  });
                setTimeout(() => {
                  if (!sent) return msg.channel.send({
                    embed
                  });
                }, 1200);
              } else {
                return msg.channel.send({
                  embed
                });
              };
            }
          };
        } else {
          var cmdmsg = `= Music Commands =\nUse ${musicbot.botPrefix}${musicbot.help.name} [command] for help on a command. Anyone with a role named \`${musicbot.djRole}\` can use any command.\n`;
          let index = 0;
          let max = musicbot.commandsArray.length;
          for (var i = 0; i < musicbot.commandsArray.length; i++) {
            if (!musicbot.commandsArray[i].disabled || !musicbot.commandsArray[i].exclude) {
              cmdmsg = cmdmsg + `\n• ${musicbot.commandsArray[i].name}: ${musicbot.commandsArray[i].help}`;
              index++;
              if (index == musicbot.commandsArray.length) {
                if (musicbot.messageHelp) {
                  let sent = false;
                  msg.author.send(cmdmsg, {
                      code: 'asciidoc'
                    })
                    .then(() => {
                      sent = true;
                    });
                  setTimeout(() => {
                    if (!sent) return msg.channel.send(cmdmsg, {
                      code: 'asciidoc'
                    });
                  }, 500);
                } else {
                  return msg.channel.send(cmdmsg, {
                    code: 'asciidoc'
                  });
                };
              }
            };
          };
        };
      } else if (musicbot.commands.has(command) || musicbot.aliases.has(command)) {
        if (msg.channel.permissionsFor(msg.guild.me)
          .has('EMBED_LINKS')) {
          const embed = new Discord.RichEmbed();
          command = musicbot.commands.get(command) || musicbot.aliases.get(command);
          if (command.exclude) return msg.channel.send(musicbot.note('fail', `${suffix} 은 알 수 없는 명령어입니다!`));
          embed.setAuthor(command.name, msg.client.user.avatarURL);
          embed.setDescription(command.help);
          if (command.alt.length > 0) embed.addField(`Aliases`, command.alt.join(", "), musicbot.inlineEmbeds);
          if (command.usage && typeof command.usage == "string") embed.addFieldd(`Usage`, command.usage.replace(/{{prefix}})/g, musicbot.botPrefix), musicbot.inlineEmbeds);
          embed.setColor(musicbot.embedColor);
          msg.channel.send({
            embed
          });
        } else {
          command = musicbot.commands.get(command) || musicbot.aliases.get(command);
          if (command.exclude) return msg.channel.send(musicbot.note('fail', `${suffix} 은 알 수 없는 명령어입니다!`));
          var cmdhelp = `= ${command.name} =\n`;
          cmdhelp + `\n${command.help}`;
          if (command.usage !== null) cmdhelp = cmdhelp + `\nUsage: ${command.usage.replace(/{{prefix}})/g, musicbot.botPrefix)}`;
          if (command.alt.length > 0) cmdhelp = cmdhelp + `\nAliases: ${command.alt.join(", ")}`;
          msg.channel.send(cmdhelp, {
            code: 'asciidoc'
          });
        };
      } else {
        msg.channel.send(musicbot.note('fail', `${suffix} 은 알 수 없는 명령어입니다!`));
      };
    };

    musicbot.skipFunction = (msg, suffix, args) => {
      const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
      if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', '재생중인 노래가 없습니다.'));
      const queue = musicbot.getQueue(msg.guild.id);
      if (!musicbot.canSkip(msg.member, queue)) return msg.channel.send(musicbot.note('fail', `당신은 스킵할 수 없습니다.`));

      if (musicbot.queues.get(msg.guild.id).loop == "song") return msg.channel.send(musicbot.note("fail", "단독 반복재생상태에선 스킵할 수 없습니다."));

      const dispatcher = voiceConnection.player.dispatcher;
      if (!dispatcher || dispatcher === null) {
        if (musicbot.logging) return console.log(new Error(`dispatcher null on skip cmd [${msg.guild.name}] [${msg.author.username}]`));
        return msg.channel.send(musicbot.note("fail", "노래를 스킵하는도중 문제가 발생하였습니다."));
      };
      if (voiceConnection.paused) dispatcher.end();
      dispatcher.end();
      msg.channel.send(musicbot.note("note", "노래를 건너뛰었습니다."));
    };

    musicbot.pauseFunction = (msg, suffix, args) => {
      const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
      if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', '재생중인 노래가 없습니다.'));
      if (!musicbot.isAdmin(msg.member) && !musicbot.anyoneCanPause) return msg.channel.send(musicbot.note('fail', '당신은 큐를 정지시킬 수 없습니다.'));

      const dispatcher = voiceConnection.player.dispatcher;
	  try{
      if (dispatcher.paused) return msg.channel.send(musicbot.note(`fail`, `이미 노래가 정지되어있습니다!`))
      else dispatcher.pause();
	  }catch(e)
	  {
		  console.log(e);
	  }
      msg.channel.send(musicbot.note('note', '노래가 일시정지되었습니다.'));
    };

    musicbot.resumeFunction = (msg, suffix, args) => {
      const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
      if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', '재생중인 노래가 없습니다.'));
      if (!musicbot.isAdmin(msg.member) && !musicbot.anyoneCanPause) return msg.channel.send(musicbot.note('fail', `당신은 큐를 다시 재생할 수 없습니다.`));

      const dispatcher = voiceConnection.player.dispatcher;
      if (!dispatcher.paused) return msg.channel.send(musicbot.note('fail', `이미 재생중입니다.`))
      else dispatcher.resume();
      msg.channel.send(musicbot.note('note', '노래가 다시 재생됩니다.'));
    };

    musicbot.leaveFunction = (msg, suffix) => {
      if (musicbot.isAdmin(msg.member) || musicbot.anyoneCanLeave === true) {
        const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
        if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', '보이스채널에 들어와있지 않습니다.'));
		console.log("대기");
		//if(musicbot.getQueue(msg.guild.id, true) !=){
        musicbot.emptyQueue(msg.guild.id);
		//}
		console.log("완료");
        if (!(!voiceConnection.player.dispatcher)){
        voiceConnection.player.dispatcher.end();
		}
        voiceConnection.disconnect();
        msg.channel.send(musicbot.note('note', '성공적으로 보이스채널에서 퇴장하였습니다.'));
      } else {
        const chance = Math.floor((Math.random() * 100) + 1);
        if (chance <= 10) return msg.channel.send(musicbot.note('fail', `I'm afraid I can't let you do that, ${msg.author.username}.`))
        else return msg.channel.send(musicbot.note('fail', 'Sorry, you\'re not allowed to do that.'));
      }
    }

    musicbot.npFunction = (msg, suffix, args) => {
      const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
      const queue = musicbot.getQueue(msg.guild.id, true);
      if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', '재생중인 노래가 없습니다.'));
      const dispatcher = voiceConnection.player.dispatcher;

      if (musicbot.queues.get(msg.guild.id).songs.length <= 0) return msg.channel.send(musicbot.note('note', '큐가 비어있습니다.'));

      if (msg.channel.permissionsFor(msg.guild.me)
        .has('EMBED_LINKS')) {
        const embed = new Discord.RichEmbed();
        try {
          embed.setAuthor('현재 재생중인 노래의 정보입니다.', client.user.avatarURL);
          var songTitle = queue.last.title.replace(/\\/g, '\\\\')
            .replace(/\`/g, '\\`')
            .replace(/\*/g, '\\*')
            .replace(/_/g, '\\_')
            .replace(/~/g, '\\~')
            .replace(/`/g, '\\`');
          embed.setColor(musicbot.embedColor);
          embed.addField(queue.last.channelTitle, `[${songTitle}](${queue.last.url})`, musicbot.inlineEmbeds);
          embed.addField("추가된 시간:", queue.last.queuedOn, musicbot.inlineEmbeds);
          if (!musicbot.bigPicture) embed.setThumbnail(`https://img.youtube.com/vi/${queue.last.id}/maxresdefault.jpg`);
          if (musicbot.bigPicture) embed.setImage(`https://img.youtube.com/vi/${queue.last.id}/maxresdefault.jpg`);
          const resMem = client.users.get(queue.last.requester);
          if (musicbot.requesterName && resMem) embed.setFooter(`Requested by ${client.users.get(queue.last.requester).username}`, queue.last.requesterAvatarURL);
          if (musicbot.requesterName && !resMem) embed.setFooter(`Requested by \`UnknownUser (ID: ${queue.last.requester})\``, queue.last.requesterAvatarURL);
          msg.channel.send({
            embed
          });
        } catch (e) {
          console.error(`[${msg.guild.name}] [npCmd] ` + e.stack);
        };
      } else {
        try {
          var songTitle = queue.last.title.replace(/\\/g, '\\\\')
            .replace(/\`/g, '\\`')
            .replace(/\*/g, '\\*')
            .replace(/_/g, '\\_')
            .replace(/~/g, '\\~')
            .replace(/`/g, '\\`');
          msg.channel.send(`재생중: **${songTitle}**\nRequested By: ${client.users.get(queue.last.requester).username}\n추가된 시간: ${queue.last.queuedOn}`)
        } catch (e) {
          console.error(`[${msg.guild.name}] [npCmd] ` + e.stack);
        };
      }
    };

    musicbot.queueFunction = (msg, suffix, args) => {
      if (!musicbot.queues.has(msg.guild.id)) return msg.channel.send(musicbot.note("fail", "이 서버엔 아직 큐가 없습니다!"));
      else if (musicbot.queues.get(msg.guild.id).songs.length <= 0) return msg.channel.send(musicbot.note("fail", "큐가 비어있어요."));
      const queue = musicbot.queues.get(msg.guild.id);
      if (suffix) {
        let video = queue.songs.find(s => s.position == parseInt(suffix) - 1);
        if (!video) return msg.channel.send(musicbot.note("fail", "해당 영상을 찾지 못했어요!"));
        const embed = new Discord.RichEmbed()
        .setAuthor('Queued Song', client.user.avatarURL)
        .setColor(musicbot.embedColor)
        .addField(video.channelTitle, `[${video.title.replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\*/g, '\\*').replace(/_/g, '\\_').replace(/~/g, '\\~').replace(/`/g, '\\`')}](${video.url})`, musicbot.inlineEmbeds)
        .addField("Queued On", video.queuedOn, musicbot.inlineEmbeds)
        .addField("Position", video.position + 1, musicbot.inlineEmbeds);
        if (!musicbot.bigPicture) embed.setThumbnail(`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`);
        if (musicbot.bigPicture) embed.setImage(`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`);
        const resMem = client.users.get(video.requester);
        if (musicbot.requesterName && resMem) embed.setFooter(`Requested by ${client.users.get(video.requester).username}`, video.requesterAvatarURL);
        if (musicbot.requesterName && !resMem) embed.setFooter(`Requested by \`UnknownUser (ID: ${video.requester})\``, video.requesterAvatarURL);
        msg.channel.send({embed});
      } else {
        if (queue.songs.length > 11) {
          let pages = [];
          let page = 1;
          const newSongs = queue.songs.musicArraySort(10);
          newSongs.forEach(s => {
            var i = s.map((video, index) => (
              `**${video.position + 1}:** __${video.title.replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\*/g, '\\*').replace(/_/g, '\\_').replace(/~/g, '\\~').replace(/`/g, '\\`')}__`
            )).join('\n\n');
            if (i !== undefined) pages.push(i)
          });

          const embed = new Discord.RichEmbed();
          embed.setAuthor('Queued Songs', client.user.avatarURL);
          embed.setColor(musicbot.embedColor);
          embed.setFooter(`Page ${page} of ${pages.length}`);
          embed.setDescription(pages[page - 1]);
          msg.channel.send(embed).then(m => {
            m.react('⏪').then( r => {
              m.react('⏩')
              let forwardsFilter = m.createReactionCollector((reaction, user) => reaction.emoji.name === '⏩' && user.id === msg.author.id, { time: 120000 });
              let backFilter = m.createReactionCollector((reaction, user) => reaction.emoji.name === '⏪' && user.id === msg.author.id, { time: 120000 });

              forwardsFilter.on('collect', r => {
                if (page === pages.length) return;
                page++;
                embed.setDescription(pages[page - 1]);
                embed.setFooter(`Page ${page} of ${pages.length}`, msg.author.displayAvatarURL);
                m.edit(embed);
              })
              backFilter.on('collect', r => {
                if (page === 1) return;
                page--;
                embed.setDescription(pages[page - 1]);
                embed.setFooter(`Page ${page} of ${pages.length}`);
                m.edit(embed);
              })
            })
          })
        } else {
          var newSongs = musicbot.queues.get(msg.guild.id).songs.map((video, index) => (`**${video.position + 1}:** __${video.title.replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\*/g, '\\*').replace(/_/g, '\\_').replace(/~/g, '\\~').replace(/`/g, '\\`')}__`)).join('\n\n');
          const embed = new Discord.RichEmbed();
          embed.setAuthor('추가된 노래들', client.user.avatarURL);
          embed.setColor(musicbot.embedColor);
          embed.setDescription(newSongs);
          embed.setFooter(`Page 1 of 1`, msg.author.displayAvatarURL);
          return msg.channel.send(embed);
        };
      };
    };

    musicbot.searchFunction = (msg, suffix, args) => {
      if (msg.member.voiceChannel === undefined) return msg.channel.send(musicbot.note('fail', `보이스채널에 들어와있지 않습니다.'`));
      if (!suffix) return msg.channel.send(musicbot.note('fail', '영상제목을 입력해주세요!'));
      const queue = musicbot.getQueue(msg.guild.id);
      if (queue.songs.length >= musicbot.maxQueueSize && musicbot.maxQueueSize !== 0) return msg.channel.send(musicbot.note('fail', '큐가 모두 찼습니다!'));
	  var searchstringg = suffix.trim();
 if ((searchstringg.startsWith('http') && searchstringg.includes("list=")) || searchstringg.includes("https://youtu.be/") || searchstringg.includes("https://www.youtube.com/") && searchstringg.includes("&")) return musicbot.playFunction(msg, suffix, args);
      let searchstring = suffix.trim();
      msg.channel.send(musicbot.note('search', `Searching: \`${searchstring}\``))
        .then(response => {
          musicbot.searcher.search(searchstring, {
              type: 'video'
            })
            .then(searchResult => {
              if (!searchResult.totalResults || searchResult.totalResults === 0) return response.edit(musicbot.note('fail', '검색 결과를 가져오지 못했습니다.'));

              const startTheFun = async (videos, max) => {
                if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
                  const embed = new Discord.RichEmbed();
                  embed.setTitle(`영상을 선택하세요. 취소하려면 c를 입력하세요.`);
                  embed.setColor(musicbot.embedColor);
                  var index = 0;
                  videos.forEach(function(video) {
                    index++;
                    embed.addField(`${index} (${video.channelTitle})`, `[${musicbot.note('font', video.title)}](${video.url})`, musicbot.inlineEmbeds);

                  });
				  //embed.addField(`취소하기`,'c');
                  embed.setFooter(`Search by: ${msg.author.username}`, msg.author.displayAvatarURL);
                  msg.channel.send({
                    embed
                  })
                  .then(firstMsg => {
                    var filter = null;
                    //console.log(musicbot.botPrefix);
                    if (max === 0) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.trim() === (`cancel`) ||
                      m.content.trim().indexOf(musicbot.botPrefix+"p") ==0 ||
                      m.content.trim() === (`c`);
                    } else if (max === 1) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.trim() === (`cancel`) ||
                      m.content.trim().indexOf(musicbot.botPrefix+"p") ==0 ||
                      m.content.trim() === (`c`);
                    } else if (max === 2) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.trim() === (`cancel`) ||
                      m.content.trim().indexOf(musicbot.botPrefix+"p") ==0 ||
                      m.content.trim() === (`c`);
                    } else if (max === 3) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.trim() === (`cancel`) ||
                      m.content.trim().indexOf(musicbot.botPrefix+"p") ==0 ||
                      m.content.trim() === (`c`);
                    } else if (max === 4) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.trim() === (`cancel`) ||
                      m.content.trim().indexOf(musicbot.botPrefix+"p") ==0 ||
                      m.content.trim() === (`c`);
                    } else if (max === 5) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.includes('6') ||
                      m.content.trim() === (`cancel`) ||
                      m.content.trim().indexOf(musicbot.botPrefix+"p") ==0 ||
                      m.content.trim() === (`c`);
                    } else if (max === 6) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.includes('6') ||
                      m.content.includes('7') ||
                      m.content.trim() === (`cancel`) ||
                      m.content.trim().indexOf(musicbot.botPrefix+"p") ==0 ||
                      m.content.trim() === (`c`);
                    } else if (max === 7) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.includes('6') ||
                      m.content.includes('7') ||
                      m.content.includes('8') ||
                      m.content.trim() === (`cancel`) ||
                      m.content.trim().indexOf(musicbot.botPrefix+"p") ==0 ||
                      m.content.trim() === (`c`);
                    } else if (max === 8) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.includes('6') ||
                      m.content.includes('7') ||
                      m.content.includes('8') ||
                      m.content.includes('9') ||
                      m.content.trim() === (`cancel`) ||
                      m.content.trim().indexOf(musicbot.botPrefix+"p") ==0 ||
                      m.content.trim() === (`c`);
                    } else if (max === 9) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.includes('6') ||
                      m.content.includes('7') ||
                      m.content.includes('8') ||
                      m.content.includes('9') ||
                      m.content.includes('10') ||
                      m.content.trim() === (`cancel`) ||
                      m.content.trim().indexOf(musicbot.botPrefix+"p") ==0 ||
                      m.content.trim() === (`c`);
                    }
                    msg.channel.awaitMessages(filter, {
                      max: 1,
                      time: 30000,
                      errors: ['time']
                    })
                    .then(collected => {
                      const newColl = Array.from(collected);
                      const mcon = newColl[0][1].content;

                      if (mcon == "cancel") {
                        firstMsg.delete();
                        return msg.reply(musicbot.note('note', '검색이 취소되었습니다.'));
                    }
                    if (mcon == "c") {
                      firstMsg.delete();
                      return msg.reply(musicbot.note('note', '검색이 취소되었습니다.'));
                  }
                    if (mcon.trim().indexOf("^p") == 0) {
                      firstMsg.delete();
                      return msg.reply(musicbot.note('note', '검색이 취소되었습니다.'));
                  }
                      const song_number = parseInt(mcon) - 1;
                      if (song_number >= 0) {
                        firstMsg.delete();

                        videos[song_number].requester == msg.author.id;
                        videos[song_number].position = queue.songs.length ? queue.songs.length : 0;
                        var embed = new Discord.RichEmbed();
                        embed.setAuthor('큐에 추가되었습니다.', client.user.avatarURL);
                        var songTitle = videos[song_number].title.replace(/\\/g, '\\\\')
                        .replace(/\`/g, '\\`')
                        .replace(/\*/g, '\\*')
                        .replace(/_/g, '\\_')
                        .replace(/~/g, '\\~')
                        .replace(/`/g, '\\`');
                        embed.setColor(musicbot.embedColor);
                        embed.addField(videos[song_number].channelTitle, `[${songTitle}](${videos[song_number].url})`, musicbot.inlineEmbeds);
                        embed.addField("추가된 시간:", videos[song_number].queuedOn, musicbot.inlineEmbeds);
                        if (!musicbot.bigPicture) embed.setThumbnail(`https://img.youtube.com/vi/${videos[song_number].id}/maxresdefault.jpg`);
                        if (musicbot.bigPicture) embed.setImage(`https://img.youtube.com/vi/${videos[song_number].id}/maxresdefault.jpg`);
                        const resMem = client.users.get(videos[song_number].requester);
                        if (musicbot.requesterName && resMem) embed.setFooter(`Requested by ${client.users.get(videos[song_number].requester).username}`, videos[song_number].requesterAvatarURL);
                        if (musicbot.requesterName && !resMem) embed.setFooter(`Requested by \`UnknownUser (ID: ${videos[song_number].requester})\``, videos[song_number].requesterAvatarURL);
                        msg.channel.send({
                          embed
                        }).then(() => {
                          queue.songs.push(videos[song_number]);
                          if (queue.songs.length === 1 || !client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id)) musicbot.executeQueue(msg, queue, true);
                        })
                        .catch(console.log);
                      };
                    })
                    .catch(collected => {
                      if (collected.toString()
                      .match(/error|Error|TypeError|RangeError|Uncaught/)) return firstMsg.edit(`\`\`\`xl\nSearching canceled. ${collected}\n\`\`\``);
                      //return firstMsg.edit(`\`\`\`xl\n검색이 취소되었습니다.\n\`\`\``);
					  firstMsg.delete();
					  msg.reply("검색 시간이 초과되었습니다.");
                    });
                  })
                } else {
                  const vids = videos.map((video, index) => (
                    `**${index + 1}:** __${video.title.replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\*/g, '\\*').replace(/_/g, '\\_').replace(/~/g, '\\~').replace(/`/g, '\\`')}__`
                  )).join('\n\n');
                  msg.channel.send(`\`\`\`\n= 영상을 선택하세요 =\n${vids}\n\n= 이 명령어로 취소할 수 있습니다: =`).then(firstMsg => {
                    var filter = null;
                    if (max === 0) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.trim() === (`cancel`);
                    } else if (max === 1) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.trim() === (`cancel`);
                    } else if (max === 2) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.trim() === (`cancel`);
                    } else if (max === 3) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.trim() === (`cancel`);
                    } else if (max === 4) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.trim() === (`cancel`);
                    } else if (max === 5) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.includes('6') ||
                      m.content.trim() === (`cancel`);
                    } else if (max === 6) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.includes('6') ||
                      m.content.includes('7') ||
                      m.content.trim() === (`cancel`);
                    } else if (max === 7) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.includes('6') ||
                      m.content.includes('7') ||
                      m.content.includes('8') ||
                      m.content.trim() === (`cancel`);
                    } else if (max === 8) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.includes('6') ||
                      m.content.includes('7') ||
                      m.content.includes('8') ||
                      m.content.includes('9') ||
                      m.content.trim() === (`cancel`);
                    } else if (max === 9) {
                      filter = m => m.author.id === msg.author.id &&
                      m.content.includes('1') ||
                      m.content.includes('2') ||
                      m.content.includes('3') ||
                      m.content.includes('4') ||
                      m.content.includes('5') ||
                      m.content.includes('6') ||
                      m.content.includes('7') ||
                      m.content.includes('8') ||
                      m.content.includes('9') ||
                      m.content.includes('10') ||
                      m.content.trim() === (`cancel`);
                    }
                    msg.channel.awaitMessages(filter, {
                      max: 1,
                      time: 60000,
                      errors: ['time']
                    })
                    .then(collected => {
                      const newColl = Array.from(collected);
                      const mcon = newColl[0][1].content;

                      if (mcon === "cancel") return firstMsg.edit(musicbot.note('note', 'Searching canceled.'));
                      const song_number = parseInt(mcon) - 1;
                      if (song_number >= 0) {
                        firstMsg.delete();

                        videos[song_number].requester == msg.author.id;
                        videos[song_number].position = queue.songs.length ? queue.songs.length : 0;
                        var embed = new Discord.RichEmbed();
                        embed.setAuthor('큐에 추가되었습니다', client.user.avatarURL);
                        var songTitle = videos[song_number].title.replace(/\\/g, '\\\\')
                        .replace(/\`/g, '\\`')
                        .replace(/\*/g, '\\*')
                        .replace(/_/g, '\\_')
                        .replace(/~/g, '\\~')
                        .replace(/`/g, '\\`');
                        embed.setColor(musicbot.embedColor);
                        embed.addField(videos[song_number].channelTitle, `[${songTitle}](${videos[song_number].url})`, musicbot.inlineEmbeds);
                        embed.addField("추가된 시간:", videos[song_number].queuedOn, musicbot.inlineEmbeds);
                        if (!musicbot.bigPicture) embed.setThumbnail(`https://img.youtube.com/vi/${videos[song_number].id}/maxresdefault.jpg`);
                        if (musicbot.bigPicture) embed.setImage(`https://img.youtube.com/vi/${videos[song_number].id}/maxresdefault.jpg`);
                        const resMem = client.users.get(videos[song_number].requester);
                        if (musicbot.requesterName && resMem) embed.setFooter(`Requested by ${client.users.get(videos[song_number].requester).username}`, videos[song_number].requesterAvatarURL);
                        if (musicbot.requesterName && !resMem) embed.setFooter(`Requested by \`UnknownUser (ID: ${videos[song_number].requester})\``, videos[song_number].requesterAvatarURL);
                        msg.channel.send({
                          embed
                        }).then(() => {
                          queue.songs.push(videos[song_number]);
                          if (queue.songs.length === 1 || !client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id)) musicbot.executeQueue(msg, queue);
                        })
                        .catch(console.log);
                      };
                    })
                    .catch(collected => {
                      if (collected.toString()
                      .match(/error|Error|TypeError|RangeError|Uncaught/)) return firstMsg.edit(`\`\`\`xl\nSearching canceled. ${collected}\n\`\`\``);
                      return firstMsg.edit(`\`\`\`xl\nSearching canceled.\n\`\`\``);
                    });
                  })
                }
              };

              const max = searchResult.totalResults >= 10 ? 9 : searchResult.totalResults - 1;
              var videos = [];
              for (var i = 0; i < 99; i++) {
                var result = searchResult.currentPage[i];
                result.requester = msg.author.id;
                if (musicbot.requesterName) result.requesterAvatarURL = msg.author.displayAvatarURL;
                result.channelURL = `https://www.youtube.com/channel/${result.channelId}`;
                result.queuedOn = new Date().toLocaleDateString(musicbot.dateLocal, { weekday: 'long', hour: 'numeric' });
                videos.push(result);
                if (i === max) {
                  i = 101;
                  startTheFun(videos, max);
                }
              };
            });
        })
        .catch(console.log);
    };

    musicbot.volumeFunction = (msg, suffix, args) => {
      const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
      if (voiceConnection === null) return msg.channel.send(musicbot.note('fail', '재생중인 노래가 없습니다.'));
      if (!musicbot.canAdjust(msg.member, musicbot.queues.get(msg.guild.id))) return msg.channel.send(musicbot.note('fail', `관리자 또는 DJ만 볼륨을 변경할 수 있습니다.`));
      const dispatcher = voiceConnection.player.dispatcher;

      if (!suffix) return msg.channel.send(musicbot.note('fail', '명령어 뒤에 설정할 볼륨을 입력해주세요.'));
      suffix = parseInt(suffix);
      if (suffix > 200 || suffix <= 0) return msg.channel.send(musicbot.note('fail', '볼륨이 범위를 벗어났습니다. 볼륨은 1부터 200사이여야합니다. '));

      dispatcher.setVolume((suffix / 100));
      musicbot.queues.get(msg.guild.id).volume = suffix;
      msg.channel.send(musicbot.note('note', `볼륨이 ${suffix}% 으로 변경되었습니다.`));
    };

    musicbot.clearFunction = (msg, suffix, args) => {
      if (!musicbot.queues.has(msg.guild.id)) return msg.channel.send(musicbot.note("fail", "현재 서버에서 큐를 찾을 수 없습니다."));
      if (!musicbot.isAdmin(msg.member)) return msg.channel.send(musicbot.note("fail", `오직 관리자나  ${musicbot.djRole} 만 큐를 초기화 할 수 있습니다.`));
      musicbot.emptyQueue(msg.guild.id).then(res => {
        msg.channel.send(musicbot.note("note", "큐가 초기화 되었습니다."));
        const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
        if (voiceConnection !== null) {
          const dispatcher = voiceConnection.player.dispatcher;
          if (!dispatcher || dispatcher === null) {
            if (musicbot.logging) return console.log(new Error(`dispatcher null on skip cmd [${msg.guild.name}] [${msg.author.username}]`));
            return msg.channel.send(musicbot.note("fail", "오류가 있는 것 같습니다."));
          };
          if (voiceConnection.paused) dispatcher.end();
          dispatcher.end();
        }
      }).catch(res => {
        console.error(new Error(`[clearCmd] [${msg.guild.id}] ${res}`))
        return msg.channel.send(musicbot.note("fail", "큐를 초기화하는도중 오류가 발생하였습니다."));
      })
    };

    musicbot.removeFunction = (msg, suffix, args) => {
      if (!musicbot.queues.has(msg.guild.id)) return msg.channel.send(musicbot.note('fail', `현재 서버에서 큐를 찾을 수 없습니다!`));
      if (!suffix)  return msg.channel.send(musicbot.note("fail", "No video position given."));
      if (parseInt(suffix - 1) == 0) return msg.channel.send(musicbot.note("fail", "You cannot clear the currently playing music."));
      let test = musicbot.queues.get(msg.guild.id).songs.find(x => x.position == parseInt(suffix - 1));
      if (test) {
        if (test.requester !== msg.author.id && !musicbot.isAdmin(msg.member)) return msg.channel.send(musicbot.note("fail", "해당 영상을 삭제할 수 없습니다."));
        let newq = musicbot.queues.get(msg.guild.id).songs.filter(s => s !== test);
        musicbot.updatePositions(newq, msg.guild.id).then(res => {
          musicbot.queues.get(msg.guild.id).songs = res;
          msg.channel.send(musicbot.note("note", `삭제되었습니다:  \`${test.title.replace(/`/g, "'")}\``));
        })
      } else {
        msg.channel.send(musicbot.note("fail", "해당 영상을 찾을 수 없거나 오류가있습니다."));
      }
    };

    musicbot.loopFunction = (msg, suffix, args) => {
      if (!musicbot.queues.has(msg.guild.id)) return msg.channel.send(musicbot.note('fail', `현재 서버에서 큐를 찾을 수 없습니다!`));
      if (musicbot.queues.get(msg.guild.id).loop == "none" || musicbot.queues.get(msg.guild.id).loop == null) {
        musicbot.queues.get(msg.guild.id).loop = "song";
        msg.channel.send(musicbot.note('note', '단독 반복재생이 활성화 되었습니다. :repeat_one:'));
      } else if (musicbot.queues.get(msg.guild.id).loop == "song") {
        musicbot.queues.get(msg.guild.id).loop = "queue";
        msg.channel.send(musicbot.note('note', '전체 반복재생이 활성화 되었습니다. :repeat:'));
      } else if (musicbot.queues.get(msg.guild.id).loop == "queue") {
        musicbot.queues.get(msg.guild.id).loop = "none";
        msg.channel.send(musicbot.note('note', '반복재생이 비활성화 되었습니다! :arrow_forward:'));
        const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
        const dispatcher = voiceConnection.player.dispatcher;
        let wasPaused = dispatcher.paused;
        if (wasPaused) dispatcher.pause();
        let newq = musicbot.queues.get(msg.guild.id).songs.slice(musicbot.queues.get(msg.guild.id).last.position - 1);
        if (newq !== musicbot.queues.get(msg.guild.id).songs) musicbot.updatePositions(newq, msg.guild.id).then(res => { musicbot.queues.get(msg.guild.id).songs = res; })
        if (wasPaused) dispatcher.resume();
      }
    };

    musicbot.loadCommand = (obj) => {
      return new Promise((resolve, reject) => {
        let props = {
          enabled: obj.enabled,
          run: obj.run,
          alt: obj.alt,
          help: obj.help,
          name: obj.name,
          exclude: obj.exclude,
          masked: obj.masked
        };
        if (props.enabled == undefined || null) props.enabled = true;
        if (obj.alt.length > 0) {
          obj.alt.forEach((a) => {
            musicbot.aliases.set(a, props);
          })
        };
        musicbot.commands.set(obj.name, props);
        musicbot.commandsArray.push(props);
        if (musicbot.logging) console.log(`[MUSIC_LOADCMD] Loaded ${obj.name}`);
        resolve(musicbot.commands.get(obj.name));
      });
    }

    musicbot.executeQueue = (msg, queue, isPlay) => {
        if (queue.songs.length <= 0) {
        msg.channel.send(musicbot.note('note', '노래가 모두 재생되었습니다'));
        musicbot.queues.set(msg.guild.id, {songs: [], last: null, loop: "none", id: msg.guild.id, volume: musicbot.defVolume});
        if (musicbot.musicPresence) musicbot.updatePresence(musicbot.queues.get(msg.guild.id), msg.client, musicbot.clearPresence).catch((res) => { console.warn(`[MUSIC] Problem updating MusicPresence`); });
        const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
        if (voiceConnection !== null) return voiceConnection.disconnect();
      };


      new Promise((resolve, reject) => {
          const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
          if (voiceConnection === null) {
            if (msg.member.voiceChannel && msg.member.voiceChannel.joinable) {
              msg.member.voiceChannel.join()
                .then(connection => {
                  resolve(connection);
                })
                .catch((error) => {
                  console.log(error);
                });
            } else if (!msg.member.voiceChannel.joinable) {
              msg.channel.send(musicbot.note('fail', '보이스채널에 접속할 수 있는 권한이 없습니다.'))
              reject();
            } else {
              musicbot.emptyQueue(msg.guild.id).then(() => {
                reject();
              })
            }
          } else {
            resolve(voiceConnection);
          }
        }).then(connection => {
          let video;
          if (!queue.last) {
            video = queue.songs[0];
          } else {
            if (queue.loop == "queue") {
              video = queue.songs.find(s => s.position == queue.last.position + 1);
              if (!video || video && !video.url) video = queue.songs[0];
            } else if (queue.loop == "single") {
              video = queue.last;
            } else {
             // video = queue.songs.find(s => s.position == queue.last.position + 1);
			 video = queue.songs.find(s => s.position == queue.last.position);
            };
          }
          if (!video) {
            video = musicbot.queues.get(msg.guild.id).songs ? musicbot.queues.get(msg.guild.id).songs[0] : false;
            if (!video) {
              msg.channel.send(musicbot.note('note', '노래가 모두 재생되었습니다!'));
              musicbot.emptyQueue(msg.guild.id);
              const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
              if (voiceConnection !== null) return voiceConnection.disconnect();
            }
          }

          if (musicbot.messageNewSong == true && queue.last && musicbot.queues.get(msg.guild.id).loop !== "song") {
            let req = client.users.get(video.requester);
            if (msg.channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) {
				console.log(new Date().getFullYear()+'년'+(new Date().getMonth()+1)+'월'+new Date().getDate()+'일'+new Date().getHours()+'시'+new Date().getMinutes()+'분'+new Date().getSeconds()+'초: '+ msg.author + '이(가)'+ msg.guild.name + ' 에서 노래를 틀음!')
              const embed = new Discord.RichEmbed()
              .setTitle("현재 재생중인 노래", `${req !== null ? req.displayAvatarURL : null}`)
              .setThumbnail(`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`)
              .setDescription(`[${video.title.replace(/\\/g, '\\\\').replace(/\`/g, '\\`').replace(/\*/g, '\\*').replace(/_/g, '\\_').replace(/~/g, '\\~').replace(/`/g, '\\`')}](${video.url}) by [${video.channelTitle}](${video.channelURL})`)
              .setColor(musicbot.embedColor)
              .setFooter(`Requested by ${req !== null ? req.username : "Unknwon User"}`, `${req !== null ? req.displayAvatarURL : null}`);
              msg.channel.send({embed});
            } else {
              msg.channel.send(musicbot.note("note", `\`${video.title.replace(/`/g, "''")}\` by \`${video.channelURL.replace(/`/g, "''")}\``))
            }
          }

          try {
            musicbot.setLast(msg.guild.id, video).then(() => {
              if (musicbot.musicPresence) musicbot.updatePresence(musicbot.queues.get(msg.guild.id), msg.client, musicbot.clearPresence).catch((res) => { console.warn(`[MUSIC] Problem updating MusicPresence`); });
            });

            let dispatcher = connection.playStream(ytdl(video.url, {
              filter: 'audioonly'
            }), {
				bitrate: musicbot.bitRate,
              volume: (musicbot.queues.get(msg.guild.id).volume / 100)
            })

            connection.on('error', (error) => {
              console.error(error);
              if (msg && msg.channel) msg.channel.send(musicbot.note('fail', `알 수 없는 문제가 발생하였습니다. 다시한번 시도하여보세요.`));
              musicbot.executeQueue(msg, musicbot.queues.get(msg.guild.id));
            });

            dispatcher.on('error', (error) => {
              console.error(error);
              if (msg && msg.channel) msg.channel.send(musicbot.note('fail', `알 수 없는 문제가 발생하였습니다. 다시한번 시도하여보세요.`));
              musicbot.executeQueue(msg, musicbot.queues.get(msg.guild.id));
            });

            dispatcher.on('end', () => {
              setTimeout(() => {
                let loop = musicbot.queues.get(msg.guild.id).loop;
				 const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
				 if(voiceConnection == null ){

				 }else{
					                 if (voiceConnection.channel.members.size <= 1){
                    msg.channel.send(musicbot.note('note', '보이스채널에 아무도 없는것같군요.'))
                  musicbot.queues.set(msg.guild.id, {songs: [], last: null, loop: "none", id: msg.guild.id, volume: musicbot.defVolume});
                  if (musicbot.musicPresence) musicbot.updatePresence(musicbot.queues.get(msg.guild.id), msg.client, musicbot.clearPresence).catch((res) => { console.warn(`[MUSIC] Problem updating MusicPresence`); });
                  const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
                  if (voiceConnection !== null) return voiceConnection.disconnect();
                }
				 }
                if (musicbot.queues.get(msg.guild.id).songs.length > 0) {
                  if (loop == "none" || loop == null) {
                    musicbot.queues.get(msg.guild.id).songs.shift();
                    musicbot.updatePositions(musicbot.queues.get(msg.guild.id).songs, msg.guild.id).then(res => {
                      musicbot.queues.get(msg.guild.id).songs = res;
                      musicbot.executeQueue(msg, musicbot.queues.get(msg.guild.id));
                    }).catch(() => { console.error(new Error("something went wrong moving the queue")); });
                  } else if (loop == "queue" || loop == "song") {
                    musicbot.executeQueue(msg, musicbot.queues.get(msg.guild.id));
                  };
                } else if (musicbot.queues.get(msg.guild.id).songs.length <= 0) {
                  if (msg && msg.channel) msg.channel.send(musicbot.note('note', '노래가 모두 재생되었습니다.'));
                  musicbot.queues.set(msg.guild.id, {songs: [], last: null, loop: "none", id: msg.guild.id, volume: musicbot.defVolume});
                  if (musicbot.musicPresence) musicbot.updatePresence(musicbot.queues.get(msg.guild.id), msg.client, musicbot.clearPresence).catch((res) => { console.warn(`[MUSIC] Problem updating MusicPresence`); });
                  const voiceConnection = client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id);
                  if (voiceConnection !== null) return voiceConnection.disconnect();
                }
              }, 1250);
            });
          } catch (error) {
            console.log(error);
          }
        })
        .catch((error) => {
          console.log(error);
        });

    }

    musicbot.setPrefix = (server, prefix) => {
      return new Promise((resolve, reject) => {
        if (!server || !prefix) reject(new Error("invalid argument"));
        if (typeof server !== 'string' || typeof prefix !== 'string') reject(new TypeError("did not equal string"));

        if (typeof musicbot.botPrefix === "object") {
          musicbot.botPrefix.set(server, prefix);
        } else {
          musicbot.botPrefix = new Map();
          musicbot.botPrefix.set(server, prefix);
        }
      });
    };

    musicbot.note = (type, text) => {
      if (type === 'wrap') {
        let ntext = text
        .replace(/`/g, '`' + String.fromCharCode(8203))
        .replace(/@/g, '@' + String.fromCharCode(8203))
        .replace(client.token, 'REMOVED');
        return '```\n' + ntext + '\n```';
      } else if (type === 'note') {
        return ':musical_note: | ' + text.replace(/`/g, '`' + String.fromCharCode(8203));
      } else if (type === 'search') {
        return ':mag: | ' + text.replace(/`/g, '`' + String.fromCharCode(8203));
      } else if (type === 'fail') {
        return ':no_entry_sign: | ' + text.replace(/`/g, '`' + String.fromCharCode(8203));
      } else if (type === 'font') {
        return text.replace(/`/g, '`' + String.fromCharCode(8203))
        .replace(/@/g, '@' + String.fromCharCode(8203))
        .replace(/\\/g, '\\\\')
        .replace(/\*/g, '\\*')
        .replace(/_/g, '\\_')
        .replace(/~/g, '\\~')
        .replace(/`/g, '\\`');
      } else {
        console.error(new Error(`${type} was an invalid type`));
      }
    };

    musicbot.loadCommands = async () => {
      try {
        await musicbot.loadCommand(musicbot.play);
        await musicbot.loadCommand(musicbot.remove);
        await musicbot.loadCommand(musicbot.help);
        await musicbot.loadCommand(musicbot.skip);
        await musicbot.loadCommand(musicbot.leave);
        await musicbot.loadCommand(musicbot.search);
        await musicbot.loadCommand(musicbot.pause);
        await musicbot.loadCommand(musicbot.resume);
        await musicbot.loadCommand(musicbot.volume);
        await musicbot.loadCommand(musicbot.queue);
        await musicbot.loadCommand(musicbot.loop);
        await musicbot.loadCommand(musicbot.clearqueue);
        await musicbot.loadCommand(musicbot.np);
		await musicbot.loadCommand(musicbot.join);
      } catch (e) {
        console.error(new Error(e));
      };
    }
    musicbot.loadCommands();

    Object.defineProperty(Array.prototype, 'musicArraySort', {value: function(n) {
      return Array.from(Array(Math.ceil(this.length/n)), (_,i)=>this.slice(i*n,i*n+n));
    }});


  } catch (e) {
    console.error(e);
  };
}
