# 1mb Quran
This is a little web app, bringing quran text & its persian translation, with under 1mb data size, to your browser.

This was heavily inspired by [1mb Bible](https://github.com/juliend2/1mbible), both idea & code wise too.

The data was pulled from [tanzil.net](https://tanzil.net)

## Dependencies
- [minify](https://github.com/tdewolff/minify)
- [lessc](https://www.npmjs.com/package/less)
- make

## Build
You may want to check for dependencies first

The build process is fairly easy, you just need to run make:
```bash
$ make
```
It's recommended to check the makefile before running `make` command

## LICENSE
The bz2 data decompression code was licensed to SheetJS LLC, you can find a copy of license in `bz2` folder

Copyright 2023 Mohammad Mohamamdi. All rights reserved.
Use of this source code is governed by a BSD-style
license that can be found in the LICENSE file.
