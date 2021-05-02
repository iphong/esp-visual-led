#include <Arduino.h>

uint16_t value;
uint32_t start;
uint16_t duration;
bool running = 0;
bool state = 1;

void setup()
{
    Serial.begin(460800);
    pinMode(A0, INPUT);
    pinMode(0, INPUT);
    pinMode(2, OUTPUT);
    pinMode(4, OUTPUT);
    digitalWrite(2, HIGH);
    digitalWrite(4, LOW);
}

void loop()
{
    value = analogRead(A0);
    duration = map(value, 0, 1024, 10000, 1000);

    bool newState = digitalRead(0);
    if (newState != state)
    {
        state = newState;
        if (!running & !state)
        {
            Serial.print(duration);
            running = true;
            start = millis();
            digitalWrite(2, LOW);
            digitalWrite(4, HIGH);
        }
    }

    if (running && millis() - start > duration)
    {
        running = false;
        digitalWrite(4, LOW);
        digitalWrite(2, HIGH);
    }
}
