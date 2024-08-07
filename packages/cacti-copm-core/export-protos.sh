#!/bin/bash

DEST_DIR=${1}
MODULE_NAME=${2}

echo "copying prototypes to $DEST_DIR as module $NEW_MODULE"

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cp -R $SCRIPT_DIR/src/main/proto/* $DEST_DIR/src/main/proto

files=$(find $DEST_DIR -name *.proto)

for filename in $files
do
  sed -e "s/copm-core/copm-$MODULE_NAME/g" $filename > $filename.scriptbak
  sed -e "s/copm.core/copm.$MODULE_NAME/g" $filename.scriptbak > $filename
  rm $filename.scriptbak
done

echo "done copying prototypes"