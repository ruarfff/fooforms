#!/bin/sh

git pull origin master
npm install
grunt deploy
NODE_ENV=production forever start ../server.js
