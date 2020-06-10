// Based on this video (6:20):
// https://www.youtube.com/watch?v=QhgSM_tnPM4

// We use Photoshop scaling:
// - Hue argument is within a range of 0-359
// - Saturation and Value arguments are withing range of 0-100
let hue = 0;
let saturation = 70;
let value = 90;
/*let hue = 200;
let saturation = 70;
let value = 70;*/
/*let hue = 350;
let saturation = 70;
let value = 80;*/

// https://www.sitepoint.com/get-url-parameters-with-javascript/
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let paramHue = urlParams.get('h');
let paramSaturation = urlParams.get('s');
let paramValue = urlParams.get('v');
if (paramHue != null) hue = paramHue;
if (paramSaturation != null) saturation = paramSaturation;
if (paramValue != null) value = paramValue;

let rgb, color;

window.onload = InitHueShifting;

let draw;

let hueChange, saturationChange, valueChange;

let amountOfColors = 7; // 7 is normal
let baseAmountOfColors = 7;
let rectWidth = 40;
let rectHeight = 40;

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
	    .size(2*amountOfColors*rectWidth + rectWidth, rectHeight);
	
	/*let distanceToMaxValue = 100 - value;
	let distanceToMinValue = value;
	//let amountStepsToMaxValue = distanceToMaxValue / valueChange;
	//let amountStepsToMinValue = distanceToMinValue / valueChange;
	let scale = distanceToMaxValue / 100;
	valueChange = baseValueChange * scale;*/
	
	//hue = mod(hue+hueChange*amountOfColors, 360);
	//saturation += saturationChange*amountOfColors;
	//value += valueChange*amountOfColors;
	
	/*for (i = -amountOfColors; i < amountOfColors; i++) {
		hue = mod(hue-hueChange, 360);
		saturation -= saturationChange;
		value -= valueChange;
		
		rgb = hsvToRgb(hue, saturation, value);
		color = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
		
		draw.rect(rectWidth, rectHeight).attr({ fill: color })
		    .move(amountOfColors*rectWidth + rectWidth*i, 0);
		
		// If brigthness very low, stop
		//if (inRange(value, 10, 90)) break;
		//if (value <= stopAtValue) break;
	}*/
	
	DrawColorRamp(hue, saturation, value);
	
	LoadSampleImage();
}

// parameters are hue, saturation, value of base (= middle) color
function DrawColorRamp(hue, saturation, value) {
	// Draw base color
	rgb = hsvToRgb(hue, saturation, value);
	
	color = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
	draw.rect(rectWidth, rectHeight).attr({ fill: color })
	    .move(amountOfColors*rectWidth, 0);
	
	// Draw rest
	let colorVariationScale = baseAmountOfColors / amountOfColors;
	
	let baseHue = hue;
	let baseSaturation = saturation;
	let baseValue = value;
	
	// linear change for saturation and value
	// -> TODO: gauss distribution would fit better than linear
	// hue has not linear change
	
	hueChange = 10;
	saturationChange = 10; // -- few steps -> higher saturationChange
	valueChange = 15;
	
	ApplyScale(colorVariationScale);
	
	for (i = -1; i > -amountOfColors; i--) {
		hue = mod(hue+hueChange, 360);
		saturation -= saturationChange;
		value += valueChange;
		
		DrawRectangle(hue, saturation, value);
	}
	
	hue = baseHue;
	saturation = baseSaturation;
	value = baseValue;
	
	hueChange = 23;
	saturationChange = 10; // -- lot of steps -> lower saturationChange
	valueChange = 15;
	
	ApplyScale(colorVariationScale);
	
	for (i = 1; i < amountOfColors; i++) {
		hue = mod(hue-hueChange, 360);
		saturation -= saturationChange;
		value -= valueChange;
		
		DrawRectangle(hue, saturation, value);
	}
}

function ApplyScale(scale) {
	hueChange *= scale;
	saturationChange *= scale;
	valueChange *= scale;
}

function DrawRectangle(hue, saturation, value) {
	rgb = hsvToRgb(hue, saturation, value);
	color = "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")";
	
	draw.rect(rectWidth, rectHeight).attr({ fill: color })
		.move(amountOfColors*rectWidth + rectWidth*i, 0);
}

// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
// https://stackoverflow.com/questions/19262141/resize-image-with-javascript-canvas-smoothly
//let canvasPadding = 10;
let imgScale = 2.0;
//let maxScale = 6.0;
let img;
let svgImage;
let init = false;

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
		RepaintImage();
	};
}

function RepaintImage() {
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
	
	if (!init) {
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				pos = x + y*width;
				
				svgImage.rect(Math.ceil(imgScale), Math.ceil(imgScale))
					.attr({ fill: imageColors[pos] })
					.move(Math.floor(x * imgScale), Math.floor(y * imgScale));
			}
		}
		init = true;
	}
	else {
		let pos;
		let width = img.width;
		let height = img.height;
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
		default: '#e64545',

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
		DrawColorRamp(color.h, color.s, color.v);
	})/*.on('save', (color, instance) => {
		instance.hide();
	}).*/
}