/*
* @Author: Sebastian B. Mohr
* @Date:   2020-08-07 17:18:28
* @Last Modified by:   Sebastian
* @Last Modified time: 2020-10-18 13:33:38
*/


/*---------------------------------------------
# Navbar
-----------------------------------------------*/

var navbar_btn =  document.getElementsByClassName("mobile-navigator-toggle")

navbar_btn[0].onclick = function(e){
  //Toggle header class
  header = document.getElementById("header")
  header.classList.toggle("mobile-navigator-active");
  //Repalce icon with cross (x)
  navbar_btn[0].children[0].classList.toggle("fa-bars");
  navbar_btn[0].children[0].classList.toggle("fa-times");
  //Toggle overflow i.e scrolling
  document.body.classList.toggle("prevent-scrolling");
};



/*---------------------------------------------
# Typewriter
-----------------------------------------------*/

var TxtType = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};
TxtType.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
  this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
  this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 200 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
  delta = this.period;
  this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
  this.isDeleting = false;
  this.loopNum++;
  delta = 500;
  }

  setTimeout(function() {
  that.tick();
  }, delta);
};

window.addEventListener('load', (event) => {
  var elements = document.getElementsByClassName('typewriter');

  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-type');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtType(elements[i], JSON.parse(toRotate), period);
    }
  }
})


/*---------------------------------------------
# To top button
-----------------------------------------------*/

var to_top_btn = document.getElementsByClassName("to-top")[0]
window.addEventListener('scroll', function(e){
  if(document.documentElement.scrollTop>100){
    to_top_btn.classList.add("is-visible")
  }
  else{
    to_top_btn.classList.remove("is-visible")
  }
})

// We need to keep track of faded in elements so we can apply fade out later in CSS
document.addEventListener('animationstart', function (e) {
  if (e.animationName === 'fade-in') {
      e.target.classList.add('did-fade-in');
  }
});

document.addEventListener('animationend', function (e) {
  if (e.animationName === 'fade-out') {
      e.target.classList.remove('did-fade-in');
   }
});

/*----------------------------------------------
# Smooth scrolling
#https://stackoverflow.com/questions/7717527/smooth-scrolling-when-clicking-an-anchor-link
-----------------------------------------------*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth',
            block: "start",
        });
    });
});

/*--------------------------------------------------
# Active navigation item
# Could have done the for loop myself but short amount of google does the
# job too.
# https://stackoverflow.com/questions/32395988/highlight-menu-item-when-scrolling-down-to-section
# With some tweeks
----------------------------------------------------*/

// cache the navigation links 
var $navigationLinks = document.querySelectorAll('nav > ul > li > a');
// cache (in reversed order) the sections
var $sections = document.getElementsByTagName('section');


// map each section id to their corresponding navigation link
var sectionIdTonavigationLink = {};
for (var i = $sections.length-1; i >= 0; i--) {
  var id = $sections[i].id;
  sectionIdTonavigationLink[id] = document.querySelectorAll('nav > ul > li > a[href=\\#' + id + ']') || null;
}

// throttle function, enforces a minimum time interval
function throttle(fn, interval) {
  var lastCall, timeoutId;
  return function () {
    var now = new Date().getTime();
    if (lastCall && now < (lastCall + interval) ) {
      // if we are inside the interval we wait
      clearTimeout(timeoutId);
      timeoutId = setTimeout(function () {
        lastCall = now;
        fn.call();
      }, interval - (now - lastCall) );
    } else {
      // otherwise, we directly call the function 
      lastCall = now;
      fn.call();
    }
  };
}

function getOffset( el ) {
  var _x = 0;
  var _y = 0;
  while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
    _x += el.offsetLeft - el.scrollLeft;
    _y += el.offsetTop - el.scrollTop;
    el = el.offsetParent;
  }
  return { top: _y, left: _x };
}

function highlightNavigation() {
  // get the current vertical position of the scroll bar
  var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

  // iterate the sections
  for (var i = $sections.length-1; i >= 0; i--) {
    var currentSection = $sections[i];
    // get the position of the section
    var sectionTop = getOffset(currentSection).top;

     // if the user has scrolled over the top of the section  
    if (scrollPosition >= sectionTop - 250) {
      // get the section id
      var id = currentSection.id;
      // get the corresponding navigation link
      var $navigationLink = sectionIdTonavigationLink[id];
      // if the link is not active
      if (typeof $navigationLink[0] !== 'undefined') {
        if (!$navigationLink[0].classList.contains('active')) {
          // remove .active class from all the links
          for (i = 0; i < $navigationLinks.length; i++) {
            $navigationLinks[i].className = $navigationLinks[i].className.replace(/ active/, '');
          }
          // add .active class to the current link
          $navigationLink[0].className += (' active');
        }
      } else {
          // remove .active class from all the links
          for (i = 0; i < $navigationLinks.length; i++) {
            $navigationLinks[i].className = $navigationLinks[i].className.replace(/ active/, '');
          }
      } 

      //Dirty sub navigator hack
      var ids_ex = ["myworks","publications","websites","other-projects"]
      if (ids_ex.indexOf(id)>=0){
        // Set all sub navigator visible
        for(i=1;i<ids_ex.length;i++) {
          sectionIdTonavigationLink[ids_ex[i]][0].className = sectionIdTonavigationLink[ids_ex[i]][0].className.replace(/ visible/, '');
          // add .active class to the current link
          sectionIdTonavigationLink[ids_ex[i]][0].className += (' visible');
        }
        sectionIdTonavigationLink["myworks"][0].className = sectionIdTonavigationLink["myworks"][0].className.replace(/ active/, '');
        sectionIdTonavigationLink["myworks"][0].className += (' active');
      } else{
        for(i=1;i<ids_ex.length;i++) {
          sectionIdTonavigationLink[ids_ex[i]][0].className = sectionIdTonavigationLink[ids_ex[i]][0].className.replace(/ visible/, '');
        }
      }
      // we have found our section, so we return false to exit the each loop
      return false;
    }
  }
}

window.addEventListener('scroll',throttle(highlightNavigation,150));


/*--------------------------------------------------------------
# Accordion
--------------------------------------------------------------*/

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */
    this.classList.toggle("active");

    /* Toggle between hiding and showing the active panel */
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
} 

/*--------------------------------------------------------------
# Include html
--------------------------------------------------------------*/
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}