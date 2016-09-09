$(function() {
  $(".cui__input__input").on('keyup',search);
});

var xhr;

function search(event) {
  /* retrive current search value. */
  var queryStr = $(".cui__input__input").val();

  /* kill last request (not relevant because input was changed. */
  if (xhr)
    xhr.abort();

  if (!queryStr.length) {
    $(".cui__input__label").show();
    return;
  }
  else {
    $(".cui__input__label").hide();
  }


  xhr = $.get('search?query=' + queryStr + '&size=10', function (data) {
    
    // TODO: remove old list

    /* add new users. */
    for (var i=0 ; i < data.length ; i++) {
      addUser(data[i]);
    }

  });
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

  $(".results h2").append(hStr);
}

function getAge(birthday) {
  return 34;
}