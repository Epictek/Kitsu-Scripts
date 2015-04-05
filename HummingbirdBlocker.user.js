// ==UserScript==
// @name        HummingbirdBlocker
// @namespace   HummingbirdBlocker
// @description HummingbirdBlocker
// @updateURL https://github.com/Epictek/Hummingbird-scripts/HummingbirdBlocker.user.js
// @downloadURL https://github.com/Epictek/Hummingbird-scripts/HummingbirdBlocker.user.js
// @version     1
// @run-at document-end
// @grant		none

// @match       *://hummingbird.me/*

// ==/UserScript==

var blocked = ["Akemi_Ayu"];

function removePosts(){
	$.each($('.story'), function(){
		var title = $(this).find('.update-panel .user-info-bar .comment-content .story-title').text();
		title = title.trim();
		if(blocked.indexOf(title) > -1){
	    	$(this).remove();
		}
	});
	removeComments();
}

function removeComments () {
	$.each($('.reply'), function(){
		var user = $(this).find('.username').text();
		user = user.trim();
		if(blocked.indexOf(user) > -1){
	    	$(this).remove();
		}
	});
}

setInterval(function() {
	removePosts();
}, 300);
