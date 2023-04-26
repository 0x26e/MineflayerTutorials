import mineflayer from "mineflayer";
import chalk from "chalk";
import { getChatEvents } from './utils/getChatEvents.mjs';
import { readFile, writeFile } from "fs/promises";
import readline from "readline";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Setup global bot arguments
let botArgs = {
    host: 'brwc.grub-bros.de',
    version: '1.18.2'
};

// Bot class
class MCBot {

    // Constructor
    constructor(username, password, auth) {
        this.username = username;
        this.password = password;
        this.auth = auth;
        this.host = botArgs["host"];
        this.port = botArgs["port"];
        this.version = botArgs["version"];
        this.currentTrack = "";

        // Initialize the bot
        this.initBot();

        // Import external functions
        this.getChatEvents = getChatEvents;
    }

    // Init bot instance
    initBot() {
        this.bot = mineflayer.createBot({
            "username": this.username,
            "password": this.password,
            "auth": this.auth,
            "host": this.host,
            "port": this.port,
            "version": this.version,
            "hideErrors": true
        });

        // Initialize bot events
        this.initEvents();
        this.listenToUserInput();
    }

    // Logger
    log(...msg) {
        // Show masked name
        if (params["showName"] && params["showMask"]) {
            console.log(this.mask(`[${this.bot.username}] ` + msg[0]));
        }

        // Show name
        else if (params["showName"]) {
            console.log(`[${this.bot.username}] ` + msg[0]);
        }

        // Don't show name
        else {
            console.log(msg[0]);
        }
    }

    // Mask
    mask(msg) {
        // Mask
        for (const key in MASK) {
            msg = msg.replace(new RegExp(key, "gi"), MASK[key]);
        }
        return msg;
    }

    // Event for console input
    listenToUserInput() {
        rl.prompt(true)
        rl.on('line', async (input) => {
            switch (input) {
                case "cls":
                    break;
                case "print data":
                    console.log(data);
                    break;
                case "save data":
                    let dataJSON = JSON.stringify(data);
                    writeFile("trackData.json", dataJSON);
                    break;
                default:
                    this.bot.chat(input);
                    break;
            }
        });
    }

    // Init bot events
    initEvents() {

        this.bot.on('login', async () => {

            // Display connection info
            let botSocket = this.bot._client.socket;
            this.log(chalk.ansi256(34)(`Logged in to ${botSocket.server ? botSocket.server : botSocket._host}`));

            // Add name to list
            botNames.push(this.bot.username);
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
            await this.bot.waitForChunksToLoad();
            this.log(chalk.ansi256(46)(`Chunks loaded`));

            await this.bot.waitForTicks(20);
            for (const track in tracks) {
                this.currentTrack = track;
                data[track] = [];
                for (let i = 0; i < tracks[track]; i++) {
                    this.bot.chat(`/t times ${track} ${i + 1}`);
                    await this.bot.waitForTicks(5);
                }
                await this.bot.waitForTicks(10);
            }
        });

        this.bot.on('message', async (jsonMsg) => {
            let ansiText = this.mask(jsonMsg.toAnsi());
            let rawText = jsonMsg.toString();

            // Show messages
            if (params["showName"] && params["showMask"]) {
                process.stdout.write(this.mask(`[${this.bot.username}] ${ansiText}`));
            }
            else if (params["showName"]) {
                process.stdout.write(`[${this.bot.username}] ${ansiText}`);
            }
            else { process.stdout.write(ansiText); }

            // Get events
            let [messageClickEvents, messageHoverEvents] = this.getChatEvents(jsonMsg);

            // Click and Hover events
            let clickEvents = params["showClickEvents"] && messageClickEvents.length;
            let hoverEvents = params["showHoverEvents"] && messageHoverEvents.length;

            if (clickEvents && hoverEvents) { console.log(messageClickEvents, messageHoverEvents); }
            else if (clickEvents) { console.log(messageClickEvents); }
            else if (hoverEvents) { console.log(messageHoverEvents); }
            else { console.log(); }

            if (jsonMsg?.extra) {
                if (jsonMsg.extra[0].color == "dark_green") {
                    if (rawText.slice(-1) !== '-') {
                        let rawTextSplit = rawText.split(" ");
                        if(rawTextSplit[3].slice(0, 1) === '0') {
                            rawTextSplit[3] = rawTextSplit[3].substr(1);
                        }
                        data[this.currentTrack].push([
                            rawTextSplit[0],
                            rawTextSplit[1],
                            rawTextSplit[3]
                        ]);
                    }
                }
            }

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

// Import accounts
const ACCOUNT = JSON.parse(
    await readFile(
        new URL('./secrets/ACCOUNT.json', import.meta.url)
    )
);

// Init containers and params
let bots = [];
let botNames = [];
let MASK = {};
let params = {
    showClickEvents: true,
    showHoverEvents: false,
    showName: false,
    showMask: false
};
let data = {};
let tracks = {
    "arnorring": 5,
    "TadetinKarting": 3,
};

// Create bots
for (let i = 0; i < ACCOUNT.length; i++) {
    let ACC = ACCOUNT[i];
    let newBot = new MCBot(ACC.username, ACC.password, ACC.auth);
    bots.push(newBot);
    MASK[ACC.ign] = `0x_BOT_${String(i + 1).padStart(3, '0')}`;
};
