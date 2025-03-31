#!/bin/bash
# prevent the script from continuing if any command fails
set -euo pipefail

# pull latest version of site
git pull origin main

mise exec node -- npm install

# build site with the low priority to not interfere with e1 important stuff
nice -n 19 mise exec node -- npm run generate

# upload site
rsync -avz --delete .output/public/ e1@data.remtechalloys.com:/home/e1/remtechalloys.com