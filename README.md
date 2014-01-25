min.js 2014
================================

min.js is a new javascript library written by me, Chris Baldwin, it was written with the most minimal weight in mind. None of the functions that exist in this code are written with the code itself,
unlike jQuery which likes to do this! Cross Browser enhancements have been added for IE support, and some smaller inline functions have been added. Why reinvent the wheel? Well why not if we have the
oppurtunity to create something better? jQuery has been out so long and a lot of JavaScript programmers have learned that some jQuery users don't understand jQuery nor how to write it correctly, so
I've taken the liberty to rewrite the magic, leaving a lot of work out of min.js. min.js performs like jQuery though us developers must write Vanilla JavaScript like normal, we use min.js as a helper to save space
and time from constantly rewriting code blocks and functions.


A bit of the min.js functions
-------------------------

* _$.inArray
* _$.getRect
* _$.setJSON
* _$.getJSON
* _$.ajax
* _$.cssSupport
* _$.random

Math is hard, where's our Math Functions?
-------------------------------

We understand some JavaScript developers have a hard time remembering the Math object, we created some small functions to assist in these. Just like the _$.random(x) will genenerate a random Number
based on x.

More Read Me Information!
------------------------

  
_$ = constructor

_$.inArray(property,array) = test if property is in listed Array

_$.setJSON(json) = Sets JSON to stringify

_$.getJSON(var)= Parses string to JSON

_$.data(prop) = create new data for all sorts of elements

_$.getRect(element) = gets left right top bottom width and height of an element

_$.ajax = creates an ajax request

_$.cssSupport(prop) = checks if browser allows css support for the property

_$.random()

addClass

removeClass

hasClass

show

hide

create

attr

hasAttr

removeAttr

style

getStyle

removeStyle