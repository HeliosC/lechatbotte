
function Dispatcher(botClient) {
    this.botClient = botClient;

    this.components = [];
}

Dispatcher.prototype.addComponent = function(component) {
    this.components.push(component);
};

Dispatcher.prototype.removeComponent = function(component) {
    let index = this.components.indexOf(component);
    if (index == -1) {
        return null;
    } else {
        return this.components.splice(index, 1);
    }
};

Dispatcher.prototype.onMessage = function(message) {
    if (message.channel.type != "text") { return; }

    let usedComponents = []

    for (let component of this.components) {
        if (component.onMessage === undefined) continue;

        if (!component.isConcernedByMessage(message)) continue;

        let used = component.onMessage(message);

        if (used) {
            usedComponents.push(component);
        }
    }

    if (usedComponents.length > 1) {
        console.warn(`[WARNING] Multiple components act on the message: ${message.content}`);
    }
};

Dispatcher.prototype.onReaction = function(reaction, user) {
    let usedComponents = []

    for (let component of this.components) {
        if (component.onReaction === undefined) continue;

        let used = component.onReaction(reaction, user);

        if (used) {
            usedComponents.push(component);
        }
    }

    if (usedComponents > 0) {
        console.debug(`Bot reacted on message: "${message.content}"`)
    }

    if (usedComponents.length > 1) {
        console.warn(`[WARNING] Multiple components act on the reaction of the message : ${reaction.message.content}`);
    }
};

module.exports = Dispatcher;
