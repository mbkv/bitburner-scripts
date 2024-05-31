#!/bin/bash

# treeshaking doesn't work properly to do multiple entrypoints
# https://github.com/oven-sh/bun/issues/11476

trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT

bun run filesync > /dev/null &

build() {
    sleep 0.1
    for entrypoint in ./src/bin/*.ts; do 
        echo $entrypoint
        bun build $entrypoint --outdir dist > /dev/null
    done
}

build

while true; do
    inotifywait -qr -e modify -e create -e delete -e move src;
    echo "Building"
    build
done
