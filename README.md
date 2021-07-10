# ESP VISUAL LED

## Introduction

Based on products by Lighttoys. These allows projects using ESP8266 to deliver visually complex and beautiful light shows. Below is a few basic aspects in which we want to achieve in project:

#### 1. Color Sequence
    
Everything begins with a pre-composed light sequences created by show producers based on some audio tracks. A basic light sequences is a timeline of keyframes of color changes throughout the show. A light sequence runs at 1Khz frequency which should updates every milliseconds. A sequence is controlled and rendered individually, and each of these tasks of rendering light sequences from start to end is called an output channel.
    
#### 2. Receiver Nodes
  
A receiver node is a device module which may have one or more output channels, and should be able to render them simultenously.    Multiple receiver can be combined if a large number of output channels are required in a set.
These receivers need to synchronized in realtime.
  
#### 3. Master Controller
  
A light show may have tens or even hundreds of these output channels. A master computer which play the music track instruct when all receiver should begin playing light show and must be in perfect time sync with milliseconds accuracy throughout all devices.


## Building the hardware

The basic components for a LED driver circuit includes MCU, MOSFET and PSU. Everything needs to be very small as they will be mostly be mounted on instruments and clothes. size of a fullsize sim-card should be ideal.

#### 1. The microcontroller

Any esp8266 modules should be fine. And for this specific project, we use the ESP-12F for several reasons:

* It has all the GPIO pins and yes, we definitly need all of them
* It has 4MB of flash memory which can be used for OTA and light show uploads
* It has builtin antenna which is good enough for our purpose
* It is nicely packed in a small form factor with metal shields which is FCC certified
* And they are insanely cheap

#### 2. The MOSFET

Average continuous current drawn of 2-4 amps running at 5V or 12V power sources or from 1-3 cells lithium batteries.

#### 3. The power supply

We need a 3.3v power supply for the ESP8266, a few resistors and a status indicator LED. For 5v power source, a linear LDO voltage regulator should be perfect. For power source greater than 9V, a switch regulator is required to keep the temperature low.
