#!/bin/sh

echo "Starting node"
node ./dist &
echo "Starting nginx"
nginx -g "daemon off;"
echo "Finished executing"