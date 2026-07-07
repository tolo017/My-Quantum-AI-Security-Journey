#!/bin/bash

# Function to check and start a container
start_container() {
    NAME=$1
    if [ "$(docker ps -q -f name=$NAME)" ]; then
        echo "✅ $NAME is already running."
    else
        echo "🚀 Starting $NAME..."
        docker start $NAME
    fi
}

start_container "kali-lab"
start_container "parrot-lab"
