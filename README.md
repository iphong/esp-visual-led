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

## Control Protocol

Based on data payload received using esp-now which is a bytes array of maximum 250 bytes.

```
HEADER      FRAME TYPE      FRAME VALUE
 23 3E      00 00 00 ..     00 00 00 00 ..
```

### 1. HEADER

* First byte is the sync word which is always the hash character (# or 0x23)
* Second byte indicate the direction of the data using '<' and '>' (0x3C or 0x3E)
* The third byte onward is the actual payload
* Due to the nature of remote control, data payload needs to be as compact as possible.

### 3. FRAMES

* Different data frame can be defined as type/value pair if desired
* types and values can be at any length and use ascii characters for easier
to read and implementation. An example of a 9 bytes telling the receiver that i am sending an RGB array containing 2 channels with red color.
```
R  G  B  CHANNEL1 CHANNEL2 ..
52 47 42 FF 00 00 FF 00 00 ..
```

### 4. DATA HANDLING

* Since this protocol is focusing on controlling visual effect devices. The data does not need to be encrypted.
* To maximize data transfer to multiple targets, we just broadcast the payload with no acknowledgement. It's OK for the receiver ends to miss a few packets or doesn't receive anything at all (when out of range).
* Since there is no acknowledgement involves, data sending time can be fixed and recur at much faster rate. if one or more receiver is not present at the moment, the sender doesn't need to wait for its reply.
* Frame can be implemented using simple pub/sub paradism in your application layer. For example:
```c++

on("RGB", [](char *colors, int len) {
    // Handling your data here
})
```
