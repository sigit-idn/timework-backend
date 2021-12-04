const notifications = {
  _data: [],
  listeners: [],
  listenersId: [],
  set add(newData) {
    this._data.push(newData);
    this.listeners.forEach((listener) => listener(this._data));
  },

  set remove(taskId) {
    this._data.forEach((task, i) => {
      if (String(task.taskId) == taskId) {
        this._data.splice(i, 1);
        this.listeners.forEach((listener) => listener(this._data));
      }
    });
  },

  get data() {
    return this._data;
  },

  addListener(listener, listenerId) {
    if (listenerId) {
      const listenerIndex = this.listenersId.indexOf(listenerId);

      if (listenerIndex > -1) this.listeners[listenerIndex] = listener;

      this.listenersId.push(listenerId);
      this.listeners.push(listener);

      this.listeners.forEach((listener) => listener(this._data));
    }
  },
};

module.exports = notifications;
