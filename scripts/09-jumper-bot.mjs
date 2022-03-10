import mineflayer from "mineflayer";
import chalk from "chalk";

// Setup global bot arguments
let botArgs = {
    host: 'localhost',
    port: '12345',
    version: '1.8.9'
};

// Bot class
class MCBot {

    // Constructor
    constructor(username) {
        this.username = username;
        this.host = botArgs["host"];
        this.port = botArgs["port"];
        this.version = botArgs["version"];

        // Initialize the bot
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

        // Initialize bot events
        this.initEvents();
    }

    // Logger
    log(...msg) {
        console.log(`[${this.username}]`, ...msg);
    }

    // Chat intake logger
    chatLog(username, ...msg) {
        if (!botNames.includes(username)) {
            this.log(chalk.ansi256(98)(`<${username}>`), ...msg)

            let localPlayers = this.bot.players;
            let playerLocation = localPlayers[username].entity.position;

            this.log(`Player ${username} found at ${playerLocation}`);
            this.bot.lookAt(playerLocation);
            this.runAndJump();
        }
    }

    // Run and jump function
    async runAndJump() {
        this.bot.setControlState('forward', true);
        await this.bot.waitForTicks(1);
        this.bot.setControlState('sprint', true);
        this.bot.setControlState('jump', true);

        await this.bot.waitForTicks(11);
        this.bot.clearControlStates();
    }

    // Init bot events
    initEvents() {

        this.bot.on('login', async () => {
            let botSocket = this.bot._client.socket;
            this.log(chalk.ansi256(34)(`Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`));
        });

        this.bot.on('end', async (reason) => {
            this.log(chalk.red(`Disconnected: ${reason}`));

            // Bot peacefully disconnected
            if (reason == "disconnect.quitting") {
                return
            }
            // Unhandled disconnections
            else {
                //
            }

            // Attempt to reconnect
            setTimeout(() => this.initBot(), 5000);
        });

        this.bot.on('spawn', async () => {
            this.log(chalk.ansi256(46)(`Spawned in`));
            this.bot.chat("Hello!");

            // Auto disconnect
            // await this.bot.waitForTicks(60);
            // this.bot.chat("Goodbye");
            // this.bot.quit();
        });

        this.bot.on('chat', async (username, jsonMsg) => {
            this.chatLog(username, jsonMsg);
        });

        this.bot.on('error', async (err) => {

            // Connection error
            if (err.code == 'ECONNREFUSED') {
                this.log(`Failed to connect to ${err.address}:${err.port}`)
            }
            // Unhandled errors
            else {
                this.log(`Unhandled error: ${err}`);
            }
        });
    }
}

let bots = [];
let botNames = [];
for (let i = 0; i < 5; i++) {
    bots.push(new MCBot(`Hello_world_${i}`));
    botNames.push(`Hello_world_${i}`)
};
