export default function(target) {
  const eventCallbacks = {};

  target.on = (eventType, callback) => {
    eventCallbacks[eventType] = eventCallbacks[eventType] || [];
    eventCallbacks[eventType].push(callback);
  };
  target.trigger = (eventType, ...options) => {
    if (!eventCallbacks[eventType]) return;

    eventCallbacks[eventType].forEach((callback) => callback.call(this, ...options));
  };
}
