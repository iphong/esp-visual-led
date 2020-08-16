#include "Arduino.h"

class RGBLight {
protected:
    u8 r_pin;
    u8 g_pin;
    u8 b_pin;
    
    u8 color[3];

public:
    RGBLight(u8 r, u8 g, u8 b):r_pin(r), g_pin(g), b_pin(b) {};
    void begin() {
        pinMode(r_pin, OUTPUT);
        pinMode(g_pin, OUTPUT);
        pinMode(b_pin, OUTPUT);
    }
    void set(u8 r, u8 g, u8 b) {
        color[0] = r;
        color[1] = g;
        color[2] = b;
        show();
    }
    void set(u8 *rgb) {
        set(rgb[0],rgb[1],rgb[2]);
    }
    void show() {
        analogWrite(r_pin, red());
        analogWrite(g_pin, green());
        analogWrite(b_pin, blue());
    }
    u8 red() { return color[0];}
    u8 green() { return color[1];}
    u8 blue() { return color[2];}
};