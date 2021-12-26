#!/bin/bash

esptool.py --baud 460800 write_flash 0x00 build/rx.bin
