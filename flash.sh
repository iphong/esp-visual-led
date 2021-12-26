#!/bin/bash

while true; do
	echo ""
	echo ""
	echo "--------------------------------------------------------------------------------"
	echo ""
	read -p '  Plug in your device and press enter to continue...'
	echo ""
	echo ""
	esptool.py --baud 460800 write_flash 0x00 build/rx.bin
	sleep 1
done
