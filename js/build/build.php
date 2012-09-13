<?php
/*
 * api.php
 *
 * Lee todos los archivos que se encuentra listados en api-js.ini
 * y los incluye
 */

$BUILD_FILENAME = 'build.js';
$COMPRESS = false;

$list = file_get_contents('build-js.ini');
header('Content-type: application/x-javascript');
require 'lib/class.JavaScriptPacker.php';

show($list);

/*
 * Concatena en una cada (y la muestra) los contenidos
 * de los achivos listados en cadenas separadas por \n en $list
 */
function show($list)
{
	global $BUILD_FILENAME, $COMPRESS;
	$files = split("\n", $list);

	$full = '';

	foreach($files as $f) {
		if(!$f) continue;
		$f = trim($f);
		$full .= file_get_contents($f);
	}
	if ($COMPRESS) {
		$packer = new JavaScriptPacker($full, 'Normal',true,false);
		$full = $packer->pack();
	}
	file_put_contents($BUILD_FILENAME, $full);

}

?>
