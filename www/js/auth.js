$(document).ready(function() {
    if (localStorage.getItem("auth_token") != null) {
        $.mobile.changePage('index.html', 'slideUp');
    }
//    if (localStorage.getItem("nickname") != null) {
//        $('#user_info').append("Bentornato " + localStorage.getItem("nickname"));
//    }

    $('#login_button').click(function() {
        $.mobile.showPageLoadingMsg();
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
            $.mobile.hidePageLoadingMsg();
            console.log(data);
            console.log(textStatus);
            console.log(jqXHR);
            localStorage.setItem('auth_token', data.authentication_token);
            localStorage.setItem('nickname', data.nickname);
            localStorage.setItem("email", data.email);
            localStorage.setItem("rootPage", "index.html");
            $.mobile.changePage('index.html', 'slideUp');
            $('.user_nickname').append("Bentornato " + localStorage.getItem("nickname"));
            $('.userform').hide();
        }).error(function jsError(jqXHR, textStatus, errorThrown) {
            $.mobile.hidePageLoadingMsg();
            var error = JSON.parse(jqXHR.responseText);
            alert(error.message);
        });
    });
});