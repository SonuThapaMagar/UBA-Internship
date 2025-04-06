import { EventEmitter } from "events";

// Create an instance of EventEmitter
const myEmitter = new EventEmitter();

myEmitter.on("message", (msg) => {
  console.log("Message received:", msg);
});

// Emit the 'message' event
myEmitter.emit("message", "Hello, World!");
