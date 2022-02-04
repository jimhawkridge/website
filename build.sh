#!/bin/bash

rsync --recursive --exclude='*.part' --exclude='*.html' --delete src/* public

pushd src
find . -name '*.html' -exec sh -c 'cpp -P -w -D_THISYEAR_=$(date +%Y) $1 > ../public/$1' sh {} \;
popd