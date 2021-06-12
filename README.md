# ESP VISUAL LED

## Introduction

Based on products by Lighttoys. These allows projects using ESP8266 to deliver complex light show similar to those LightToys modules.

## Color Sequence

Everything begins with a pre-composed light sequences created by show producers based on some audio tracks. A basic light sequences is a timeline of keyframes of color changes throughout the show. A light sequence runs at 1Khz frequency which should updates every milliseconds. A sequence is controlled and rendered individually, and each of these tasks of rendering light sequences from start to end is called an output channel.

## Receiver Nodes

A receiver node is a device module which may have one or more output channels, and should be able to render them simultenously. Multiple receiver can be combined if a large number of output channels are required in a set.
These receivers need to synchronized in realtime.

## Master Controller

A light show may have tens or even hundreds of these output channels. A master computer which play the music track instruct when all receiver should begin playing light show and must be in perfect time sync with milliseconds accuracy throughout all devices.

## Performce Reliability
