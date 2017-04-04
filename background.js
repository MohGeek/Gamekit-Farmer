var tabId;

function voteListener(tabId, info){
	if(info.status=="complete"){
		chrome.tabs.onUpdated.removeListener(voteListener);
		canIVote(Math.floor(Math.random() * 300) + 300);
	}
}

function sendCaptchaListener(tabId, info){
	if(info.status=="complete"){
		chrome.tabs.onUpdated.removeListener(sendCaptchaListener);
		canIVote(Math.floor(Math.random() * 1000) + 3500);
	}
}

function canIVote(duration){
	chrome.tabs.executeScript(tabId,{file:"content.js"});
	setTimeout(function() {
		chrome.tabs.sendMessage(tabId, {text: CAN_I_VOTE}, vote);
	}, duration);
}

function vote(response){
	switch(response){
		case VOTE:
			var mark = Math.floor(Math.random() * 5);
			chrome.tabs.onUpdated.addListener(voteListener);
			chrome.tabs.executeScript(tabId, {code:'document.getElementsByClassName("' + VOTE_CLASS_NAME + '")[0].children[' + mark + '].click();'});
			break;
		case FILL_CAPTCHA:
			setTimeout(function() {
				chrome.tabs.sendMessage(tabId, {text: CHECK_CAPTCHA_IMAGES}, vote);
			}, Math.floor(Math.random() * 1000) + 3500);
			break;
		case NOTIFY_CAPTCHA:
			var notification = new Notification('A captcha needs to be filled');
			setTimeout(function() {
				chrome.tabs.sendMessage(tabId, {text: CHECK_IF_FILLED}, vote);
			},  Math.floor(Math.random() * 300) + 3000);
			break;
		case CHECK_IF_FILLED:
			setTimeout(function() {
				chrome.tabs.sendMessage(tabId, {text: CHECK_IF_FILLED}, vote);
			},  1000);
			break;
		case SEND_CAPTCHA:
			chrome.tabs.onUpdated.addListener(sendCaptchaListener);
			chrome.tabs.executeScript(tabId, {code:'document.getElementById("' + RECAPTCHA_SUBMIT_ID + '").click();'});
			break;
	}
}

function init(url){
	chrome.tabs.create({'url': url}, function(tab){
		tabId = tab.id;
		setTimeout(function() {
			chrome.tabs.sendMessage(tabId, {text: CAN_I_VOTE}, vote);
		},  Math.floor(Math.random() * 300) + 3000);
	});
}

function main(){
	init(GAMEKIT_URL);
}

chrome.browserAction.onClicked.addListener(main);
