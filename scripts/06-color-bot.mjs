import mineflayer from "mineflayer";
import chalk from "chalk";

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

    // Logger
    log(...msg) {
        console.log(`[${this.username}]`, ...msg);
    }

    // Init bot events
    initEvents() {
        this.bot.on('login', () => {
            let botSocket = this.bot._client.socket;
            this.log(chalk.ansi256(34)(`Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`));
        });

        this.bot.on('end', (reason) => {
            this.log(chalk.red(`Disconnected: ${reason}`));

            if (reason == "disconnect.quitting") {
                return
            }

            // Attempt to reconnect
            setTimeout(() => this.initBot(), 5000);
        });

        this.bot.on('spawn', async () => {
            this.log(chalk.ansi256(46)(`Spawned in`));
            this.bot.chat("Hello!");

            await this.bot.waitForTicks(60);
            this.bot.chat("Goodbye");
            this.bot.quit();
        });

        this.bot.on('error', (err) => {
            if (err.code == 'ECONNREFUSED') {
                this.log(`Failed to connect to ${err.address}:${err.port}`)
            }
            else {
                this.log(`Unhandled error: ${err}`);
            }
        });
    }
}

let bots = [];
for (var i = 0; i < 6; i++) {
    bots.push(new MCBot(`Hello_world_${i}`))
}
