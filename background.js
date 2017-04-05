var tabId;
var refreshId;
var lastVote;
var interval;


/**
* Checks if the tab is stuck for too long
*/
function watcher(){
	sinceLastVote = Math.abs((Date.now() - lastVote) / 1000);
	if(sinceLastVote > 45){
		console.log("Tab stuck for 45 seconds, refreshing;");
		refreshId = Date.now();
		chrome.tabs.onUpdated.addListener(voteListener);
		chrome.tabs.reload(tabId);
	}
}

function voteListener(tabId, info){
	if(info.status=="complete"){
		chrome.tabs.onUpdated.removeListener(voteListener);
		canIVote(Math.floor(Math.random() * 300) + 800);
	}
}

function sendCaptchaListener(tabId, info){
	if(info.status=="complete"){
		chrome.tabs.onUpdated.removeListener(sendCaptchaListener);
		canIVote(Math.floor(Math.random() * 1000) + 1500);
	}
}

function canIVote(duration){
	chrome.tabs.executeScript(tabId,{file:"content.js"});
	setTimeout(function() {
		chrome.tabs.sendMessage(tabId, {text: CAN_I_VOTE, refreshId: refreshId}, vote);
	}, duration);
}

function vote(response){
	if(typeof response != 'undefined' && response.refreshId == refreshId){
		lastVote = Date.now();
		switch(response.order){
			case VOTE:
				var mark = Math.floor(Math.random() * 5);
				chrome.tabs.onUpdated.addListener(voteListener);
				chrome.tabs.executeScript(tabId, {code:'document.getElementsByClassName("' + VOTE_CLASS_NAME + '")[0].children[' + mark + '].click();'});
				break;
			case FILL_CAPTCHA:
				setTimeout(function() {
					chrome.tabs.sendMessage(tabId, {text: CHECK_CAPTCHA_IMAGES, refreshId: refreshId}, vote);
				}, Math.floor(Math.random() * 1000) + 4500);
				break;
			case NOTIFY_CAPTCHA:
				var notification = new Notification('A captcha needs to be filled');
				var myAudio = new Audio();
				myAudio.src = "popup.mp3";
				myAudio.play();
				setTimeout(function() {
					chrome.tabs.sendMessage(tabId, {text: CHECK_CAPTCHA_STATUS, refreshId: refreshId}, vote);
				},  Math.floor(Math.random() * 300) + 3000);
				break;
			case CHECK_IF_FILLED:
				setTimeout(function() {
					chrome.tabs.sendMessage(tabId, {text: CHECK_CAPTCHA_STATUS, refreshId: refreshId}, vote);
				},  1000);
				break;
			case SEND_CAPTCHA:
				chrome.tabs.onUpdated.addListener(sendCaptchaListener);
				chrome.tabs.executeScript(tabId, {code:'document.getElementById("' + RECAPTCHA_SUBMIT_ID + '").click();'});
				break;
		}
	}else{
		console.log('Wrong response: ' + response);
	}
}

function init(url){
	chrome.tabs.create({'url': url}, function(tab){
		tabId = tab.id;
		refreshId = Date.now();
		setTimeout(function() {
			lastVote = Date.now();
			interval = setInterval(watcher, 5000);
			chrome.tabs.sendMessage(tabId, {text: CAN_I_VOTE, refreshId: refreshId}, vote);
		},  Math.floor(Math.random() * 300) + 3000);
	});
}

function main(){
	init(GAMEKIT_URL);
}

chrome.browserAction.onClicked.addListener(main);
