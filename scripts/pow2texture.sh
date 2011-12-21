#!/bin/sh 
#
# @param string input
# @param string output
#

input=$1
output=$2
echo "input: $input -> output: $output"

#p2w=`convert rose: ${input} -format "%[fx:2^(ceil(log(w)/log(2)))]" info:`
#p2h=`convert rose: ${input} -format "%[fx:2^(ceil(log(h)/log(2)))]" info:`
p2w=$(convert ${input} -format "%[fx:2^(ceil(log(w)/log(2)))]" info: | awk '{ field = $NF }; END{ print field }')
p2h=$(convert ${input} -format "%[fx:2^(ceil(log(h)/log(2)))]" info: | awk '{ field = $NF }; END{ print field }')

echo "new size: ${p2w} - ${p2h}"

convert ${input} -background transparent -gravity NorthWest -define png:bit-depth=16 -extent ${p2w}x${p2h} ${output}

# ./pow2texture.sh '/mnt/hgfs/C/noboxout/nodejs/radamn/examples/tileset-platformer.png' '/mnt/hgfs/C/noboxout/nodejs/radamn/examples/tileset-platformer-po2.png'