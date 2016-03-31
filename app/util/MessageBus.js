class MessageBus {
	constructor()
	{
		this.handlers = [];
	}

	registerHandler(eventIndex, handler)
	{
		if(this.handlers[eventIndex] === undefined)
			this.handlers[eventIndex] = [];
		this.handlers[eventIndex].push(handler);
	}

	deleteHandler(eventIndex, handler)
	{
		if(this.handlers[eventIndex] === undefined)
			return;
		this.handlers[eventIndex].splice(this.handlers[eventIndex].indexOf(handler), 1);
	}

	getHandlers(eventIndex)
	{
		return this.handlers[eventIndex];
	}

	emit(eventIndex, eventData)
	{
		if(this.handlers[eventIndex] === undefined)
			return;
		this.handlers[eventIndex].forEach((handler) => {
			if(typeof handler === 'function')
				setTimeout(() => handler(eventData), 0);
		});
	}
}

export default MessageBus;