import chalk from "chalk";

export function getChatEvents(jsonMsg) {
    // Setup
    let clickEvents = [];
    let hoverEvents = [];

    // Check for click events
    if (jsonMsg["clickEvent"]) {
        let cEvent = jsonMsg["clickEvent"];

        // Known actions
        if (["run_command", "suggest_command", "open_url"].includes(cEvent["action"])) {
            if (!clickEvents.includes(cEvent["value"])) {
                clickEvents.push(cEvent["value"]);
            }
        }
        // If its a new action (yay!)
        else {
            console.log(chalk.ansi256(212).bgAnsi256(52)(`| NEW CLICK EVENT: ${cEvent["action"]}|`));
        }
    }

    // Check for hover events
    if (jsonMsg["hoverEvent"]) {
        let hEvent = jsonMsg["hoverEvent"];

        // Known actions
        if (hEvent["action"] === "show_text") {
            hoverEvents.push(hEvent["value"]["text"].replace(/§[a-z0-9]/g, ""));
        }
        // If its a new action (yay!)
        else {
            console.log(chalk.ansi256(212).bgAnsi256(52)(`| NEW HOVER EVENT: ${hEvent["action"]}|`));
        }
    }

    // If there are nested segments
    if (jsonMsg["extra"]) {

        // Check them all
        jsonMsg["extra"].forEach(subMsg => {

            // Check for click events
            if (subMsg["clickEvent"]) {
                let cEvent = subMsg["clickEvent"];

                // Known actions
                if (["run_command", "suggest_command", "open_url"].includes(cEvent["action"])) {
                    if (!clickEvents.includes(cEvent["value"])) {
                        clickEvents.push(cEvent["value"]);
                    }
                }
                // If its a new action (yay!)
                else {
                    console.log(chalk.ansi256(212).bgAnsi256(52)(`| NEW CLICK EVENT: ${cEvent["action"]}|`));
                }
            }

            // Check for hover events
            if (subMsg["hoverEvent"]) {
                let hEvent = subMsg["hoverEvent"];

                // Known actions
                if (hEvent["action"] === "show_text") {
                    hoverEvents.push(hEvent["value"]["text"].replace(/§[a-z0-9]/g, ""));
                }
                // If its a new action (yay!)
                else {
                    console.log(chalk.ansi256(212).bgAnsi256(52)(`| NEW HOVER EVENT: ${hEvent["action"]}|`));
                }
            }
        });
    }

    clickEvents = [...new Set(clickEvents)];
    hoverEvents = [...new Set(hoverEvents)];

    return [clickEvents, hoverEvents];
}