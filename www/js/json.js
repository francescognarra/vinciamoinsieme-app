$("#results").bind("pagecreate", function (e) {
    getLastResults();
});
var getLastResults = function () {
    var listItem = '';
    var apiURL = 'http://' + host + '/results.json?callback=?';
    $.getJSON(apiURL, function (data) {
        $.each(data, function (key, value) {
            var match = value.match;
            var bet = value.bet['title'];
            var user = value.user['nickname'];
            var date = new Date(value.created_at);
            var result = value.result;
            var date_formatted = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
            if (result == null) {
                listItem += '<li><h4><a>' + match + " " + bet + '</a></h4><p style="text-align:right;">' + user + " @ " + date_formatted + '</p></li>';
            }
            else if (!result) {
                listItem += '<li><h4><a class="ui-icon-delete ui-btn-icon-left">' + match + " " + bet + '</a></h4><p style="text-align:right;">' + user + " @ " + date_formatted + '</p></li>';
            }
            else if (result) {
                listItem += '<li><h4><a class="ui-icon-check ui-btn-icon-left">' + match + " " + bet + '</a></h4><p style="text-align:right;">' + user + " @ " + date_formatted + '</p></li>';
            }
        });
        $('#showList').append(listItem);
        $("#showList").listview("refresh");
    });
};

$("#matches").bind("pagebeforeshow", function (e) {
    getBetContainerResults();
    getNextMatches();
    $('#showMatchesList').on('tap', 'li.active', function () {
        localStorage.setItem("showMatch",
            $(this).attr('data-show-match'));
        $.mobile.changePage('#match_bet', { transition: "none" });
    });
});
var getNextMatches = function () {
    $('#showMatchesList').html("");
    var listItem = '';
    var apiURL = 'http://' + host + '/leagues/' + localStorage.getItem("league_id") + '/next_matches.json?callback=?';
    $.getJSON(apiURL, function (data) {
        $.each(data, function (key, value) {
            var day = value.day;
            var time = value.time;
            var home = value.home;
            var away = value.away;
            var result = value.result;
            if (result.indexOf("?") == -1) {
                listItem += '<li data-show-match="' + home + ' - ' + away + '"><h3>' + home + ' - ' + away + ' ' + result + '</h3></li>';
            } else {
                listItem += '<li class="active" data-show-match="' + home + ' - ' + away + '"><a href="#" data-transition="slide"><h3>' + home + ' - ' + away + '</h3></a></li>';
            }
        });
        $('#showMatchesList').append(listItem);
        $("#showMatchesList").listview("refresh");
    });
};


$("#match_bet").bind("pagebeforeshow", function (e) {
    var showMatch = localStorage.getItem("showMatch");
    $('#showMatch').html(showMatch);
    getBets();

});

var getBets = function () {
    var apiURL = 'http://' + host + '/bets.json?callback=?';
    var betsList = '<fieldset data-role="controlgroup"><legend>Scegli un pronostico:</legend>';
    $.getJSON(apiURL, function (data) {
        $.each(data, function (key, value) {
            var id = value.id;
            var title = value.title;
            betsList += '<input type="radio" name="bet_id" id="radio-choice-' + id + '" value="' + id + '" /><label for="radio-choice-' + id + '">' + title + '</label>';
        });
        $('#bets_list').html(betsList);
        $('[type="radio"]').checkboxradio();
    });

};

$('#do_bet').click(function () {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: 'http://' + host + '/results/create_json.json?',
        data: {
            bet_id: $('input[name="bet_id"]:checked').val(),
            match: localStorage.getItem("showMatch"),
            bet_container_id: localStorage.getItem("bc_id"),
            auth_token: localStorage.getItem("auth_token")
        }
    }).success(function jsSuccess(data, textStatus, jqXHR) {
        console.log(data);
        console.log(textStatus);
        console.log(jqXHR);
        $.mobile.changePage('#matches', { transition: "none" });
    }).error(function jsError(jqXHR, textStatus, errorThrown) {
        var error = JSON.parse(jqXHR.responseText);
        alert(error.message);
    });
});

$("#ranking").bind("pagebeforeshow", function (e) {
    getRanking();
});
var getRanking = function () {
    $('#rankingBody').html("");
    var rows = '';
    var apiURL = 'http://' + host + '/leagues/' + localStorage.getItem("league_id") + '/ranking.json?callback=?';
    $.getJSON(apiURL, function (data) {
        $.each(data, function (key, value) {
            var position = value.position;
            var team = value.team;
            var points = value.points;
            var gf = value.gf;
            var gs = value.gs;
            rows += '<tr><td>' + position + '</td><td>' + team + '</td><td>' + points + '</td><td>' + gf + '</td><td>' + gs + '</td></tr>';
        });
        $('#rankingBody').append(rows);
    });
};

$("#leagues").bind("pagecreate", function (e) {
    getLeagues();
    $('#showLeagueList').on('tap', 'li', function () {
        localStorage.setItem("league_id",
            $(this).attr('data-league-id'));
        $.mobile.changePage('#matches', { transition: "none" });
    });
});
$("#leagues").bind("pagebeforeshow", function (e) {
    getBetContainerResults();
});
var getLeagues = function () {
    var listItem = '';
    var apiURL = 'http://' + host + '/leagues.json?callback=?';
    $.getJSON(apiURL, function (data) {
        $.each(data, function (key, value) {
            var id = value.id;
            var title = value.title;
            var logo = value.logo_url;
            listItem += '<li class="ui-btn ui-btn-icon-right ui-icon-carat-r" data-league-id="' + id + '"><img src="http://' + host + logo + '" /><h3><a href="#" data-transition="slide">' + title + '</a></h3></li>';
        });
        $('#showLeagueList').append(listItem);
        $("#showLeagueList").listview("refresh");
    });
};

$("#bet_containers").bind("pagecreate", function (e) {
    getBetContainers();
    $('#showBetContainerList').on('tap', 'li', function () {
        localStorage.setItem("bc_id",
            $(this).attr('data-bc-id'));
        $.mobile.changePage('#leagues', { transition: "none" });
    });
});
var getBetContainers = function () {
    var listItem = '';
    var apiURL = 'http://' + host + '/bet_containers.json?callback=?&auth_token=' + localStorage.getItem("auth_token");
    $.getJSON(apiURL, function (data) {
        $.each(data, function (key, value) {
            var id = value.id;
            var date = new Date(value.created_at);
            var date_formatted = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
            var group_name = value.group['name']
            listItem += '<li class="ui-btn ui-btn-icon-right ui-icon-carat-r" data-bc-id="' + id + '"><h3><a href="#" data-transition="slide">' + group_name + '<br/>creata il ' + date_formatted + '</a></h3></li>';
        });
        $('#showBetContainerList').append(listItem);
        $("#showBetContainerList").listview("refresh");
    });
};

var getBetContainerResults = function () {
    var listItem = '';
    $('.bc_results').html("");
    var apiURL = 'http://' + host + '/bet_containers/' + localStorage.getItem("bc_id") + '.json?callback=?&auth_token=' + localStorage.getItem("auth_token");
    $.getJSON(apiURL, function (data) {
        $.each(data.results, function (key, value) {
            listItem += '<li><p>' + value.result['match'] + '&nbsp;' + value.result['bet']['title'] + '</p><p style="text-align: right">' + value.result['user']['nickname'] + '</p></li>';
        })
        $('.bc_results').append(listItem);
        $(".bc_results").listview("refresh");
    });
};