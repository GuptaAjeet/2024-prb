
window.onscroll = function () { myFunction() };

var header = document.getElementById("myHeader");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

 // AOS.init();

 AOS.init({
  disable: function () {
      var maxWidth = 991;
      return window.innerWidth < maxWidth;
  }
});

$(window).scroll(function(){ 
  if ($(this).scrollTop() > 100) { 
      $('.backtotop').fadeIn(); 
  } else { 
      $('.backtotop').fadeOut(); 
  } 
});
$(document).on('click', '.backtotop', function(){ 
  $("html, body").animate({ scrollTop: 0 }, 600); 
  return false; 
}); 


$(document).ready(function() {
  var owl = $('.owl-demo1');
  owl.owlCarousel({
    margin: 10,
    nav: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    }
  })
});


$(document).ready(function() {
  var owl = $('.owl-demo2');
  owl.owlCarousel({
    margin: 10,
    nav: true,
    loop: true,
    autoplay:true,
    autoplayTimeout:1500,
    autoplayHoverPause:true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 2
      },
      1000: {
        items: 8
      }
    }
  })
});





