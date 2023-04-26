export function getLocation(rawText) {

    let validJSON = false;
    let botLocation = {
        "server": null,
        "gametype": null,
        "lobbyname": null,
        "map": null
    };

    if (rawText[0] === '{') {
        try {
            let jsonData = JSON.parse(rawText)

            // If it's valid JSON for /locraw
            if (jsonData["server"]) { botLocation["server"] = jsonData["server"]; validJSON = true; }
            else { throw "Error: Not /locraw"; }

            // Overrides
            if (jsonData["lobbyname"]) { botLocation["lobbyname"] = jsonData["lobbyname"]; }
            else { botLocation["lobbyname"] = null; }
            if (jsonData["gametype"]) { botLocation["gametype"] = jsonData["gametype"]; }
            else { botLocation["gametype"] = null; }
            if (jsonData["map"]) { botLocation["map"] = jsonData["map"]; }
            else { botLocation["map"] = null; }

            // Log the feedback
            // console.log(`Current location: {${botLocation["server"]}${botLocation["lobbyname"] ? `, ${botLocation["lobbyname"]}` : ""}${botLocation["gametype"] ? `, ${botLocation["gametype"]}` : ""}${botLocation["map"] ? `, ${botLocation["map"]}` : ""}}`);
        }
        catch (Exception) {
            // Not locraw
            if (Exception === "Error: Not /locraw") {
                // console.log(jsonMsg);
            }
            // Unhandled exception
            else {
                console.log(`Unhandled Exception: ${Exception}`);
            }
        }
    }

    return [botLocation, validJSON];
}