(function (window,document, undefined){
  if(_$){
	_$.fn.extend({
    	drag:function(bool){
				var self = this[0];
				self.classList.add('draggable');
				event.stopPropagation();
				event.preventDefault();
				var origLeft= parseInt(self.offsetLeft,10);
				var origTop = parseInt(self.offsetTop,10);
				var mdX = event.clientX;
				var mdY = event.clientY;
				var elements = [];
				this.left=0;
				this.top=0;
		if(bool === true){
		  var j = window.localStorage.getItem('userSettings');
		  if(j){
		    self.style.left= j.left;
			self.style.top = j.top;
		  }
		}
		  function drag(bool,cb) {
			self.style.position="absolute";
			self.style.zIndex=999;
		    self.style.left = origLeft + event.clientX - mdX + "px";
			self.style.top = origTop + event.clientY - mdY + "px";
			event.stopPropagation();
		  }
		  function stop(bool){
		    self.classList.remove('draggable');
			self.style.zIndex=0;
		    document.removeEventListener('mousemove',drag,true);
			document.removeEventListener('mouseup',stop,true);
			   if(bool === true){
			    var settings = {
			      left: self.style.left,
			      top: self.style.top
			    };
				self.left=self.style.left;
				self.top=self.style.top;
				var b = JSON.stringify(settings);
				window.localStorage.setItem('userSettings',b);
				}
			event.stopPropagation();
		  }
		   document.addEventListener('mousemove',drag,true);
		   document.addEventListener('mouseup',stop,true);	
		   return {
		     ondrag:function(cb){
                
			 },
			 ondrop:function(cb){
			   if(cb && typeof cb == 'function'){
							l=self.style.left;
							t=self.style.top;
						cb(l,t);			  
					}
			 }
		   
		   };
	},
	    animate:function(opts,speed){
		  for(var item in opts){
			 new minui.fx(this[0],item,opts[item],speed);
			}
			return this;
		},
		resize:function(){
		
		},
		sortable:function(){
		
		},
		autocomplete:function(opts,cb){
		    if(opts.keys == 'array') this.keys = opts.keys;
			if(opts.keys == 'function') this.keys = opts.keys();
			
			
		},
		tip:function(type,dir,cb){
		    if(typeof type == 'string'){
			switch(type){
			case "bubble":break;
			case "annotation":break;
			case "iframe":break;
			case "tip":break;
			 }
			}
			if(typeof dir == 'string'){
			switch(dir){
			case "top":break;
			case "left":break;
			case "right":break;
			case "bottom":break;
			 }
			}
			if(dir || type == 'function'){
			  
			}
			console.log(typeof type);
			console.log(typeof dir);
			console.log(typeof cb);
			
		},
		dialog:function(){
		
		},
		slider:function(){
		
		},
		tabbular:function(){
		
		}		
  });
  var unitX = /px|%|pc|em|#|rgb/g;
  var incrementPath = /\-=|\+=/;
  var minui = {
  fx:function(elm,prop,val,speed){
   //cache the this object
   var self = this;
   //this is the property to change
   this.style = prop;
   this.element = elm;
   //how long the animation should last
   this.duration = speed;
   //the current time it starts!
   this.start = _$.now();
   //capture the movement path negative or positive;
   this.movement = val.match(incrementPath) !== null ? val.match(incrementPath)[0] : null;
   //this gets the current position of element!
   //now lets capture the sort of unit being used, if null automatic Pixels or if opacity use no unit of measurement!
   this.unit = val.match(unitX) !== null ? val.match(unitX)[0] : prop == 'opacity' ? "" : "px";
   var k = window.getComputedStyle(elm);
   k = k[prop].replace(unitX,'');
   this.pos = Number(k);
   //change the value of movement to a number
   val = val.replace(unitX,'').replace(incrementPath,'');
   this.end= Number(val);
   this.state=0;
   var t;
   
     
   var timer = setInterval(step,5);
   function step(){
      t = _$.now() - self.start;
	  if(self.movement !== null && self.movement.indexOf("-") !== -1 || self.end < self.pos && self.movement == null && self.style !== "opacity"){
	  self.state = self.pos-(t / self.duration) * self.end;
	  }else if(self.movement !== null && self.movement.indexOf("+") !== -1 || self.end > self.pos && self.movement == null && self.style !== "opacity"){
	  self.state = self.pos+(t / self.duration) * self.end;
	  }else if(self.style== "opacity"){
	    if(self.pos > self.end){
		self.state= self.pos = self.pos - parseFloat((t / self.duration) / 100); 
		}else{
		self.state= self.pos =  self.pos + parseFloat((t / self.duration) / 100); 
		}
	  }
	  update();
   }
   

  function update(){
     if(t <= self.duration && self.end !== self.state && self.style !== "opacity"){
      self.element.style[self.style]= self.state+self.unit;
	 }else if(self.style=="opacity" && self.pos > self.end){
	   self.element.style[self.style]= self.state+self.unit;
	 }else{
	   if(self.style=="opacity") self.element.style[self.style]=self.end;
	   clearInterval(timer);
	 }
}

},
  drag:function(elm,dir,bool){
        
  }

  };
  

  
  
  
  
  _$.contextMenu = {
	 remove:function(){
	   window.oncontextmenu = function(e){e.preventDefault();}
	 }
  };
  _$.contextMenu.custom = {
      addItem:function(){
	  
	  },
	  removeItem:function(){
	  
	  }
  
  };
  
  }
})(this, document);