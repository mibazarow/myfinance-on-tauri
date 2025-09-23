#!/bin/bash

# Создаем иконки нужных размеров
cp ico_1024.png icon_original.png

# Создаем PNG иконки разных размеров
sips -z 32 32 icon_original.png --out 32x32.png
sips -z 128 128 icon_original.png --out 128x128.png
sips -z 256 256 icon_original.png --out 128x128@2x.png

# Создаем иконку для macOS (.icns)
mkdir -p iconset.iconset
sips -z 16 16 icon_original.png --out iconset.iconset/icon_16x16.png
sips -z 32 32 icon_original.png --out iconset.iconset/icon_16x16@2x.png
sips -z 32 32 icon_original.png --out iconset.iconset/icon_32x32.png
sips -z 64 64 icon_original.png --out iconset.iconset/icon_32x32@2x.png
sips -z 128 128 icon_original.png --out iconset.iconset/icon_128x128.png
sips -z 256 256 icon_original.png --out iconset.iconset/icon_128x128@2x.png
sips -z 256 256 icon_original.png --out iconset.iconset/icon_256x256.png
sips -z 512 512 icon_original.png --out iconset.iconset/icon_256x256@2x.png
sips -z 512 512 icon_original.png --out iconset.iconset/icon_512x512.png
sips -z 1024 1024 icon_original.png --out iconset.iconset/icon_512x512@2x.png

# Создаем .icns файл из набора иконок
iconutil -c icns iconset.iconset -o icon.icns

# Создаем .ico файл для Windows (упрощенно)
cp 32x32.png icon.ico

# Очистка
rm -rf iconset.iconset
rm icon_original.png
