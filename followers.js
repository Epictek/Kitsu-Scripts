//TODO
//Beter unfollow dialog, List users in a div with an unfollow button

function getUser() {
    var user_cookie = document.cookie.replace(/(?:(?:^|.*;\s*)ajs_user_id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    var user = user_cookie.substring(user_cookie.indexOf('-') + 1, user_cookie.length - 3);
    return user;
}

var username = getUser();

var followerspage = 1;
var followers = [];
var a = false;

var getFollowers = setInterval(function() {
    $.get("https://hummingbird.me/users?followers_of=" + username + "&page=" + followerspage, function(data) {
        console.log(data);
        if(data.users.length === 0) {
            clearInterval(getFollowers);
            a = true;
            getNonFollowers();
        } else {
            $.each(data.users, function(i, u) {
                followers.push(u.id);
            });
            console.log(followers);
        }
    });
    followerspage++;
}, 500);

var followingpage = 1;
var following = [];
var b = false;

var getFollowing = setInterval(function() {
    $.get("https://hummingbird.me/users?followed_by=" + username + "&page=" + followingpage, function(data) {
        console.log(data);
        if(data.users.length === 0) {
            clearInterval(getFollowing);
            b = true;
            getNonFollowers();
        } else {
            $.each(data.users, function(i, u) {
                following.push(u.id);
            });
            console.log(following);
        }
    });
    followingpage++;
}, 500);

function getNonFollowers() {
    if(a === true && b === true) {
        var nonFollowers = [];
        $.each(following, function(i, value) {
            if($.inArray(value, followers) == -1) {
                nonFollowers.push(value);
                console.log("Non follower: " + value);
            }
        });
        console.log(nonFollowers);
        $.each(nonFollowers, function(i, user) {
            if(confirm("Do you want to unfollow " + user + "?")){
                $.post("https://hummingbird.me/users/" + user + "/follow")
            }
        });
    } else {
        return;
    }
}