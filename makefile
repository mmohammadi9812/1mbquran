# Copyright 2023 Mohammad Mohamamdi. All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

DIST_DIR := ./dist
INDEX := index.html
PUG_INDEX := index.pug
SCRIPT_MIN := script.min.js
STYLE_OUT := style.css
STYLE_MIN := style.min.css

MINIFY := minify
ifeq (, $(shell which $(MINIFY)))
	$(error "minify is not available in path, please install it from https://github.com/tdewolff/minify")
endif

PUG := pug
ifeq (, $(shell which $(PUG)))
	$(error "pug is not available in path, please install it from https://pugjs.org")
endif

.PHONY: all rm
all: $(DIST_DIR)/$(INDEX)

rm:
	rm -rf $(DIST_DIR)

$(DIST_DIR):
	mkdir -p $(DIST_DIR)

$(DIST_DIR)/bz2:
	cp -r bz2 $(DIST_DIR)/bz2

$(DIST_DIR)/quran.json.bz2:
	cp quran.json.bz2 $(DIST_DIR)/quran.json.bz2

$(DIST_DIR)/$(STYLE_MIN):
	lessc style.less $(STYLE_OUT)
	$(MINIFY) $(STYLE_OUT) -o $(DIST_DIR)/$(STYLE_MIN)

$(DIST_DIR)/$(SCRIPT_MIN):
	$(MINIFY) script.js -o $(DIST_DIR)/$(SCRIPT_MIN)

$(DIST_DIR)/$(INDEX): $(DIST_DIR)/$(SCRIPT_MIN) $(DIST_DIR)/$(STYLE_MIN) $(DIST_DIR)/bz2 $(DIST_DIR)/quran.json.bz2
	$(PUG) $(PUG_INDEX)
	$(MINIFY) $(INDEX) -o $(DIST_DIR)/$(INDEX)
	ex +%s/.css/.min.css/g -scwq $(DIST_DIR)/$(INDEX)
	ex +%s/script.js/script.min.js/g -scwq $(DIST_DIR)/$(INDEX)
	rm $(INDEX)
