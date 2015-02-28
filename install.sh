#!/bin/sh

# Get the current version of the file
git pull origin master

command -v peerjs >/dev/null 2>&1 || {
  echo >$2 "First installation -- installing PeerServer";
  npm install -g peer;
}
