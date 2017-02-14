// this component is where 80% of the work for this project occurred so i'll be documenting it the most.

import Ember from 'ember';

export default Ember.Component.extend({
  
  //filte values are passed along to the filter selection dropdown component.
  filters: ['Light Contrast', 'Heavy Contrast', 'Light Blur', 'Heavy Blur', 'Black & White', 'Hemingway', 'Old Boot', 'Love', 'Lomo', 'Hazy Days', 'Vintage'],
  activeEditor: '',
  
  //these two were necessary for state management of the editiing bars
  editorActive: 'false',
  editorTarget: 'header',
  
  //bringing in the image loading object from the unsplash service.
  unsplash: Ember.inject.service(),
  
  //these are actions called directly in the postcard component. The clear filters sets the filter attribute to blank and the two lines
  //under download image are all that is needed to turn the canvas into a PNG image. This only works with modern browsers (> iE8) and would 
  //need to be polyfilled to support older things in production.
  actions: {
    clearFilters() {
      this.set('model.postcard.filter', '');
    },
    downloadImage() {
      let canvas = this.get('cvs');
      window.open(canvas.toDataURL('png'));
    },
  },
  
  //the loading value is what i use to bring in the loading spinner.
  
  loading: null,
  
  
  //declaring the canvas here allows me to access it in different functions within code here.
  cvs: Ember.computed(function(){
    let self = this;
    let canvas = new fabric.CanvasEx('image-layer'); //this turns the <canvas> element into a fabric canvas element. 
    let sizing = this.get('model.postcard.sizing');
    this.sizeCanvas(sizing, canvas); //takes the sizing info set on the postcard and resizes the canvas accordingly
    
    canvas.observe('object:moving', function (e) {
      
      
      //the following logic stops the elements from being dragged outside of the canvas. The first bit checks 
      //if the object is larger than the canvas and scales accordingly. The second if checks the top and left (which are defined on canvas objects)
      //and the third checks the right and bottom but added the hight of the cavas to the logic used in the second.
      var obj = e.target;
      if(obj.getHeight() > obj.canvas.height || obj.getWidth() > obj.canvas.width){
        obj.setScaleY(obj.originalState.scaleY);
        obj.setScaleX(obj.originalState.scaleX);		
      }
      obj.setCoords();
        
      if(obj.getBoundingRect().top - (obj.cornerSize / 2) < 0 || obj.getBoundingRect().left -  (obj.cornerSize / 2) < 0) {
        obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top + (obj.cornerSize / 2));
        obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left + (obj.cornerSize / 2));    
      }
      if(obj.getBoundingRect().top+obj.getBoundingRect().height + obj.cornerSize  > obj.canvas.height || obj.getBoundingRect().left+obj.getBoundingRect().width + obj.cornerSize  > obj.canvas.width) {
        obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top - obj.cornerSize / 2);
        obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left - obj.cornerSize /2);    
      }
    });
    
    //This removes the editors when you deselect any of the text elements
    canvas.on('selection:cleared', function() {
      self.set('editorActive', 'false');
      self.removeEditor();
    });
    
    return canvas;
  }),
  
  // This is the canvas header element which is a fabric textbox object. The large group of lets at the beginning takes the 
  // values defined in the header model and attaches them to the fabric header object on the canvas.
  header: Ember.computed(function(){
    let self = this;
    let canvas = this.get('cvs');
    let font = this.get('model.header.font');
    let colour = this.get('model.header.colour');
    let alignment = this.get('model.header.alignment');
    let weight = this.get('model.header.weight');
    let size = this.get('model.header.size');
    let italicize = this.get('model.header.italicize');
    let text = this.get('model.header.text');
    let width = this.get('model.header.width');
    let top = this.get('model.header.top');
    let left = this.get('model.header.left');
    
    var header = new fabric.Textbox(text, { 
      fontFamily: font,
      fontSize: size,
      fill: colour,
      stroke: colour,
      fontWeight: weight,
      hasRotatingPoint: false,
      textAlign: alignment,
      width: width,
      fontStyle: italicize,
      transparentCorners: false,
      top: top, 
      left: left,
      editable: false,
      cursorColor: colour,
      cursorWidth: 3,
    });
    
    
    //this hides the editor while the text is being moved
    header.on('moving', function(e) {
      self.removeEditor();
    });
    
    //there's no mouse:up event on Fabric objects, so i had to rely on the one on the parent canvas. 
    //the active editor and editor active are required to make bring back the correct text editor 
    //upon mouse-up. 
    
    canvas.on('mouse:up', function(e) {
      let activeEditor = self.get('activeEditor');
      let editorActive = self.get('editorActive');
      if(editorActive === 'true'){
        if(activeEditor === "header"){
          self.loadEditor(header, 'header');
        } else {
        }
      }
    });
    
    
    header.on('selected', function(){
      self.set('editorActive', 'true');
      self.set('activeEditor', 'header');
      self.loadEditor(header, "header");
    });
    
    //I didn't want people to be changing the element when they were editing text so i 
    //locked down some of the functionality that is avabilable to them.
    header.on('object:dblclick', function() {
      self.set('editorActive', 'false');
      self.removeEditor();
      self.set('activeEditor', '');
      header.editable = true;
      header.hascontrols = false;
    });
    return header;
  }),
  
  //same set of logic as header above but for the body element
  
  body: Ember.computed(function(){
    let self = this;
    let canvas = this.get('cvs');
    let font = this.get('model.body.font');
    let colour = this.get('model.body.colour');
    let alignment = this.get('model.body.alignment');
    let weight = this.get('model.body.weight');
    let size = this.get('model.body.size');
    let italicize = this.get('model.body.italicize');
    let text = this.get('model.body.text');
    let width = this.get('model.body.width');
    let top = this.get('model.body.top');
    let left = this.get('model.body.left');
    
    var body = new fabric.Textbox(text, { 
      fontFamily: font,
      fontSize: size,
      fill: colour,
      stroke: colour,
      fontWeight: weight,
      hasRotatingPoint: false,
      textAlign: alignment,
      width: width,
      fontStyle: italicize,
      transparentCorners: false,
      top: top, 
      left: left,
      editable: false,
      cursorColor: colour,
      cursorWidth: 3,
    });
    
    body.on('moving', function(e) {
      self.removeEditor();
    });
    
    body.on('selected', function(){
      self.set('editorActive', 'true');
      self.set('activeEditor', 'body');
      self.loadEditor(body, "body");
    });
    
    canvas.on('mouse:up', function(e) {
      let activeEditor = self.get('activeEditor');
      let editorActive = self.get('editorActive');
      if(editorActive === "true"){
        if(activeEditor === "body"){
          self.loadEditor(body, 'body');
        } else {
        }  
      }
    });
    
    body.on('object:dblclick', function() {
      self.removeEditor();
      self.set('editorActive', 'false');
      self.set('activeEditor', '');
      body.editable = true;
      body.hascontrols = false;
    });
    return body;
  }),
  
  //same set of logic as header and body above but for the caption.
  
  caption: Ember.computed(function(){
    let self = this;
    let canvas = this.get('cvs');
    let font = this.get('model.caption.font');
    let colour = this.get('model.caption.colour');
    let alignment = this.get('model.caption.alignment');
    let weight = this.get('model.caption.weight');
    let size = this.get('model.caption.size');
    let italicize = this.get('model.caption.italicize');
    let text = this.get('model.caption.text');
    let width = this.get('model.caption.width');
    let top = this.get('model.caption.top');
    let left = this.get('model.caption.left');
    
    var caption = new fabric.Textbox(text, { 
      fontFamily: font,
      fontSize: size,
      fill: colour,
      stroke: colour,
      fontWeight: weight,
      hasRotatingPoint: false,
      textAlign: alignment,
      width: width,
      fontStyle: italicize,
      transparentCorners: false,
      top: top, 
      left: left,
      editable: false,
      cursorColor: colour,
      cursorWidth: 3,
    });
    
    caption.on('moving', function(e) {
      self.removeEditor();
    });
    
    caption.on('selected', function(){
      self.set('editorActive', 'true');
      self.set('activeEditor', 'caption');
      self.loadEditor(caption, "caption");
    });
    
    canvas.on('mouse:up', function(e) {
      let activeEditor = self.get('activeEditor');
      let editorActive = self.get('editorActive');
      if(editorActive === "true"){
        if(activeEditor === "caption"){
          self.loadEditor(caption, 'caption');
        } else {
        }  
      }
    });
    
    caption.on('object:dblclick', function() {
      self.removeEditor();
      self.set('editorActive', 'false');
      self.set('activeEditor', '');
      caption.editable = true;
      caption.hascontrols = false;
    });
    return caption;
  }),
  
  //Ember observers are functions that watch for value changes on the model and fire whenever it's modified.
  //here i'm turning the loading screen on, getting the filter value (text string) and passing it down to the addfilter function.
  filterChanged: Ember.observer('model.postcard.filter', function(){
    this.set('loading', null);
    let filter = this.get('model.postcard.filter');
    this.addFilter(filter);
  }),
  
  //These three functions watch all of the values of the header, body and caption and rerender the applicable text whenever it is modified.
  
  headerChanged: Ember.observer('model.header.font', 'model.header.colour', 'model.header.weight', 'model.header.alignment', 'model.header.size', 'model.header.italicize', function(){
    let canvas = this.get('cvs');
    let header = this.get('header');
    header.fontWeight = this.get('model.header.weight');
    header.fontFamily = this.get('model.header.font');
    header.fontSize = this.get('model.header.size');
    header.stroke = this.get('model.header.colour');
    header.fill = this.get('model.header.colour');
    header.fontStyle = this.get('model.header.italicize');
    header.textAlign = this.get('model.header.alignment');
    canvas.renderAll();
  }),
  
  bodyChanged: Ember.observer('model.body.font', 'model.body.colour', 'model.body.weight', 'model.body.alignment', 'model.body.size', 'model.body.italicize', function(){
    let canvas = this.get('cvs');
    let body = this.get('body');
    body.fontWeight = this.get('model.body.weight');
    body.fontFamily = this.get('model.body.font');
    body.fontSize = this.get('model.body.size');
    body.stroke = this.get('model.body.colour');
    body.fill = this.get('model.body.colour');
    body.fontStyle = this.get('model.body.italicize');
    body.textAlign = this.get('model.body.alignment');
    canvas.renderAll();
  }),
  
  captionChanged: Ember.observer('model.caption.font', 'model.caption.colour', 'model.caption.weight', 'model.caption.alignment', 'model.caption.size', 'model.caption.italicize', function(){
    let canvas = this.get('cvs');
    let caption = this.get('caption');
    caption.fontWeight = this.get('model.caption.weight');
    caption.fontFamily = this.get('model.caption.font');
    caption.fontSize = this.get('model.caption.size');
    caption.stroke = this.get('model.caption.colour');
    caption.fill = this.get('model.caption.colour');
    caption.fontStyle = this.get('model.caption.italicize');
    caption.textAlign = this.get('model.caption.alignment');
    canvas.renderAll();
  }),
  
  //this is watching for changes from the image preview component and re-draws the canvas when you choose a new one.
  
  imageChanged: Ember.observer('model.postcard.url', function(){
    let canvas = this.get('cvs');
    let imageObject = canvas.getObjects('image')[0];
    // the way filters are done in this component require hidden images to load. These need to be reset each time we choose a new picture.
    Ember.$('.hiddenImages').remove();
    canvas.remove(imageObject);
    this.drawContent();
  }),
  
  //These three functions watch for the visibility of the element and either draw or remove it as necessary.
  
  headerVisiblityChanged: Ember.observer('model.header.visible', function(){
    let canvas = this.get('cvs');
    let header = this.get('header');
    let visibility = this.get('model.header.visible');
    this.addOrRemoveText(header, visibility, canvas);
  }),
  
  bodyVisiblityChanged: Ember.observer('model.body.visible', function(){
    let canvas = this.get('cvs');
    let body = this.get('body');
    let visibility = this.get('model.body.visible');
    this.addOrRemoveText(body, visibility, canvas);
  }),
  
  captionVisiblityChanged: Ember.observer('model.caption.visible', function(){
    let canvas = this.get('cvs');
    let caption = this.get('caption');
    let visibility = this.get('model.caption.visible');
    this.addOrRemoveText(caption, visibility, canvas);
  }),
  
  addOrRemoveText(text, visibility, canvas) {
    if(visibility == 'true') {
      canvas.add(text);
    } else {
      canvas.remove(text);
    }
  },
  
  canvasSizeChange: Ember.observer('model.postcard.sizing', function(){
    this.set('loading', 'loading');
    let canvas = this.get('cvs');
    let sizing = this.get('model.postcard.sizing');
    let imageObject = canvas.getObjects('image')[0]; //the image can't be defined the same way as the header, caption and body so i need to get in from the canvas each time i modify it.
    this.sizeCanvas(sizing, canvas);
    canvas.centerObject(imageObject);
    this.set('loading', 'loaded');
  }),
  
  didInsertElement(){ //This is the hook provided by Ember to run script after the component loads. 
    this._super(...arguments);
    this.drawContent();
  },
  
  sizeCanvas(size, canvas) {    
    if(size == 'instagram') {
      canvas.setHeight(484);
      canvas.setWidth(484);
    }
    if(size == 'facebook') {
      canvas.setWidth(484);
      canvas.setHeight(242);
    }
    if(size == 'pinterest') {
      canvas.setWidth(484);
      canvas.setHeight(725);
    }
  },
    
  loadEditor(text, element) {
    let top = text.top; //used draw the texteditor element above the text. 
    if(element == 'header') {
      // the first two hide the unused editors. This makes sure only one can be visible at a time.
      let bodyEditor = document.getElementById('body-editor');
      bodyEditor.style.display = 'none'; 
      bodyEditor.style.top = "9000px";
      let captionEditor = document.getElementById('caption-editor');
      captionEditor.style.display = 'none';
      captionEditor.style.top = "9000px";
      let editor = document.getElementById('header-editor');
      editor.style.display = ""; //display the object
      editor.style.left = '28px';
      editor.style.top = `${top+40}px` //put the editor 40px above the text element
    }
    if(element == 'body') {
      let headerEditor = document.getElementById('header-editor');
      headerEditor.style.display = 'none';
      headerEditor.style.top = "9000px";
      let captionEditor = document.getElementById('caption-editor');
      captionEditor.style.display = 'none';
      captionEditor.style.top = "9000px";
      let editor = document.getElementById('body-editor');
      editor.style.display = "";
      editor.style.left = '28px';
      editor.style.top = `${top+40}px`;
    } 
    if(element == 'caption') {
      let headerEditor = document.getElementById('header-editor');
      headerEditor.style.display = 'none';
      headerEditor.style.top = "9000px";
      let bodyEditor = document.getElementById('body-editor');
      bodyEditor.style.display = 'none';
      bodyEditor.style.top = "9000px";
      let editor = document.getElementById('caption-editor');
      editor.style.display = "";
      editor.style.left = '28px';
      editor.style.top = `${top+40}px`;
    }
    
  },
  
  //This hides all of the text editors, and is used when moving the text around.
  removeEditor(element) {
    let headerEditor = document.getElementById('header-editor');
    headerEditor.style.display = 'none';
    headerEditor.style.top = "9000px";
    let bodyEditor = document.getElementById('body-editor');
    bodyEditor.style.display = 'none';
    bodyEditor.style.top = "9000px";
    let captionEditor = document.getElementById('caption-editor');
    captionEditor.style.display = 'none';
    captionEditor.style.top = "9000px";
  },
  
  drawContent(){
    //This is the code to pull everything in intially. 
    let self = this;
    let canvas = this.get('cvs');
    let header = this.get('header');
    let body = this.get('body');
    let caption = this.get('caption');
    let imageFilter = this.get('model.postcard.filter');
    let headerVisibility = this.get('model.header.visible');
    let captionVisibility = this.get('model.caption.visible');
    let bodyVisibility = this.get('model.body.visible');
    let url = this.get('model.postcard.url');


    //This has to run through the promise set in the unsplash service as the image has to be loaded into the 
    //canvas before you run the filter or try adding text. Without using the .then you add the text behind the image 
    //and the filter trys to run on an image that doesn't exist and throws an error.
    this.get('unsplash').backgroundImage(url).then((backgroundImage) => {
        self.set('loading', 'loading'); //this can be a somewhat slow process so we turn on the loader 
        let image = new fabric.Image(backgroundImage, {selectable: false, hoverCursor: 'default'});
        canvas.add(image);
        canvas.centerObject(image);
        if (!imageFilter == '') {
          this.addFilter(imageFilter);
        }
        self.addOrRemoveText(caption, captionVisibility, canvas);
        self.addOrRemoveText(header, headerVisibility, canvas);
        self.addOrRemoveText(body, bodyVisibility, canvas);
        this.set('loading', null); //turn off the loader!
    });
  },
  
  addFilter(filter){
    //canvas elements don't let you export (toDataURL) when you've got images that are loaded from URLS's that are not the same as the 
    //app. To get around this for filtering i'm first creating a hidden image element containing the image from the canvas and then applying 
    //the filter to this. One downside of this approach is that it's adding an image for each filter that you choose, and they're only deleted
    //when you choose different images.
    let canvas = this.get('cvs');
    let hiddenImg = document.createElement('img');
    let imageObject = canvas.getObjects('image')[0];
    let self = this;
    self.set('loading', null);
    hiddenImg.src = imageObject.toDataURL();
    hiddenImg.id = 'target';
    hiddenImg.className = 'hiddenImages';
    hiddenImg.style.display = 'none';
    document.body.appendChild(hiddenImg);
    //caman is another javascript library that allows for easy filtering of images.
    //The light contrast, blur and black and white are filters I built out of their basic settings. The Named filters are defaults with the 
    //libary. The filters are first applied to the hidden image, not directly to the canvas.
    Caman('#target', function(value) {
      this.revert(false);
      switch(filter) {
        case 'Light Contrast':
          this.brightness(-10);
          this.contrast(-15);
          break;
        case 'Heavy Contrast':
          this.brightness(-30);
          this.contrast(-15);
          break;
        case 'Light Blur':
          this.stackBlur(5);
          break;
        case 'Heavy Blur':
          this.stackBlur(20);
          break;
        case 'Black & White':
          this.saturation(-100);
          break;
        case 'Hemingway':
          this.hemingway();
          this.brightness(-20);
          break;
        case 'Old Boot': 
          this.oldBoot();
          break;
        case 'Love':
          this.love();
          break;
        case 'Lomo':
          this.lomo();
          break;
        case 'Hazy Days':
          this.hazyDays();
          break;
        case 'Vintage':
          this.vintage();
          break;
        default:
      }
      //once the filter has run i'm able to set the source of the fabric canvas to the hidden image with the appropriate filter. 
      this.render(function(){
        canvas.getObjects('image')[0].setSrc(document.getElementById('target').toDataURL(), function() {
          canvas.renderAll();
          self.set('loading', 'loaded');
          //i considered removing the hidden image here but the filters then build on each other rather than applying to the base image.
        });
      });
    });
  }
});
