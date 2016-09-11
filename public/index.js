/* Saves the last ajax request. */
var xhr = null;

/* Saves the last data results. */
var dataArr = [];

/* Saves the number of items showed to the user. */
var resultSize = 0;

$(function() {
  /* Handle user search. */
  $(".cui__input__input").on('keyup',search);

  /* Handle scroll down (show more results). */
  $(window).scroll(scrollDownHandler);
});

function scrollDownHandler(event) {
  /* Reached to the end of the document. */
  //alert($(document).height() + " - " + $(window).height() + " == " + $(window).scrollTop());
  if ($(document).height() - $(window).height() == $(window).scrollTop()) {
    addUsers(10);
  }
}

function search(event) {
  /* retrive current search value. */
  var queryStr = $(".cui__input__input").val();

  /* kill last request (not relevant because input was changed. */
  if (xhr)
    xhr.abort();


  /* Show / Hide placeholder. */
  if (!queryStr.length) {
    $(".cui__input__label").show();
    clearResults();
    return;
  }
  else {
    $(".cui__input__label").hide();
  }

  $("#searchAjax").show();
  xhr = $.get('search?query=' + queryStr, function (data) {
    $("#searchAjax").hide();
    clearResults();

    dataArr = data;

    if (dataArr.length == 0) {
      $("h2").text('No results, please review your search or try a different one');
      return;
    }
    else {
      $("h2").html('Search results <span class="cui__selector--direct__results">' + numberWithCommas(dataArr.length) + ' ' + (dataArr.length == 1 ?'Person' : 'People') + ' Found</span>');
    }
    /* Reset number of results presented to the user. */
    resultSize = 0;
    
    /* Add first 10 results. */
    addUsers(10);
  });
}

function clearResults() {
    /* Remove all prev items. */
  $(".results .cui__selector--direct__item").remove();

  $("h2").empty();
}

function addUsers(amount) {
  /* add new users. */
  for (var i=resultSize ; i < Math.min(resultSize+amount,dataArr.length) ; i++) {
    addUser(dataArr[i]);
  }

  resultSize = Math.min(resultSize+amount,dataArr.length);
}

function addUser(usr) {
  var hStr = "";

  hStr += '<div class="cui__selector--direct__item">';
  hStr += '   <img class="user-avatar" src="' + usr.avatar_origin + '" />';
  hStr += '   <div class="cui__selector--direct__age" style="float: right;">';
  hStr += '     <div>';
  hStr += '       <span class="glyphicon glyphicon-phone-alt" style="margin-right: 5px;"> </span> ' + usr.phone;
  hStr += '     </div>';
  hStr += '     <div style="text-align: right; margin-top:5px;">';
  hStr += getAge(usr.birthday) + ' years old';
  hStr += '     </div>';
  hStr += '   </div>';

  hStr += '   <div class="cui__selector--direct__label">';
  hStr +=       usr.name;
  hStr += '   </div>';
  hStr += '   <p class="cui__selector--direct__description">';          
  hStr +=       usr.address.street + '. ' + usr.address.city + ', ' + usr.address.country + '.';
  hStr += '   </p>';
  hStr += '</div>';

  $(".results h2").after(hStr);
}

function getAge(birthday) {
  var birthdayYear = new Date(birthday * 1000).getFullYear();
  var currentYear = new Date().getFullYear();
  return currentYear-birthdayYear;
}

function numberWithCommas(x) {
  if (x == undefined) {
    return 0;
  }
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}