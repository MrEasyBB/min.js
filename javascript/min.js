/*
Work on small bugs, work arounds and issues with code. 
Add any small functions, take out any that aren't needed and place in minUI
*/
// Anonymous function
//Work on fadeIn fadeOut slideDown slideUp slideLeft slideRight
(function (window, document, undefined) {
    //public variables!
    var i,
        idReg = new RegExp(/^#[\w+]?/),
        classReg = new RegExp(/^\.[\w+]?/),
        elemReg = new RegExp(idReg + "|" + classReg),
        reg = /\[contains:.+\]/g,
        getWord = /("|')(.*?)("|')/,
        htmlContext = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
		testWind = /iframe|object|embed/i,
        doc = document,
        win = window,
        _target,
        children,
        newData = {},
        browser = navigator.userAgent.split(" "),
        //props is for easy access to attribute names, push to the object for memory frames.
        props = {
            "class": "className"
           },
        timers = [];
    if (!doc.getElementsByClassName) {
        doc.getElementsByClassName = function (classname) {
            var a = doc.getElementsByTagName('*');
            var reg = new RegExp(classname, 'g');
            var arr = [];
            for (i = 0; i < a.length; i++) {
                if (reg.test(a[i].className)) {
                    arr.push(a[i]);
                }
            }
            return arr;
        };
    }
	if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
      if ( this === undefined || this === null ) {
        throw new TypeError( '"this" is null or not defined' );
      }

      var length = this.length >>> 0; // Hack to convert object.length to a UInt32

      fromIndex = +fromIndex || 0;

      if (Math.abs(fromIndex) === Infinity) {
        fromIndex = 0;
      }

      if (fromIndex < 0) {
        fromIndex += length;
        if (fromIndex < 0) {
          fromIndex = 0;
        }
      }

      for (;fromIndex < length; fromIndex++) {
        if (this[fromIndex] === searchElement) {
          return fromIndex;
        }
      }

      return -1;
    };
  }
    // Q returns new Library object that hold our selector. Ex: Q('.wrapper')
    var Q = function (params, context) {
        return new Library(params,context);
    };
    var Library = function (params, context) {
        var k;
        if (typeof params == 'function') {
            document.addEventListener('DOMContentLoaded', params, false);
        } else if(typeof params == 'object'){
		   this[0] = _target = params;
		   this.length = 1;
		   return this;
		}else{
		
		   if(context){
		    if(context.length){_target= context[0].querySelectorAll(params); }else{_target = context.querySelectorAll(params)};       			 
		   }else{
		    _target = doc.querySelectorAll(params);
		   }

			this.length = _target.length;
			for ( var i = 0; i < _target.length; i++ ) {
					this[ i ] = _target[ i ];
			}
            
            return this;
        }
    };

    // Extend the Library object.
    Q.fn = Library.prototype = {
        hide: function () {
            var len = this.length;
            while (len--) {
                this[len].style.display = 'none';
            }
            return this;
        },
        show: function () {
            var len = this.length;
            while (len--) {
                this[len].style.display = 'block';
            }
            return this;
        },
        create: function (type, context) {
            var ele;
            if (htmlContext.test(type)) {
                ele = type.match(htmlContext)[1];
            } else {
                ele = type;
            }
            var elem = document.createElement(ele);
            if (context) {
                for (var item in context) {
                    if (item in elem) {
                        elem[item] = context[item];
                    } else {
                        elem.setAttribute('data-' + item, context[item]);
                    }
                }
            }
            this[0].appendChild(elem);
        },
        hasClass: function (className) {
            var classNameTest = new RegExp(className, 'g');
            if (classNameTest.test(this.className)) return this;
            return false;
        },
        addClass: function (className) {
            var len = this.length;
            var reg = new RegExp(className, 'g');
            while (len--) {
                if (!reg.test(this[len].className)) {
                    this[len].className += " " + className;
                }
            }
            return this;
        },
        removeClass: function (className) {
            var len = this.length;
            var reg = new RegExp(" " + className, 'g');
            while (len--) {
                if (reg.test(this[len].className)) {
                    this[len].className = this[len].className.replace(reg, '');
                }
            }
            return this;
        },
        attr: function (attr, prop) {
            var len = this.length;
            while (len--) {
				  var b = document.createElement(this[len].tagName);
				  d=false;
				  if(b){
				    for(var item in b){
					  var a = item.toLowerCase();
					   if(a == attr){
					  	 d=true;
						 break;
					   }
					}
				}
				if(d==false)this[len].setAttribute("data-"+attr,prop);
				if(d==true)this[len].setAttribute(attr,prop);
		      }
			  return this;
        },
        removeAttr: function (attr) {
            var len = this.length;
            while (len--) {
                this[len].removeAttribute( "data-" + attr) ||   this[len].removeAttribute(attr);
            }
            return this;
        },
        hasAttr: function (attr) {
                var key = this[0].getAttribute(attr) || this[0].getAttribute('data-'+attr);
                if (key === null) {
                   return false;
                }
                   return true;
        },
		style: function (styles) {
            var len = this.length;
            while (len--) {
                if (typeof styles !== 'string') {
                    for (var key in styles) {
                        this[len].style[key] = styles[key];
                    }
                } else {
                    if (win.getComputedStyle) {
                        var a = win.getComputedStyle(this[len]);
                        return a[styles];
                    } else if (doc.documentElement.currentStyle) {
                        return this[len].currentStyle && this[len].currentStyle[styles];
                    } else if(document.defaultView && document.defaultView.getComputedStyle){
					    return document.defaultView.getComputedStyle(this[len], "");
					}
                }
            }
            return this;
        },
        removeStyle: function (style) {
            var len = this.length;
            var reg = new RegExp(style, 'gi');
            while (len--) {
                var a = this[len].getAttribute('style');
                if (a) {
                    var b = a.replace(/\s/g, '').split(';');
                    for (i = 0; i < b.length; i++) {
                        var sty = b[i].split(':');
                        if (reg.test(sty[0])) {
                            b.splice(i, 1);
                        }
                    }
                    this[len].setAttribute('style', b.join(';'));
                }
            }
        },
        html: function (html) {
            if(html){
					var len = this.length;
					while (len--) {
					this[len].innerHTML = html;
					}
				}
				if(!html){
				return this[0].innerHTML;
				}
				return this;
        },
		text:function(text){
			if(text){
			var len = this.length;
            while (len--) {
                this[len].innerText = text;
            }
			}
			if(!text){
			  return this[0].innerText;
			}
            return this;
		},
		on: function (evt, fn, bool) {
             var len = this.length;
			while(len--){
			  	if (doc.addEventListener) {
                  return this[len].addEventListener(evt,fn,bool);
               }else if(doc.detachEvent){
			      return this[len].attachEvent("on"+evt,fn);
			   }else{
			   this[len]["on" + evt] = fn;
			   }
			}
        },
        off: function (evt, fn, bool) {
            var len = this.length;
			while(len--){
			  	if (doc.removeEventListener) {
                  return this[len].removeEventListener(evt,fn,bool);
               }else if(doc.detachEvent){
			      return this[len].detachEvent("on"+evt,fn);
			   }else{
			   this[len]["on" + evt] = null;
			   }
			}
        },
        remove: function (ele) {
            var len = this.length;
            if (ele === undefined) {
                if (len > 1) {
                    while (len--) {
                        this[len].parentNode.removeChild(this[len]);
                    }
                } else {
                    this[0].parentNode.removeChild(this[0]);
                }
            } else {
                var child;
                if (len > 1) {
                    var key = new RegExp(ele.replace(/^\./, ''), 'g');
                    while (len--) {
                        child = this[len].children;
                        for (i = 0; i < child.length; i++) {
                            if (key.test(child[i].className) || child[i].tagName.toLowerCase() == ele) {
                                child[i].parentNode.removeChild(child[i]);
                            }
                        }
                    }
                } else {
                    child = this[0].children;
                    for (i = 0; i < child.length; i++) {
                        if (child[i].className === ele || child[i].tagName === ele) {
                            child[i].parentNode.removeChild(child[i]);
                        }
                    }
                }
            }
            return this;
        },
        append: function (html) {
            var len = this.length;
            if (len > 1) {
                while (len--) {
                    this[len].innerHTML += html;
                }
            } else {
                this.innerHTML += html;
            }
            return this;
        },
        insertAfter: function (ele) {
            if (ele) {
                this[0].parentNode.insertBefore(this[0], ele.nextSibling);
            }
        },
        fadeIn: function (speed, till) {
            speed = speed !== undefined ? speed : 400;
            speed = typeof speed === 'number' ? speed : speed == "slow" ? 600 : speed == "fast" ? 200 : speed !== 'slow' || speed !== 'fast' ? 400 : 400;
            var opc = _$(this[0]).getStyle("opacity");
            var element = this[0];
            var time = 100 / speed;
            till = till !== undefined ? till : 1;
            element.style.display = "block";
            var timer = (function a() {
                if (opc >= till) {
                    element.style.opacity = 1;
                    clearInterval(timer);
                    return false;
                }
                if (browser[3] == 'MSIE' && Number(browser[4]) < 9) {
                    add = 10000 / speed;
                    element.style.filter = 'alpha(opacity="' + (opc + add) + '")';
                }
                element.style.opacity = opc;
                opc = parseFloat(opc + 0.01);
                setTimeout(a, time);
            })();
        },
        fadeOut: function (speed, till) {
            speed = speed !== undefined ? speed : 400;
            speed = typeof speed === 'number' ? speed : speed == "slow" ? 600 : speed == "fast" ? 200 : speed !== 'slow' || speed !== 'fast' ? 400 : 400;
            var opc = _$(this[0]).getStyle("opacity");
            var element = this[0];
            till = till !== undefined ? till : 0;
            var add = 100 / speed;
            var timer = (function a() {
                if (opc < till) {
                    if (till === 0) element.style.display = 'none';
                    clearInterval(timer);
                    return false;
                }
                element.style.opacity = opc;
                if (browser[3] == 'MSIE' && Number(browser[4]) < 9) {
                    add = 10000 / speed;
                    element.style.filter = 'alpha(opacity=' + (opc - add) + ")";
                }
                opc = parseFloat(opc - 0.01);
                setTimeout(a, add);
            })();
        },
        children:function(ele,nodeType){
		   var al = [];
		   var bl =this[0].children;
		   var cl = new RegExp(ele.replace(/\.|#/,''),'g');
		   if(ele && typeof ele !== 'number'){
             for(i=0;i<bl.length;i++){
			   if(nodeType){
   			        if( bl[i].nodeType == nodeType && cl.test(bl[i].className) || cl.test(bl[i].id) ){
			          al.push(bl[i]);
			         }
			   }else{
			   console.log('element is not a number and it exists');
			      if( cl.test(bl[i].className) || cl.test(bl[i].id) ){
			          al.push(bl[i]);
			         }
			   }
			 }
           return al;			 
		   }else if(ele && typeof ele == 'number'){
		   for(i=0;i<bl.length;i++){
		      if( bl[i].nodeType == ele ){
			       al.push(bl[i]);
			  }
		   }
		  return al;
		   }else if(!ele){
		   return bl;
		   }	  
		},
		find:function(ele){
		   var a = this[0].children;
		   var t = new RegExp(ele,'g');
		   var ab = a.length;
		   var c=[];
		   while(ab--){
		      if(t.test('.'+a[ab].className) || t.test('#'+a[ab].id)){
			    c.push(a[ab]);
			  }
		   }
		   this.length = c.length;
		   for(i=0;i<c.length;i++){
		    this[i] = c[i];
		   }
		   return this;
		}
    };

    Q.fn.extend = Q.prototype = function (func) {
        for (var namespace in func) {
            Q.fn[namespace] = func[namespace];
        }
    };

    var ajax = {
        response: null,
        status: 0,
        error: null
    };
	
    var sajax = {
        url: null,
        type: "GET",
        cache: null,
        data: null,
        content: null,
        xhr: null,
        timeout: 0,
        responseType: "html",
        init: function () {
            var ids = ['MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP', 'Microsoft.XMLHTTP'];
            if (window.XMLHttpRequest) {
                sajax.xhr = new XMLHttpRequest();
            } else {
                for (var i = 0; i < ids.length; i++) {
                    try {
                        sajax.xhr = new ActiveXObject(ids[i]);
                        break;
                    } catch (e) {
                        ajax.error = e.message;
                        break;
                    }
                }
            }
            sajax.xhr.open(sajax.type, sajax.url, true);
            sajax.xhr.setRequestHeader("Content-type", ajax.content !== null ? ajax.content : "application/x-www-form-urlencoded");
            if (ajax.cache !== null && ajax.cache !== true) {
                sajax.xhr.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2005 00:00:00 GMT");
            }
            if (ajax.responseType !== "html") {
                sajax.xhr.responseType = sajax.responseType;
            }
            sajax.xhr.onreadystatechange = function () {
                if (sajax.xhr.readyState == 4 && sajax.xhr.status == 200) {
                    ajax.response = sajax.xhr.responseText;
                }
            };
            if (sajax.type.toUpperCase() === 'GET') {
                sajax.xhr.send();
                ajax.status = 1;
            } else if (ajax.type.toUpperCase() === 'POST') {
                sajax.xhr.send(data);
                ajax.status = 1;
            } else {
                ajax.status = 2;
            }
        },
        ajax: function (opts) {
            if (opts.url === undefined) return false;
            if (opts.url !== undefined) sajax.url = opts.url;
            if (opts.type !== undefined) sajax.type = opts.type;
            if (opts.cache !== undefined) sajax.cache = opts.cache;
            if (opts.content !== undefined) sajax.content = opts.content;
            if (opts.data !== undefined) sajax.data = opts.data;
            if (opts.responseType !== undefined) sajax.responseType = opts.responseType;
            if (opts.timeout !== undefined) sajax.timeout = opts.timeout;
            var k = this.response;
            sajax.init();
            return (ajax);
        }
    };
    var loop = {
        loop: function (func, time) {
            this.time = time;
            this.func = func;
            this.cancel = false;
            this.started = false;
            var self = this;
            var loops;

            function start() {
                self.started = true;
                run();
            };

            function run() {
                if (!self.cancel) {
                    self.func();
                    loops = setTimeout(run, self.time);
                }
            }

            if (typeof this.func === 'function') {
                start();
            }
        }

    };

    function contains(ele, lazy, cont) {
        var getWord = /("|')(.*?)("|')/;
        var d = "";
        var arr = [];
        if (lazy === true) d = "i";
        for (i = 0; i < ele.length; i++) {
            var text = ele[i].textContent || ele[i].innerText;
            var key = cont.match(getWord);
            var search = new RegExp(key, 'g' + d);
            if (search.test(key[2])) {
                _target.push(ele[i])
            }
        }
    }
    Q.setJSON = JSON.stringify || function (obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"' + obj + '"';
            return String(obj);
        } else {
            // recurse array or object
            var n, v, json = [],
                arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n];
                t = typeof (v);
                if (t == "string") v = '"' + v + '"';
                else if (t == "object" && v !== null) v = JSON.stringify(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };
    Q.getJSON = JSON.parse || function (str) {
        return (new Function("return " + str))();
    };
    Q.now = function () {
        return new Date().getTime();
    };
    Q.steps = function (timeframe) {
        var time;
        var steps;
        var condition = false;
        var stepstimeRanges = {};
        if (timeframe !== 'end') {
            switch (timeframe) {
            case "seconds":
                time = 1000;
                break;
            case "minutes":
                time = 60000;
                break;
            case "hour":
                time = 3.6e+6;
                break;
            case "sec":
                time = 1000;
                break;
            case "mins":
                time = 60000;
                break;
            case "hr":
                time = 3.6e+6;
                break;
            }
        } else {
            condition = false;
        }

        function end() {
            condition = false;
            return stepstimeRanges;
        }

        function start() {
            steps = 0;
            condition = true;
            run();
        }

        function run() {
            steps++;
            stepstimeRanges[steps] = Q.now();
            if (condition) {
                setTimeout(run, time);
            } else {
                end();
            }
        }
        start();
    };
    Q.data = function (prop) {
        if (prop) {
            if (newData[prop]) {
                return newData[prop];
            } else {
                newData[prop] = {};
            }
        }
    };
    Q.random = function (cnt) {
        return Math.floor(Math.random() * cnt);
    };
	Q.function_exists=function(funcName){
	   if(typeof funcName == 'function'){
	     return true;
	   }
	   return false;
	};
	Q.scrolled=function(){
	var scrOfX = 0, scrOfY = 0;
 
    if( typeof( window.pageYOffset ) == 'number' ) {
        //Netscape compliant
        scrOfY = window.pageYOffset;
        scrOfX = window.pageXOffset;
    } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
        //DOM compliant
        scrOfY = document.body.scrollTop;
        scrOfX = document.body.scrollLeft;
    } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
        //IE6 standards compliant mode
        scrOfY = document.documentElement.scrollTop;
        scrOfX = document.documentElement.scrollLeft;
    }
    return [ scrOfX, scrOfY ];
	};
    Q.cssSupport = (function () {
        var div = document.createElement('div'),
            vendors = ["Khtml", "Ms", "O", "Moz", "Webkit"],
            len = vendors.length;
        return function (prop) {
            if ((/-/g).test(prop)) console.error("Properties shouldn't have - make sure the property is camel case like MozBoxShadow");
            if (prop in div.style) return true;

            prop = prop.replace(/^[a-z]/, function (val) {
                return val.toUpperCase();
            });

            while (len--) {
                if (vendors[len] + prop in div.style) {
                    return true;
                }
            }
            return false;
        };
    })();
    Q.getRect = function (ele) {
        var a = ele.offsetLeft;
        var b = ele.offsetTop;
        var c = ele.offsetHeight + b;
        var d = ele.offsetWidth + a;
        var f = ele.offsetHeight;
        var g = ele.offsetWidth;
        var obj = {};
        obj.left = a;
        obj.right = d;
        obj.top = b;
        obj.bottom = c;
        obj.width = g;
        obj.height = f;
        return obj;
    };
    Q.inArray = function (item, array) {
        for (var key in array) {
            if (item == array[key]) return key;
        }
        return false;
    };
    Q.setLoop = function (func, time) {
        return new loop.loop(func, time);
    };
    Q.clearLoop = function (name) {
        name.cancel = true;
        name.started = false;
        name = null;
    };
    // Assign our Q object to global window object.
    if (!window._$) {
        window._$ = Q;
    }
    _$.ajax = sajax.ajax;
})(this, document);
