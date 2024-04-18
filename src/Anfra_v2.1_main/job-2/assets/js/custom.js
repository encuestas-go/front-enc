
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