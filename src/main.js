const opts = {
    channels: [
        twitchChannel
    ]
};

let actionHandlers = {};
let allHandlers = [];

// Create a client with our options defined at the top of the file
let client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.on('cheer', onCheerHandler);
client.on('subscription', onSubHandler);
client.on('resub', onResubHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
    
    // Remove whitespace from chat message
    const command = msg.trim();
    
    // Check for bot messages about new followers
    if (context["display-name"] == "kaedesmithbot" && msg.includes("Thank you for the follow!")) {
        user = msg.replace(', Thank you for the follow!', '');
        onFollowHandler(user);
    }

    let handlerName;
    if (command.indexOf(" ") > -1) {
        handlerName = command.substring(0, command.indexOf(" "));
    } else {
        handlerName = command;
    }

    // Handle the rest of chat not using commands
    for (const handler of allHandlers) {
        if (handler.security(context, command)) {
            handler.handle(context, command);
        }
    }

    // Check all commands
    if (actionHandlers[handlerName] && actionHandlers[handlerName].security(context, command)) {
        actionHandlers[handlerName].handle(context, command);
    }

}

function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}

function onCheerHandler(channel, username, userstate, message) {
    actionHandlers["bits"].handle(username, userstate);
}

function onSubHandler(channel, username, method, msg, tags) {
    actionHandlers["sub"].handle(username, method, msg, tags);
};

function onResubHandler(channel, username, streakMonths, msg, tags, methods) {
    actionHandlers["resub"].handle(username, streakMonths, msg, tags, methods);
}

function onFollowHandler(user) {
    actionHandlers['follow'].handle(user);
}
