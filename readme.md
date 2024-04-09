# Shared World Generator

This project allows users to create a 3D "world" made out of primitive shapes, then temporarily save
their creations which can later be restored and edited with a unique ID. 

It was designed to be run on a web server, but Heroku removing their free tier broke my hosting
environment, so it is now designed to be run locally.

Notes:

This was a university assignment. The server routing is done manually because we were forbidden from
using a server framework like Express.js. Also, we were not taught databases yet, which is why I
store the worlds in a local JavaScript object in `sceneHandler.js`. This of course is not viable for
a real application.
