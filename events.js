class Events {
    callbacks = [];
    nextId = 0;

    emit(eventName, data)
    {
        this.callbacks.forEach(stored => {
            if (stored.eventName === eventName) {
                stored.callback(data);
            }
        });
    }

    // subscribe to something
    on(eventName, caller, callback)
    {
        this.nextId++;
        this.callbacks.push({ id: this.nextId, eventName: eventName, caller: caller, callback: callback });
        return this.nextId;
    }
    
    // unsubscribe from something
    off(id)
    {
        this.callbacks = this.callbacks.filter((callback) => callback.id !== id);
    }

    // removes all callbacks for a given caller
    unsubscribe(caller)
    {
        this.callbacks = this.callbacks.filter((callback) => callback.caller !== caller);
    }
}

export const myEvents = new Events(); 