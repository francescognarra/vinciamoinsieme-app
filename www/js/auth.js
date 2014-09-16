$(document).ready(function() {
    if (localStorage.getItem("auth_token") != null) {
        $.mobile.changePage('index.html', 'slideUp');
        $('.user_nickname').append("Bentornato " + localStorage.getItem("nickname"));
        $('.userform').hide();
        $('.chkauth').show();
    } else {
        $('.logout').hide();
        $('.chkauth').hide();
    }

    $('.login_button').click(function() {
//        $.mobile.showPageLoadingMsg();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'http://' + host + '/users/sign_in.json?',
            data: {
//                        user: {
                email: $('input[name="email"]').val(),
                password: $('input[name="password"]').val()
//                        }
            }
        }).success(function jsSuccess(data, textStatus, jqXHR) {
//            $.mobile.hidePageLoadingMsg();
            console.log(data);
            console.log(textStatus);
            console.log(jqXHR);
            localStorage.setItem('auth_token', data.authentication_token);
            localStorage.setItem('nickname', data.nickname);
            localStorage.setItem("email", data.email);
            localStorage.setItem("photo", "http://"+host+data.photo_url);
            localStorage.setItem("rootPage", "index.html");
            $.mobile.changePage('index.html', 'slideUp');
            $('.user_nickname').append("Bentornato " + localStorage.getItem("nickname"));
            $('.user_photo').attr("src",localStorage.getItem("photo"));
            $('.logout').show();
            $('.userform').hide();
            $('.chkauth').show();
        }).error(function jsError(jqXHR, textStatus, errorThrown) {
//            $.mobile.hidePageLoadingMsg();
            var error = JSON.parse(jqXHR.responseText);
            alert(error.message);
        });
    });

    $('.logout_button').click(function() {
//        $.mobile.showPageLoadingMsg();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: 'http://' + host + '/users/sign_out.json?',
            data: {
//                        user: {
                email: localStorage.getItem("email"),
//                        }
            }
        }).success(function jsSuccess(data, textStatus, jqXHR) {
//            $.mobile.hidePageLoadingMsg();
            console.log(data);
            console.log(textStatus);
            console.log(jqXHR);
            localStorage.clear();
            $.mobile.changePage('index.html', 'slideUp');
            $('.user_nickname').text("");
            $('.user_photo').attr("src","#");
            $('.logout').hide();
            $('.userform').show();
            $('.chkauth').hide();
        }).error(function jsError(jqXHR, textStatus, errorThrown) {
//            $.mobile.hidePageLoadingMsg();
            var error = JSON.parse(jqXHR.responseText);
            alert(error.message);
        });
    });
});