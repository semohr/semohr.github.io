/*
* @Author: Sebastian B. Mohr
* @Date:   2020-08-07 17:18:28
* @Last Modified by:   Sebastian
* @Last Modified time: 2020-08-07 18:05:34
*/



var navbar_btn =  document.getElementsByClassName("mobile-navigator-toggle")

navbar_btn[0].onclick = function(e){
	//Toggle header class
	header = document.getElementById("header")
	header.classList.toggle("mobile-navigator-active");

	//Repalce icon with cross (x)

	navbar_btn[0].children[0].classList.toggle("fa-bars");
	navbar_btn[0].children[0].classList.toggle("fa-times");
};