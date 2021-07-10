[my_github]: https://github.com/iphong  "My GitHub URL"

# ESP VISUAL LED

These project is focusing on using the ESP8266 to deliver visually complex and beautiful light shows.

These are a few basic aspects in which we want to achieve in project:

### 1. Color Sequence
    
Everything begins with a pre-composed light sequences created by show producers based on some audio tracks. A basic light sequences is a timeline of keyframes of color changes throughout the show. A light sequence runs at 1Khz frequency which should updates every milliseconds. A sequence is controlled and rendered individually, and each of these tasks of rendering light sequences from start to end is called an output channel.
    
### 2. Receiver Nodes
  
A receiver node is a device module which may have one or more output channels, and should be able to render them simultenously. Multiple receiver can be combined if a large number of output channels are required in a set.
These receivers need to synchronized in realtime.
  
### 3. Master Controller
  
A light show may have tens or even hundreds of these output channels. A master computer which play the music track instruct when all receiver should begin playing light show and must be in perfect time sync with milliseconds accuracy throughout all devices.

***

# Building the hardware

The basic components for a LED driver circuit includes MCU, MOSFET and PSU. Everything needs to be very small as they will be mostly be mounted on instruments and clothes. size of a fullsize sim-card should be ideal.

### 1 - MCU

Any esp8266 modules should be fine. And for this specific project, we use the ESP-12F for several reasons:

* It has all the GPIO pins and yes, we definitly need all of them
* It has 4MB of flash memory which can be used for OTA and light show uploads
* It has builtin antenna which is good enough for our purpose
* It is nicely packed in a small form factor with metal shields which is FCC certified
* And they are insanely cheap

### 2 - PSU

We need a 3.3v power supply for the ESP8266, a few resistors and a status indicator LED. For 5v power source, a linear LDO voltage regulator should be perfect. For power source greater than 9V, a switch regulator is required to keep the temperature low.

### 3 - MOSFET

Average continuous current drawn of 2-4 amps running at 5V or 12V power sources or from 1-3 cells lithium batteries.

A typical RGB led has 3 channels representing red, green and blue color. We controls the brightness of each channel using PWM.
Most popular LED strip on the market has 4 pins with common anode terminal which connect directly to the main power source positive terminal. Then we use N-channel MOSFET w/ logic-level gate connect to the kathode terminal of each channels. To control set the gate level to HIGH to turn on the LED.

There are some other uncommon LED with common kathode configuration which need a P-channel MOSFET to control. To keep things simple, we just going to use the common anode type products.

***

## Light Show Binary file format (.LSB)

The content of this file is a sequence of 16 bytes frames. Which has the following structure:

Type | RED | GREEN | BLUE | START | DURATION | TRANSITION
---- | --- | ----- | ---- | ----- | -------- | ----------
UINT8(1) | UINT8(1) | UINT8(1) | UINT8(1) | UINT32(4) | UINT32(4) | UINT32(4)

#### Frame types

* 0x01 - RGB FRAME
* 0x02 - END FRAME
* 0x03 - LOOP FRAME

## GPIO Pin Mappings

Function | Pin #
---------|------
Battery Voltage | ***ADC0***
Setup Button | ***GPIO0***
Status LED | ***GPIO2***
Serial TX | ***GPIO1***
Serial RX | ***GPIO3***
Channel 1 Green | ***GPIO12***
Channel 1 Red | ***GPIO13***
Channel 1 Blue | ***GPIO14***
Channel 2 Green | ***GPIO15***
Channel 2 Red | ***GPIO5***
Channel 2 Blue | ***GPIO4***
