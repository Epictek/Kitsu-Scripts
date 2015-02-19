var username = prompt("Enter your hummingbird username:")

var followerspage = 1;
var followers = [];
var a = false;

var getFollowers = setInterval(function () {
	$.get( "https://hummingbird.me/users?followers_of=" + username + "&page="+ followerspage, function(data){
		console.log(data);
		if(data.users.length === 0){
			clearInterval(getFollowers);
			a = true;
			getNonFollowers();
		}else{
			$.each(data.users, function(i, u){
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

var getFollowing = setInterval(function () {
	$.get( "https://hummingbird.me/users?followed_by=" + username + "&page="+ followingpage, function(data){
		console.log(data);
		if(data.users.length === 0){
			clearInterval(getFollowing);
			b = true;
			getNonFollowers();
		}else{
			$.each(data.users, function(i, u){
				following.push(u.id);
			});
			console.log(following);
		}
	});
	followingpage++;
}, 500);


function getNonFollowers () {
	if(a === true && b === true){

		var notfollowing = [];
		$.each(following, function(id, value){
		  if ($.inArray(value,followers) == -1) {
		    notfollowing.push(value);
		  }
		});

		console.log(notfollowing);
		$.each(notfollowing, function(i, user){
			var d = confirm("Do you want to unfollow " + user + "?");
			if (d == true) {
				$.post("https://hummingbird.me/users/" + user + "/follow")
			}
		});
	}else{
		return;
	}
}
