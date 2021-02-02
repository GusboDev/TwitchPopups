// =======================================
// Command: !alert <text>
// Description: will display whatever text comes after the !alert command, and hide after 3 seconds
// =======================================
actionHandlers['!alert'] = {
    security: (context, textContent) => {
        return context.mod || (context["badges-raw"] != null && context["badges-raw"].startsWith("broadcaster"))
    },
    handle: (context, textContent) => {
        const formattedText = popup.formatEmotes(textContent, context.emotes, false).substr(7);
        popup.showText(formattedText, "alert");
        if (playAlertSound) {
            new Audio(alertSoundFile).play();
        }
    }
};


// =======================================
// Command: !banner <text>
// Description: will display whatever text comes after the !banner command and stay until deleted or replaced
// =======================================
actionHandlers['!banner'] = {
    security: (context, textContent) => {
        return context.mod || (context["badges-raw"] != null && context["badges-raw"].startsWith("broadcaster"))
    },
    handle: (context, textContent) => {
        const formattedText = popup.formatEmotes(textContent, context.emotes, false).substr(7);
        popup.holdText(formattedText, "alert");
        if (playAlertSound) {
            new Audio(alertSoundFile).play();
        }
    }
};

// =======================================
// Command: !delete
// Description: This delete command resets the whole pop up system
// =======================================
actionHandlers['!delete'] = {
    security: (context, textContent) => {
        return context.mod || (context["badges-raw"] != null && context["badges-raw"].startsWith("broadcaster"))
    },
    handle: (context, textContent) => {
        popup.delete();
        // TODO : loop through objects calling its own state reset function
    }
};


// =======================================
// Command: !spotlight
// Description: spotlight [@username]: will display the chat of the specified user from that point on
// =======================================
var spotlightUser = "";

actionHandlers['!spotlight'] = {
    security: (context, textContent) => {
        return context.mod || (context["badges-raw"] != null && context["badges-raw"].startsWith("broadcaster"))
    },
    handle: (context, textContent) => {
        spotlightUser = textContent.substr(12).toLowerCase();
        popup.showText(`${spotlightEmoji} Welcome ${spotlightUser} to the stage!`, "spotlight");
    }
};

// This handler is fired when the spotlighted user types something in chat
allHandlers.push({
    security: (context, textContent) => {
        return context.username === spotlightUser && (!textContent.startsWith('@') || textContent.startsWith('@' + twitchChannel))
    },
    handle: (context, textContent) => {
        const formattedText = popup.formatEmotes(textContent, context.emotes, false);
        console.log(formattedText);
        popup.showText(`${spotlightEmoji} ${context['display-name']}: ${formattedText}`, "spotlight");
    }
});

// =======================================
// Bits donated
// Description: Displays a pop-up thank you message when a user donates bits
// =======================================

actionHandlers["bits"] = {
    handle: (context, userstate) => {
        popup.showText(`${context.username} donated ${context.bits} bits like an awesome human`, "cheer");
    }
}

// =======================================
// User subscribed
// Description: Displays a pop-up thank when a user subscribes
// =======================================

actionHandlers["sub"] = {
    handle: (username, method, msg, tags) => {
        popup.showText(`${username} has subscribed! Welcome!`, "cheer");
    }
}

// =======================================
// User resubscribed
// Description: Displays a pop-up thank when a user resubscribes
// =======================================

actionHandlers["resub"] = {
    handle: (username, streakMonths, msg, tags, methods) => {
        popup.showText(`${username} resubbed with a streak of ${streakMonths} months!`, "cheer");
    }
}

// =======================================
// User followed
// Description: Displays a pop-up thank when a user follows
// =======================================

actionHandlers["follow"] = {
    handle: (username) => {
        popup.showText(`Thanks for the follow, ${username}!`, "cheer");
    }
}