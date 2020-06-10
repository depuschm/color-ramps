// Based on this video (6:20):
// https://www.youtube.com/watch?v=QhgSM_tnPM4

// We use Photoshop scaling:
// - Hue argument is within a range of 0-359
// - Saturation and Value arguments are withing range of 0-100
let baseHue;
let baseSaturation;
let baseValue;

let hues;
let saturations;
let values;

let currentHues = [];
let currentSaturations = [];
let currentValues = [];

let hueChanges = [];
let saturationChanges = [];
let valueChanges = [];

let amountOfColorsPerSide = 4;
let baseamountOfColorsPerSide = 4;
let amountOfColors = 1 + amountOfColorsPerSide*2;
let rectWidth = 40;
let rectHeight = 40;

let rgb;
let baseColor;
let color;

SetBaseColor();

/*let hue = 180;
let saturation = 21;
let value = 59;*/
/*let hue = 92;
let saturation = 56;
let value = 52;*/
/*let hue = 0;
let saturation = 70;
let value = 90;*/
/*let hue = 200;
let saturation = 70;
let value = 70;*/
/*let hue = 350;
let saturation = 70;
let value = 80;*/

// https://www.sitepoint.com/get-url-parameters-with-javascript/
/*const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let paramHue = urlParams.get('h');
let paramSaturation = urlParams.get('s');
let paramValue = urlParams.get('v');
if (paramHue != null) hue = paramHue;
if (paramSaturation != null) saturation = paramSaturation;
if (paramValue != null) value = paramValue;*/

let draw;

/*let length = amountOfColors;
let hues = [];
let saturations = [];
let values = [];
hues.length = length;
saturations.length = length;
values.length = length;*/

let colorsHex, colorsHSV;
let colorRampElements = [];
let initColorRamp = false;

window.onload = InitHueShifting;

function SetBaseColor() {
	currentHues.length = amountOfColors;
	currentSaturations.length = amountOfColors;
	currentValues.length = amountOfColors;
	
	hueChanges.length = amountOfColors;
	saturationChanges.length = amountOfColors;
	valueChanges.length = amountOfColors;

	hues =        [0, 190, 174, 150, 119, 100, 75, 60, 0];
	saturations = [0, 48, 50, 67, 47, 60, 67, 43, 0]
	values =      [0, 20, 25, 38, 49, 63, 75, 88, 100];
	
	hueChanges[0] = hues[0];
	saturationChanges[0] = saturations[0];
	valueChanges[0] = values[0];
	for (let i = 1; i < amountOfColors; i++) {
		hueChanges[i] = hues[i] - hues[i-1];
		saturationChanges[i] = saturations[i] - saturations[i-1];
		valueChanges[i] = values[i] - values[i-1];
	}
	
	baseHue = hues[amountOfColorsPerSide];
	baseSaturation = saturations[amountOfColorsPerSide];
	baseValue = values[amountOfColorsPerSide];
	
	rgb = hsvToRgb(baseHue, baseSaturation, baseValue);
	baseColor = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
}

function SetRampColors(hue, saturation, value) {
	// Initialize hue, saturation and value
	//saturations = [20, 40, 60, 70, 75, 60, 45, 30, 15]
	//values = [15, 30, 45, 60, 70, 80, 90, 95, 100];
	
	//saturation = saturations[amountOfColorsPerSide];
	//value = values[amountOfColorsPerSide];
	
	/*for (i = 0; i <= amountOfColorsPerSide; i++) {
		hue = mod(hue+hueChange, 360);
	}*/
	/*hue = mod(hue+hueChange*(amountOfColorsPerSide+1), 360);
	saturation -= saturationChange * (amountOfColorsPerSide+1);
	value += valueChange * (amountOfColorsPerSide+1);*/
	/*hueChange = 20;
	let startHue = mod(hue-hueChange*amountOfColorsPerSide, 360);
	let startSaturation = saturation-saturationChange * amountOfColorsPerSide;
	let startValue = value-valueChange * amountOfColorsPerSide;*/
	//let startSaturation = saturations[0];
	//let startValue = values[0];
	
	// Initiatialize hues, saturations and values (color ramp colors)
	/*for (let i = 0; i < amountOfColors; i++) {
		hues[i] = startHue + hueChange*i;
	}
	//hues = [100, 120, 140, 160, 180, 200, 220, 240, 260];
	saturations = [20, 40, 60, 70, 75, 60, 45, 30, 15]
	values = [15, 30, 45, 60, 70, 80, 90, 95, 100];*/
	
	currentHues[0] = mod(hue - hues[amountOfColorsPerSide], 360);
	currentSaturations[0] = saturation - saturations[amountOfColorsPerSide];
	currentValues[0] = value - values[amountOfColorsPerSide];
	for (let i = 1; i < amountOfColors; i++) {
		currentHues[i] = currentHues[i-1] + hueChanges[i];
		currentSaturations[i] = currentSaturations[i-1] + saturationChanges[i];
		currentValues[i] = currentValues[i-1] + valueChanges[i];
	}
	
	// Clamp values to valid interval (0-100)
	//saturations = saturations.map(function(x) { return clamp(x, 0, 100); });
	//values = values.map(function(x) { return clamp(x, 0, 100); });
	
	//hues = hues.map(function(x) { return x * hue/100; });
	//saturations = saturations.map(function(x) { return x * saturation/100; });
	//values = values.map(function(x) { return x * value/100; });
	
	// Functions:
	// hues[i] = 20*i
	// saturations[i] = ?
	// values[i] = ?
}

// https://stackoverflow.com/questions/11409895/whats-the-most-elegant-way-to-cap-a-number-to-a-segment
function clamp(num, min, max) {
	return num <= min ? min : num >= max ? max : num;
}

// Uses SVG.js
// Link: https://svgjs.com/docs/3.0/
function InitHueShifting() {
	CreateColorPicker();
	
	/*let hueChange = 20;
	let saturationChange = 5;
	let valueChange = 20;*/
	
	//let stopAtValue = 10;
	
	// Create SVG node
	draw = SVG().addTo('colorramp')
	    .size(amountOfColors*rectWidth, rectHeight);
	
	/*let distanceToMaxValue = 100 - value;
	let distanceToMinValue = value;
	//let amountStepsToMaxValue = distanceToMaxValue / valueChange;
	//let amountStepsToMinValue = distanceToMinValue / valueChange;
	let scale = distanceToMaxValue / 100;
	valueChange = baseValueChange * scale;*/
	
	//hue = mod(hue+hueChange*amountOfColorsPerSide, 360);
	//saturation += saturationChange*amountOfColorsPerSide;
	//value += valueChange*amountOfColorsPerSide;
	
	/*for (i = -amountOfColorsPerSide; i < amountOfColorsPerSide; i++) {
		hue = mod(hue-hueChange, 360);
		saturation -= saturationChange;
		value -= valueChange;
		
		rgb = hsvToRgb(hue, saturation, value);
		color = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
		
		draw.rect(rectWidth, rectHeight).attr({ fill: color })
		    .move(amountOfColorsPerSide*rectWidth + rectWidth*i, 0);
		
		// If brigthness very low, stop
		//if (inRange(value, 10, 90)) break;
		//if (value <= stopAtValue) break;
	}*/
	
	DrawColorRamp(baseHue, baseSaturation, baseValue);
	
	LoadSampleImage();
	
	ShowChart();
}

// parameters are hue, saturation, value of base (= middle) color
function DrawColorRamp(hue, saturation, value) {
	SetRampColors(hue, saturation, value);
	
	colorsHex = [];
	colorsHSV = [];
	
	// Draw color ramp
	//let colorVariationScale = baseamountOfColorsPerSide / amountOfColorsPerSide;
	
	//let baseHue = hue;
	//let baseSaturation = saturation;
	//let baseValue = value;
	
	// linear change for saturation and value
	// -> TODO: gauss distribution would fit better than linear
	// hue has not linear change
	
	//hueChange = 10;
	//saturationChange = 10; // -- few steps -> higher saturationChange
	//valueChange = 15;
	
	//ApplyScale(colorVariationScale);
	
	// Draw color ramp (left part)
	/*for (let i = -amountOfColorsPerSide; i <= -1; i++) {
		DrawRectangle(i);
	}*/
	
	//hue = baseHue;
	//saturation = baseSaturation;
	//value = baseValue;
	
	// Draw base color (middle)
	//DrawRectangle(0);
	
	//hueChange = 23;
	//saturationChange = 10; // -- lot of steps -> lower saturationChange
	//valueChange = 15;
	
	//ApplyScale(colorVariationScale);
	
	// Continue color ramp (right part)
	/*for (let i = 1; i <= amountOfColorsPerSide; i++) {
		DrawRectangle(i);
	}*/
	
	for (let i = 0; i < amountOfColors; i++) {
		DrawRectangle(i);
	}
	
	initColorRamp = true;
}

/*function ApplyScale(scale) {
	hueChange *= scale;
	saturationChange *= scale;
	valueChange *= scale;
}*/

function DrawRectangle(i) {
	let hue = mod(currentHues[i], 360);
	let saturation = currentSaturations[i];
	let value = currentValues[i];
	
	rgb = hsvToRgb(hue, saturation, value);
	color = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
	
	if (!initColorRamp) {
		rampElement = draw.rect(rectWidth, rectHeight)
			.move(i*rectWidth, 0)
			.fill(color);
		colorRampElements.push(rampElement);
	} else {
		colorRampElements[i].fill(color);
	}
	
	hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
	colorsHex.push(hex);
	colorsHSV.push({hue: hue, saturation: saturation, value: value});
}

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
// https://stackoverflow.com/questions/19262141/resize-image-with-javascript-canvas-smoothly
//let canvasPadding = 10;
let imgScale = 2.0;
//let maxScale = 6.0;
let img;
let svgImage;
let initImage = false;

function LoadSampleImage() {
	// Load image
	img = new Image();
	img.src = 'img/dragon.png';
	
	svgImage = SVG().addTo('svgimage');
	//	.size(img.width * imgScale, img.height * imgScale);
	
	//let canvas = document.getElementById('imgCanvas');
	//let ctx = canvas.getContext('2d');
	
	img.onload = function() {
	  // set size proportional to image
	  /*let canvasWidth = img.width + 2*canvasPadding;
	  let canvasHeight = img.height + 2*canvasPadding;
	  
	  ctx.canvas.width = canvasWidth;
	  ctx.canvas.height = canvasWidth * (canvasHeight / canvasWidth);*/
	  
	  // Draw image
	  /*ctx.drawImage(img, 0, 0);
	  img.style.display = 'none';
	  console.log(ctx.getImageData(0, 0, 1, 1).data);*/
	  
	  ResizeImage();
	  RepaintImage();
	};
	
	// Initialize slider
	let slider = document.getElementById("imageScale");
	slider.value = imgScale * 100;

	// Update the current slider value (each time you drag the slider handle)
	slider.oninput = function() {
		imgScale = this.value / 100;
		
		/*svgImage.each(function(i, children) {
			this.transform({ scale: imgScale })
		});*/
		ResizeImage();
	};
}

function ResizeImage() {
	svgImage
		.size(img.width * imgScale, img.height * imgScale);
	
	/*let imageData = ctx.getImageData(canvasPadding, canvasPadding,
		canvas.width - canvasPadding, canvas.height - canvasPadding);
	let data = imageData.data;
	
	for (let i = 0; i < data.length; i += 4) {
      let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
	  
      data[i]     = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
	
	ctx.putImageData(imageData, canvasPadding, canvasPadding);*/
	let pos;
	let width = img.width;
	let height = img.height;
	
	if (!initImage) {
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				pos = x + y*width;
				
				svgImage.rect(Math.ceil(imgScale), Math.ceil(imgScale))
					.move(Math.floor(x * imgScale), Math.floor(y * imgScale))
					.fill(imageColors[pos]);
			}
		}
		initImage = true;
	}
	else {
		let x = 0;
		let y = 0;
		let i = 0;
		
		svgImage.each(function(i, children) {
			x = i % width;
			y = Math.floor(i / width);
			
			this.size(Math.ceil(imgScale), Math.ceil(imgScale))
				.move(Math.floor(x * imgScale), Math.floor(y * imgScale));
			i++;
		});
	}
}

function RepaintImage() {
	// Replace color array values
	arrayLength = imageColorsChange.length;
	for (let i = 0; i < arrayLength; i++) {
		if (imageColorsChange[i][0] != '#') {
			imageColors[i] = colorsHex[imageColorsChange[i]];
		}
	}
	
	// Repaint image
	svgImage.each(function(i, children) {
		this.fill(imageColors[i]);
	});
}

/*function inRange(n, min, max) {
	return n >= min && n <= max;
}*/

// https://stackoverflow.com/questions/4467539/javascript-modulo-gives-a-negative-result-for-negative-numbers
function mod(n, m) {
	return ((n % m) + m) % m;
}

// https://mika-s.github.io/javascript/colors/hsl/2017/12/05/generating-random-colors-in-javascript.html
/*function generateHslaColors (saturation, lightness, alpha, amount) {
  let colors = []
  let huedelta = Math.trunc(360 / amount)

  for (let i = 0; i < amount; i++) {
    let hue = i * huedelta
    colors.push(`hsla(${hue},${saturation}%,${lightness}%,${alpha})`)
  }

  return colors
}*/

// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/

/**
* HSV to RGB color conversion
* From: https://gist.github.com/eyecatchup/9536706
*
* H runs from 0 to 360 degrees
* S and V run from 0 to 100
*
* Ported from the excellent java algorithm by Eugene Vishnevsky at:
* http://www.cs.rit.edu/~ncs/color/t_convert.html
*/
function hsvToRgb(h, s, v) {
    var r, g, b;
    var i;
    var f, p, q, t;
     
    // Make sure our arguments stay in-range
    h = Math.max(0, Math.min(360, h));
    s = Math.max(0, Math.min(100, s));
    v = Math.max(0, Math.min(100, v));
     
    // We accept saturation and value arguments from 0 to 100 because that's
    // how Photoshop represents those values. Internally, however, the
    // saturation and value are calculated from a range of 0 to 1. We make
    // That conversion here.
    s /= 100;
    v /= 100;
     
    if(s == 0) {
        // Achromatic (grey)
        r = g = b = v;
        return [
            Math.round(r * 255), 
            Math.round(g * 255), 
            Math.round(b * 255)
        ];
    }
     
    h /= 60; // sector 0 to 5
    i = Math.floor(h);
    f = h - i; // factorial part of h
    p = v * (1 - s);
    q = v * (1 - s * f);
    t = v * (1 - s * (1 - f));
     
    switch(i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
     
        case 1:
            r = q;
            g = v;
            b = p;
            break;
     
        case 2:
            r = p;
            g = v;
            b = t;
            break;
     
        case 3:
            r = p;
            g = q;
            b = v;
            break;
     
        case 4:
            r = t;
            g = p;
            b = v;
            break;
     
        default: // case 5:
            r = v;
            g = p;
            b = q;
    }
     
    return [
        Math.round(r * 255), 
        Math.round(g * 255), 
        Math.round(b * 255)
    ];
}

// https://github.com/Simonwep/pickr
function CreateColorPicker() {
	// Simple example, see optional options for more configuration.
	const pickr = Pickr.create({
		el: '.color-picker',
		theme: 'classic', // or 'monolith', or 'nano'
		defaultRepresentation: 'HSVA',
		default: baseColor,

		swatches: [
		    'hsla(0, 75, 58, 1)',
			'hsla(24, 75, 58, 1)',
			'hsla(48, 75, 58, 1)',
			'hsla(72, 75, 58, 1)',
			'hsla(96, 75, 58, 1)',
			'hsla(120, 75, 58, 1)',
			'hsla(144, 75, 58, 1)',
			'hsla(168, 75, 58, 1)',
			'hsla(192, 75, 58, 1)',
			'hsla(216, 75, 58, 1)',
			'hsla(240, 75, 58, 1)',
			'hsla(264, 75, 58, 1)',
			'hsla(288, 75, 58, 1)',
			'hsla(312, 75, 58, 1)',
			'hsla(336, 75, 58, 1)'
		],

		components: {

			// Main components
			preview: true,
			hue: true,

			// Input / output Options
			interaction: {
				hex: true,
				rgba: true,
				hsla: true,
				hsva: true,
				cmyk: true,
				input: true
				//save: true
			}
		}
	});
	
	pickr.on('change', (color, instance) => {
		instance.applyColor();
		let colorH = color.h != 360 ? color.h : 0;
		DrawColorRamp(colorH, color.s, color.v);
		RepaintImage();
	})/*.on('save', (color, instance) => {
		instance.hide();
	}).*/
}

// Example from: https://www.chartjs.org/samples/latest/charts/line/basic.html
// Dataset from: https://www.slynyrd.com/blog/2018/1/10/pixelblog-1-color-palettes
function ShowChart() {
	let colorIndices = [];
	for (let i = 0; i < amountOfColors; i++) {
		colorIndices[i] = i;
	}
	
	//let colorHues = [];
	let colorSaturations = [];
	let colorBrightness = [];
	for (let i = 0; i < amountOfColors; i++) {
		//colorHues[i] = Math.round(colorsHSV[i].hue / 360 * 100);
		colorSaturations[i] = colorsHSV[i].saturation;
		colorBrightness[i] = colorsHSV[i].value;
	}

	let config = {
		type: 'line',
		data: {
			labels: colorIndices,
			datasets: [/*{
				label: 'Hue',
				backgroundColor: window.chartColors.red,
				borderColor: window.chartColors.red,
				data: colorHues,
				fill: false,
			},*/ {
				label: 'Saturation',
				backgroundColor: window.chartColors.green,
				borderColor: window.chartColors.green,
				data: colorSaturations,
				fill: false,
			}, {
				label: 'Brightness',
				fill: false,
				backgroundColor: window.chartColors.blue,
				borderColor: window.chartColors.blue,
				data: colorBrightness,
			}]
		},
		options: {
			responsive: true,
			title: {
				display: true,
				text: 'Change of HSV in color ramp'
			},
			tooltips: {
				mode: 'index',
				intersect: false,
			},
			hover: {
				mode: 'nearest',
				intersect: true
			},
			scales: {
				xAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Color index'
					}
				}],
				yAxes: [{
					display: true,
					scaleLabel: {
						display: true,
						labelString: 'Value (in %)'
					},
					/*ticks: {
						min: 0,
						max: 100,
					}*/
				}]
			}
		}
	};
	
	// ShowGraph
	let ctx = document.getElementById('canvas').getContext('2d');
	window.myLine = new Chart(ctx, config);
}