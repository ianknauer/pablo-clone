import Ember from 'ember';


export default Ember.Component.extend({
  
  filters: ['Light Contrast', 'Heavy Contrast', 'Light Blur', 'Heavy Blur', 'Black & White', 'Hemingway', 'Old Boot', 'Love', 'Lomo', 'Hazy Days', 'Vintage'],
  activeEditor: '',
  editorActive: 'false',
  editorTarget: 'header',
  
  unsplash: Ember.inject.service(),
  
  actions: {
    clearFilters() {
      this.set('model.postcard.filter', '');
    },
    downloadImage() {
      let canvas = this.get('cvs');
      window.open(canvas.toDataURL('png'));
    },
  },
  
  loading: null,
  
  cvs: Ember.computed(function(){
    let self = this;
    let canvas = new fabric.CanvasEx('image-layer');
    let sizing = this.get('model.postcard.sizing');
    this.sizeCanvas(sizing, canvas);
    
    canvas.observe('object:moving', function (e) {
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
    
    canvas.on('selection:cleared', function() {
      self.set('editorActive', 'false');
      self.removeEditor();
    });
    
    return canvas;
  }),
  
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
    
    header.on('moving', function(e) {
      self.removeEditor();
    });
    
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
    
    
    header.on('object:dblclick', function() {
      self.set('editorActive', 'false');
      self.removeEditor();
      self.set('activeEditor', '');
      header.editable = true;
      header.hascontrols = false;
    });
    return header;
  }),
  
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
  
  
  filterChanged: Ember.observer('model.postcard.filter', function(){
    this.set('loading', null);
    let filter = this.get('model.postcard.filter');
    this.addFilter(filter);
  }),
  
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
  
  imageChanged: Ember.observer('model.postcard.url', function(){
    let canvas = this.get('cvs');
    let imageObject = canvas.getObjects('image')[0];
    this.set('')
    Ember.$('.hiddenImages').remove();
    canvas.remove(imageObject);
    this.drawContent();
  }),
  
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
    let imageObject = canvas.getObjects('image')[0];
    this.sizeCanvas(sizing, canvas);
    canvas.centerObject(imageObject);
    this.set('loading', 'loaded');
  }),
  
  didInsertElement(){
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
    let top = text.top;
    if(element == 'header') {
      let bodyEditor = document.getElementById('body-editor');
      bodyEditor.style.display = 'none';
      bodyEditor.style.top = "9000px";
      let captionEditor = document.getElementById('caption-editor');
      captionEditor.style.display = 'none';
      captionEditor.style.top = "9000px";
      let editor = document.getElementById('header-editor');
      editor.style.display = "";
      editor.style.left = '28px';
      editor.style.top = `${top+40}px`;
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

    this.get('unsplash').backgroundImage(url).then((backgroundImage) => {
        self.set('loading', 'loading');
        let image = new fabric.Image(backgroundImage, {selectable: false, hoverCursor: 'default'});
        canvas.add(image);
        canvas.centerObject(image);
        if (!imageFilter == '') {
          this.addFilter(imageFilter);
        }
        self.addOrRemoveText(caption, captionVisibility, canvas);
        self.addOrRemoveText(header, headerVisibility, canvas);
        self.addOrRemoveText(body, bodyVisibility, canvas);
        this.set('loading', null);
    });
  },
  
  addFilter(filter){
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
      this.render(function(){
        canvas.getObjects('image')[0].setSrc(document.getElementById('target').toDataURL(), function() {
          canvas.renderAll();
          self.set('loading', 'loaded');
        });
      });
    });
  }
});
