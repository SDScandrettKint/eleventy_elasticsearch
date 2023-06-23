# eleventy elasticsearch plugin

## Additional NPM package requirements:
- npm install elasticsearch
- npm install dotenv

## Installation:
1. `git clone https://github.com/SDScandrettKint/eleventy_elasticsearch.git elasticsearch` in the "_plugins/" directory
2. create a .env file with ES_PASSWORD=(a value)
3. `docker-compose up -d` to start elasticsearch
4. run `node index.js` to create the index and go through content markdown yaml

## Improvements to make 
- contributor needs to be unpacked from object, currently just stored as object type in mapping but should be text array
