console.log('Shim loading starting...');
if (Modernizr.canvas && Modernizr.canvastext){
  console.log('Canvas element and text supported!');
}
else {
  getScript("shims/canvas.js")
    /* report sucess */
    .done(function(){
      console.log('ExplorerCanvas loaded!');
    })
    /* report fail */
    .fail(function(){
      console.log('ExplorerCanvas failed to load!');
    });
  
}

if (Modernizr.svg){
  console.log('SVG supported!');
}
else {
  getScript("shims/svg.js")
    /* report sucess */
    .done(function(){
      console.log('canvg loaded!');
    })
    /* report fail */
    .fail(function(){
      console.log('canvg failed to load!');
    });
  
}

if (Modernizr.inlinesvg){
  console.log('Inline SVG supported!');
}
else {
  getScript("shims/inlinesvg.js")
    /* report sucess */
    .done(function(){
      console.log('Inline SVG shim loaded!');
    })
    /* report fail */
    .fail(function(){
      console.log('Inline SVG shim failed to load!');
    });
}

if (Modernizr.es5array){
  console.log('ES5 Array features supported!');
}
else {
  getScript("shims/es5array.js")
    /* report sucess */
    .done(function(){
      console.log('ES5 Shim loaded!');
    })
    /* report fail */
    .fail(function(){
      console.log('ES5 Shim failed to load!');
    });
  
}
