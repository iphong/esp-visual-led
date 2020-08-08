# Visual LED Application for ESP32/ESP8266 Micro Controller

1. LED POI

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