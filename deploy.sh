#!/bin/sh

echo "Running Application in Forever"
NODE_ENV=production forever start server.js
