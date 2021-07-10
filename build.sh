#!/bin/bash

cd app
webpack -p

cp -R node_modules/@mdi/font/css dist/
cp -R node_modules/@mdi/font/fonts dist/

zip app.zip dist/* css/* img/* app.html remote.html utils.html manifest.json
cd ..

mkdir -p .build
rm -Rf .build/*
mv app/app.zip .build/

pio run -e rx_uart
pio run -e tx_uart

cp .pio/build/rx_uart/firmware.bin .build/rx.bin
cp .pio/build/tx_uart/firmware.bin .build/tx.bin
