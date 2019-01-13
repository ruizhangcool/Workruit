$(document).ready(function() {
  $(".users-box, .chat-box, .sidebar").niceScroll({
    cursorcolor: "#337ab7",
    cursorborderradius: "0px",
    cursorborder: "1px solid #fff",
    spacebarenabled: false
  });
  // $('.tags').inputTags({
  //   autocomplete: {
  //     values: ['jQuery', 'tags', 'plugin', 'Javascript'],
  //     only: true
  //   },
  //   tags: ['UI', 'UX Design'],
  //   change: function() {
  //     $('.control-buttons').removeClass('hidden');
  //   }
  // });

  $(".range").asRange({
    range: false
  });

  $('.item .like').click(function() {
    var item = $('#applicants .item').clone();
    $('#notifications .liked, #notifications .passed').removeClass('active');
    $(this).parent().parent().parent().parent().addClass('item-liked');
    $(this).parent().parent().parent().slideUp(300);
    $('#notifications .liked').addClass('active');
    setTimeout(function(){
      $(this).parent().parent().parent().parent().remove();
      $('#applicants').append(item);
      $('#notifications .liked, #notifications .passed').removeClass('active');
    },1000);
  });

  $('.item .pass').click(function() {
    var item = $('#applicants .item').clone();
    $('#notifications .liked, #notifications .passed').removeClass('active');
    $(this).parent().parent().parent().parent().addClass('item-passed');
    $(this).parent().parent().parent().slideUp(300);
    $('#notifications .passed').addClass('active');
    setTimeout(function(){
      $(this).parent().parent().parent().parent().remove();
      $('#applicants').append(item);
      $('#notifications .liked, #notifications .passed').removeClass('active');
    },1000);
  });

  $(document).on('change keypress', 'input, textarea, select', function() {
    if (!$(this).hasClass("password-changer")) {
      $('.control-buttons').removeClass('hidden');
    }
  });

  $(document).on('change', 'input.switch', function() {
    $('#settings_save_button').removeClass('hidden');
  });

  $('#job-type').on('change', function(){
    var select_option = $("#job-type option:selected").index();
    if(select_option == 1 || select_option == 2 || select_option == 3) {
      $('#salary, #experience').removeClass('hidden');
    } else {
      $('#salary, #experience').addClass('hidden');
    }
    if(select_option == 4 || select_option == 5) {
      $('#start-date, #end-date, #salary2').removeClass('hidden');
    } else {
      $('#start-date, #end-date, #salary2').addClass('hidden');
    }
  });

  $('#salary-checkbox').click(function() {
    if ($(this).is(':checked')) {
      $('#salary .row').removeClass('hidden');
    } else {
      $('#salary .row').addClass('hidden');
    }
  });
  $('#salary2-checkbox').click(function() {
    if ($(this).is(':checked')) {
      $('#salary2 .row').removeClass('hidden');
    } else {
      $('#salary2 .row').addClass('hidden');
    }
  });

  $('.btn-change-password').click(function() {
    $(this).addClass('hidden');
    $('#change-password').removeClass('hidden');
    $('.control-buttons2').removeClass('hidden');
  });

  $('#job_select').selectric({
    onChange: function(element) {
      console.log("Changed: ", $(this).val());
      angular.element(document.getElementById('job_select')).scope().getNewMatchedProfiles();
    },
  });

  // $('select').selectric();

});

// Save My Profile.
function showSavingProfileAnimate() {
  $('.control-buttons .btn-save').prop('disabled', true);
  $('.control-buttons .btn-save').prepend("<img src='images/ajax-loader.gif' alt='loader'>");
}

function showSaveMyProfileAnimate() {
  $("<div class='saved-message'><strong>Sweet:</strong> Your profile has been updated.</div>").insertAfter("header");
  $('.control-buttons .btn-save').prop('disabled', false);
  $('.control-buttons .btn-save').text('Save changes');

  setTimeout(function(){
    $('.saved-message').slideUp('slow');
  },3000);
}

function showErrorMessageForMyProfile(message) {
  $("<div class='error-message'><strong>Error:</strong> " + message + "</div>").insertAfter("header");
  $('.control-buttons .btn-save').prop('disabled', false);
  $('.control-buttons .btn-save').text('Save changes');

  setTimeout(function(){
    $('.error-message').slideUp('slow');
  },3000);
}

// Change Password.
function showSavingChangePasswordAnimate() {
  $('#change_password_button').prop('disabled', true);
  $('#change_password_button').prepend("<img src='images/ajax-loader.gif' alt='loader'>");
}

function showChangedPasswordAnimate() {
  $("<div class='saved-message'><strong>Sweet:</strong> Your password has been changed.</div>").insertAfter("header");
  $('#change_password_button').prop('disabled', false);
  $('#change_password_button').text('Save changes');

  setTimeout(function(){
    $('.saved-message').slideUp('slow');
  },3000);
}

function showErrorMessageForChangePassword(message) {
  $("<div class='error-message'><strong>Error:</strong> " + message + "</div>").insertAfter("header");
  $('#change_password_button').prop('disabled', false);
  $('#change_password_button').text('Save changes');

  setTimeout(function(){
    $('.error-message').slideUp('slow');
  },3000);
}

function hideChangePassword() {
  $('.btn-change-password').removeClass('hidden');
  $('#change-password').addClass('hidden');
  $('.control-buttons2').addClass('hidden');
}

// Settings.
function showSavingSettingsAnimate() {
  $('#settings_button').prop('disabled', true);
  $('#settings_button').prepend("<img src='images/ajax-loader.gif' alt='loader'>");
}

function showSavedSettingsAnimate() {
  $("<div class='saved-message'><strong>Sweet:</strong> Your settings has been changed.</div>").insertAfter("header");
  $('#settings_button').prop('disabled', false);
  $('#settings_button').text('Save changes');

  $('#settings_save_button').addClass('hidden');

  setTimeout(function(){
    $('.saved-message').slideUp('slow');
  },3000);
}

function showErrorMessageForSavedSettings(message) {
  $("<div class='error-message'><strong>Error:</strong> " + message + "</div>").insertAfter("header");
  $('#settings_button').prop('disabled', false);
  $('#settings_button').text('Save changes');

  setTimeout(function(){
    $('.error-message').slideUp('slow');
  },3000);
}

// Save Job.
function showSavingJobAnimate() {
  $('#save_job_button').prop('disabled', true);
  $('#save_job_button').prepend("<img src='images/ajax-loader.gif' alt='loader'>");
}

function showSavedJobAnimate() {
  $("<div class='saved-message'><strong>Sweet:</strong> Your job has been changed.</div>").insertAfter("header");
  $('#save_job_button').prop('disabled', false);
  $('#save_job_button').text('Save changes');

  $('#save_job_box').addClass('hidden');

  setTimeout(function(){
    $('.saved-message').slideUp('slow');
  },3000);
}

function showErrorMessageForSavedJob(message) {
  $("<div class='error-message'><strong>Error:</strong> " + message + "</div>").insertAfter("header");
  $('#save_job_button').prop('disabled', false);
  $('#save_job_button').text('Save changes');

  setTimeout(function(){
    $('.error-message').slideUp('slow');
  },3000);
}

function loadJobs(jobs) {

  // var is_first = true;
  // for(var i = 0; i < jobs.length; i++) {
  //   var item = jobs[i];
  //   var job_post_id = item.jobPostId;
  //   var title = item.title;
  //
  //   if(item.status != 3) {
  //     var html = '';
  //     if(is_first) {
  //        html = "<option value=" + job_post_id + " selected>" + title + "</option>";
  //        is_first = false;
  //     }
  //     else {
  //       html = "<option value=" + job_post_id + ">" + title + "</option>";
  //     }
  //     $('#job_select').append(html).selectric();
  //   }
  // }
  //
  // $('#job_select').selectric('refresh');


// <option data-ng-repeat="jf in JobsData" ng-show="jf.status != 3" value="{{jf.jobPostId}}">{{jf.title}}</option>
}

function createNotify(title, message) {
  notify({
    type: "info",
    title: title,
    message: "<div class='toast-title'>Customer Service</div><div class='toast-message'>" + message + "</div>",
    position: {
      x: "right", //right | left | center
      y: "top" //top | bottom | center
    },
    icon: '<img src="images/avatar.png" />',
    size: "normal", //normal | full | small
    overlay: false, //true | false
    closeBtn: true, //true | false
    overflowHide: false, //true | false
    spacing: 20, //number px
    theme: "default", //default | dark-theme
    autoHide: true, //true | false
    delay: 2500, //number ms
    onShow: null, //function
    onClick: null, //function
    onHide: null, //function
  });
}
