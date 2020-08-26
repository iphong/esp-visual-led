

#include "Wire.h"
#include "Adafruit_GFX.h"
#include "gfxfont.h"
#include "Adafruit_ILI9341.h"
#include "Adafruit_ST7735.h"
#include "Adafruit_ST7789.h"
#include "Adafruit_SSD1306.h"
#include "Fonts/FreeSansBold12pt7b.h"
#include "Fonts/FreeSansBold18pt7b.h"
#include "Fonts/FreeMonoBold12pt7b.h"
#include "Fonts/FreeMonoBold18pt7b.h"
#include "SPI.h"

#ifndef __DISPLAY_H__
#define __DISPLAY_H__


#define TFT_CS 0
#define TFT_RST -1
#define TFT_DC 15

namespace Display {

	// Adafruit_ILI9341 tft = Adafruit_ILI9341(15, 16);
	Adafruit_ST7789 tft = Adafruit_ST7789(TFT_CS, TFT_DC, TFT_RST);

	void drawHeader() {
		tft.fillScreen(ST77XX_BLACK);

		tft.setFont(&FreeMonoBold18pt7b);
		tft.setTextColor(ST77XX_MAGENTA);
		tft.setCursor(0, 36);
		tft.println("SDC");
		tft.setFont(&FreeMonoBold12pt7b);
		tft.println("Technology");
	}
	void drawValue(String name, int value, int top) {
		int16_t x, y;
		uint16_t w, h;

		tft.setFont(&FreeMonoBold12pt7b);
		tft.setTextColor(ST77XX_WHITE);

		tft.getTextBounds(name, 0, 0, &x, &y, &w, &h);
		tft.setCursor(0, top + h);
		tft.print(name);
		
		char str[7];
		sprintf(str, "% 7i", value);
		tft.getTextBounds(str, 0, 0, &x, &y, &w, &h);
		tft.fillRect(tft.width() - w, top, w, h + 4, ST77XX_BLACK);
		tft.setCursor(tft.width() - w, top + h);
		tft.print(str);
	}
	void setup() {
		// tft.begin(80000000UL);
		tft.init(240, 240);
		tft.setRotation(0);
		tft.setTextWrap(false);
		drawHeader();
	}
	void loop() {
		
	}
}


#endif
