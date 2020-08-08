#include <EspRC.h>

void setup() {
    EspRC.begin(1);
    EspRC.sub("garden/temp", [](String value) {

    })
    EspRC.pub("garden/temp", 20);
}

void loop() {

}