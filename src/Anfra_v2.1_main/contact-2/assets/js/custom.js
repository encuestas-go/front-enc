
$(document).ready(function() {
	'use strict';

  /*-------------------------------------
  Sticky NabBar
  -------------------------------------*/
  $(window).on('scroll', function () {
    var scroll = $(window).scrollTop();

    if (scroll >= 1) {
      $('.ugf-nav-wrap').addClass('fixed');
    } else {
      $('.ugf-nav-wrap').removeClass('fixed');
    }
  });

  /*--------------------------------------------
  File Input
  --------------------------------------------*/
  function handleChange(inputId) {
    var fileUploader = document.getElementById(inputId);
    var getFile = fileUploader.files

    
    var uploadedFile = getFile[getFile.length - 1];
    readFile(uploadedFile, inputId);
      

  }

  $('.input-file').on('change', function(e) {
    handleChange(e.target.id);
  })

  function readFile(uploadedFile, inputId) {
    if (uploadedFile) {
      var reader = new FileReader();
      reader.onload = () => {
        var parent = document.getElementById('p-' + inputId);
        parent.innerHTML = `<img class="preview-content img-fluid" src=${reader.result} />`;
      };

      reader.readAsDataURL(uploadedFile);
    }
  };

	/*--------------------------------------------
	togglePassword
	--------------------------------------------*/

  function togglePassword(){
      let input = document.getElementById("inputPass");
      var eye = document.getElementById("eye");
      var eyeSlash = document.getElementById("eye-slash");

      if(input.type === "password"){
          input.type = "text"
          eye.style.display = "none";
          eyeSlash.style.display = "inline";
      } else {
          input.type = "password"
          eye.style.display = "inline";
          eyeSlash.style.display = "none";
      }
  }

  $('.pass-toggler-btn').on('click', 'i', function() {
  	togglePassword();
  })

  /*--------------------------------------------
  Donation
  --------------------------------------------*/

  $('.amount-preset span').on('click', function() {
    $('.amount-preset span').removeClass('active');
    $(this).addClass('active');
  })

  $('.custom-donation').on('click', function() {
    $('.amount-preset span').removeClass('active');
  })

  /*--------------------------------------------
  Theme 7 Focus style
  --------------------------------------------*/

  // let inputFocused = 

  $('.form-control').on('focus', function() {
      $(this).siblings('.input-border').addClass('active');
  })

  $('.form-control').on('focusout', function() {
      $(this).siblings('.input-border').removeClass('active');
  })

  /*--------------------------------------------
  Owl Carousel
  --------------------------------------------*/

  $('.testimonial-carousel').owlCarousel({
    loop:true,
    items: 1,
    autoplay: true,
    autoplayHoverPause: true,
    dots: true,
    nav: false,
    autoplaySpeed: 600,
    dotsSpeed: 600,
    margin: 15
  })

  $('.ugf-slider').owlCarousel({
    loop:true,
    items: 1,
    autoplay: true,
    autoplayHoverPause: true,
    dots: true,
    nav: false,
    autoplaySpeed: 600,
    dotsSpeed: 600,
    margin: 15
  })

  /*--------------------------------------------
  Country Select
  --------------------------------------------*/

  $("#country").countrySelect();

  var windowWidth = $(window).width();

  $(window).resize(function() {
    if(windowWidth != $(window).width()) {
      countryList()
    }
  });

  function countryList() {
    var screenSize = $(window).width();
    var countryInputWidth = $('#country').width();
    var countryListWidth = countryInputWidth;

    console.log(countryListWidth);

    $('.kyc-form .country-list').width(countryListWidth + 86);
  }
  countryList();

  /*--------------------------------------------
  File Input
  --------------------------------------------*/

  var fileInput  = document.querySelector( ".custom-file-input" );
  var the_return = document.querySelector(".file-return");

  $(fileInput).on('change', function(event) {
    $(the_return).html(this.value);
  })

  /*-- form validation --*/
  $(document).ready(function () {
    $('body').on('click', '#submit_btn', function () {

      if ($("input[type='email']").val() == "" && $("input[type='password']").val() == "") {
        $("input[type='email'], input[type='password']").addClass("border-danger");
        $("#pop_up").show().text('Please fill the form');
      } else {
        $("input[type='email'], input[type='password']").removeClass("border-danger");
        $("#pop_up").hide();
      }

      if ($('input[type="email"]').val() == '' && $('input[type="password"]').empty()) {
        //   $("input[type='password']").removeClass('border-danger');
      } else {
        $("#pop_up").text('Password is Empty').show();
        $("input[type='password']").show().addClass('border-danger');
      }

      if ($('input[type="password"]').val() == '' && $('input[type="email"]').empty()) {
        //   $("input[type='email']").removeClass('border-danger');
      } else {
        // alert("Email is empty");
        $("#pop_up").text('Email is Empty').show();
        $("input[type='email']").addClass('border-danger');

      }
      if ($('input[type="email"]').val() != '' && $('input[type="password"]').val() != '') {
        $("#pop_up").hide();
      } else {

      }

    });
  });


  $('input[type="email"]').keyup(function () {
    var $email = this.value;
    validateEmail($email);
  });

  //  if( $(".form-group").first().find('input[type="email"]'));
  function validateEmail(email) {
    //   $(".form-group").find(".fa").hide();
    //$(this).parent('.form-group').find();
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

    if ($('input[type="email"]').val() == '') {
      // $(this).parent(".form-group").find('.fa').show();

      $(this).removeClass("border-danger");
      $(this).removeClass("border-success");
    } else {
      if (!emailReg.test(email)) {
        $(".form-group").first().find(".fa-times").show();
        $(".form-group").first().find(".fa-check").hide();
        $('input[type="email"]').addClass("border-danger");
        $('input[type="email"]').removeClass("border-success");
        $("#pop_up").show().text('Somthing went wrong check Your Email Id');
      } else {
        $(".form-group").first().find(".fa-check").show();
        $(".form-group").first().find(".fa-times").hide();
        $('input[type="email"]').removeClass("border-danger");
        $('input[type="email"]').addClass("border-success");
        $("#pop_up").hide();
      }
    }


    if ($('input[type="email"]').val() == "") {
      $('input[type="email"]').parents('.form-group').find(".fa").hide();
      $('input[type="email"]').removeClass("border-success");
      $('input[type="email"]').removeClass("border-danger");
    } else { }

  }

})

/*-- requier  js --*/
$("#commentForm").validate();