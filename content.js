chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	if(window.location.href.startsWith(RECAPTCHA_URL)){
		switch(msg.text) {
			case CAN_I_VOTE:
				var recaptcha = document.getElementsByClassName("recaptcha-checkbox")[0];
				if(recaptcha){
					recaptcha.click();
					sendResponse({order: FILL_CAPTCHA, refreshId: msg.refreshId});
				}
				break;
		}
	}else if(window.location.href.startsWith(GAMEKIT_URL)){		
		switch(msg.text) {
			case CAN_I_VOTE:
				var recaptcha = document.getElementById(RECAPTCHA_SUBMIT_ID);
				if(!recaptcha){
					sendResponse({order: VOTE, refreshId: msg.refreshId});
				}
				break;
			case CHECK_CAPTCHA_IMAGES:
				if(document.getElementsByClassName("g-recaptcha-bubble-arrow")[0].parentElement.style.visibility == 'hidden'){
					sendResponse({order: SEND_CAPTCHA, refreshId: msg.refreshId});
				}else{
					sendResponse({order: NOTIFY_CAPTCHA, refreshId: msg.refreshId});
				}
				break;
			case CHECK_CAPTCHA_STATUS:
				if(document.getElementsByClassName("g-recaptcha-bubble-arrow")[0].parentElement.style.visibility == 'hidden'){
					sendResponse({order: SEND_CAPTCHA, refreshId: msg.refreshId});
				}else{
					sendResponse({order: CHECK_IF_FILLED, refreshId: msg.refreshId});
				}
				break;
		}
	}
});