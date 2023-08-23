#!/bin/bash
case "$1" in
    prerelease | patch | minor | major )
        TYPE=$1 ;;
    * )
        TYPE='patch' ;;
    esac
echo "$TYPE"
