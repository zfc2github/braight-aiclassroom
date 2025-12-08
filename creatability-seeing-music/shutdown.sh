#!/bin/bash
pid=$(cat ./run.pid)
if [ -n "$pid" ]; then
    echo "Killing process with PID $pid"
    kill -- -$(ps -o pgid= -p ${pid} | tr -d ' ')
else
    echo "No process found with the specified command"
fi
