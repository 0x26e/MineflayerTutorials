const mineflayer = require('mineflayer');

let botArgs = {
    host: 'localhost',
    port: '12345',
    version: '1.8.9'
};

class MCBot {

    // Constructor
    constructor(username) {
        this.username = username;
        this.host = botArgs["host"];
        this.port = botArgs["port"];
        this.version = botArgs["version"];

        this.initBot();
    }

    // Init bot instance
    initBot() {
        this.bot = mineflayer.createBot({
            "username": this.username,
            "host": this.host,
            "port": this.port,
            "version": this.version
        });

        this.initEvents()
    }

    // Init bot events
    initEvents() {
        this.bot.on('login', () => {
            let botSocket = this.bot._client.socket;
            console.log(`[${this.username}] Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`);
        });

        this.bot.on('end', (reason) => {
            console.log(`[${this.username}] Disconnected: ${reason}`);
    
            if (reason == "disconnect.quitting") {
                return
            }
    
            // Attempt to reconnect
            setTimeout(() => this.initBot(), 5000);
        });

        this.bot.on('spawn', async () => {
            console.log(`[${this.username}] Spawned in`);
            this.bot.chat("Hello!");
    
            await this.bot.waitForTicks(60);
            this.bot.chat("Goodbye");
            this.bot.quit();
        });

        this.bot.on('error', (err) => {
            if (err.code == 'ECONNREFUSED') {
                console.log(`[${this.username}] Failed to connect to ${err.address}:${err.port}`)
            }
            else {
                console.log(`[${this.username}] Unhandled error: ${err}`);
            }
        });
    }
}

let bots = [];
for(var i = 0; i < 6; i++) {
    bots.push(new MCBot(`Hello_world_${i}`))
}
