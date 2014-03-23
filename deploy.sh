#!/bin/sh

echo "Running Application in Forever"
NODE_ENV=production forever stopall -v server.js
NODE_ENV=production forever start -v server.js
