/*
* @Author: Sebastian B. Mohr
* @Date:   2020-08-07 17:18:28
* @Last Modified by:   Sebastian
* @Last Modified time: 2020-08-07 20:48:30
*/


/*---------------------------------------------
# Navbar
-----------------------------------------------*/

var navbar_btn =  document.getElementsByClassName("mobile-navigator-toggle")

navbar_btn[0].onclick = function(e){
  //Toggle header class
  console.log("hi")
  header = document.getElementById("header")
  header.classList.toggle("mobile-navigator-active");

  //Repalce icon with cross (x)
  navbar_btn[0].children[0].classList.toggle("fa-bars");
  navbar_btn[0].children[0].classList.toggle("fa-times");
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
