# Visual LED Application for ESP32/ESP8266 Micro Controller

1. LED POI
2. LED FAN

## The Challenges

1. Control an array of 36 WS2812B leds for display visual graphics
2. Serving a web application for uploading & managing visual content
3. Multiple devices must be in perfect synchronized playback

Using just a single ESP8266 micro controller.

While driving an addressable led array alone is a very CPU intensive
task and the micro controller need to execute a control loop at maximum
frequency. In order to synchronize multiple devices, it need to maintain
a communication channel among peer devices, without causing delay to the
LED control loop.

## Work in progress

Perfect sync in action demo video: https://youtu.be/U7mEyWGtELM

![ledpoi04](https://raw.githubusercontent.com/iphong/esp-visual-led/master/docs/photos/ledpoi04.JPG "Led POI 04")

View more photos at https://github.com/iphong/esp-visual-led/tree/master/docs/photos

## Data Stores

File Systems: SDFS, LittleFS, SPIFFS

Image files naming (1000 max):
    
    * img/000
    * img/001
    * ...
    * img/998
    * img/999

Sequence files naming (10 max):

    * seq/0
    * seq/1
    * ...
    * seq/8
    * seq/9


## Image Data

RGB Byte sequence

```
01 02 03    04 05 06    07 08 09
--------------------------------
FF FF FF    00 00 00    FF FF FF
--------    --------    --------
RR GG BB    RR GG BB    RR GG BB
PIXEL 01    PIXEL 02    PIXEL 03
```
For example an `36x36` image has total byte length of `3888 bytes`

## Timeline Data

```
1--2 3------6   7--8 9-----12
-----------------------------
0000 00000000   0000 00000000
---- --------   ---- --------
ID   DURATION   ID   DURATION
SEQUENCE   01   SEQUENCE   02
```
