<?php
/*
 * api.php
 *
 * Lee todos los archivos que se encuentra listados en api.ini
 * y los incluye
 */

$BUILD_FILENAME = '../build.css';

$list = file_get_contents('build-css.ini');
header('Content-type: text/css');

show($list);

/*
 * Concatena en una cada (y la muestra) los contenidos
 * de los achivos listados en cadenas separadas por \n en $list
 */
function show($list)
{
	global $BUILD_FILENAME;
	$files = split("\n", $list);

	$full = '';

	foreach($files as $f) {
		if(!$f) continue;
		$f = trim($f);
		$full.= file_get_contents($f);
	}
	/*
	if (is_file($CSSCACHE_FILENAME)) {
		$full = file_get_contents($CSSCACHE_FILENAME);
	} else {
		$full = css_compress($full);
		file_put_contents($CSSCACHE_FILENAME, $full);
	}
	*/
	file_put_contents($BUILD_FILENAME, $full);
}

function css_compress($css)
{

	$css = preg_replace('!//[^\n\r]+!', '', $css);//comments
	 
	$css = preg_replace('/[\r\n\t\s]+/s', ' ', $css);//new lines, multiple spaces/tabs/newlines
	 
	$css = preg_replace('#/\*.*?\*/#', '', $css);//comments
	 
	$css = preg_replace('/[\s]*([\{\},;:])[\s]*/', '\1', $css);//spaces before and after marks
	 
	$css = preg_replace('/^\s+/', '', $css);//spaces on the begining
 
	return $css;
}
?>
