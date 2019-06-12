Dependencies For Linux:

ALSA (Advanced Linux Sound Architecture)
sudo apt-get install libasound2-dev alsa-base alsa-utils

NodeJS
sudo apt-get install nodejs

Node-gyp
npm install -g node-gyp

unrar node_modules.rar

cd VoipApp and execute npm -i

Usage Example:

For create server: node index.js --listen 8080 --input hw:0,0 --output hw:1,1

For connect to server: node index.js --connect 192.168.1.2:8080 --input hw:0,0 --output hw:1,1
