#!/bin/bash
pid=$(ps -ef|grep 'npm run build && http-server -p 8106' | grep -v grep | awk '{print $2}')
if [ -n "$pid" ]; then
    echo "Killing process with PID $pid"
    kill -9 "$pid"
else
    echo "No process found with the specified command"
fi
