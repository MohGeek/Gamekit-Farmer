chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	if(window.location.href.startsWith(RECAPTCHA_URL)){
		switch(msg.text) {
			case CAN_I_VOTE:
				var recaptcha = document.getElementsByClassName("recaptcha-checkbox")[0];
				if(recaptcha){
					recaptcha.click();
					sendResponse(FILL_CAPTCHA);
				}
				break;
		}
	}else if(window.location.href.startsWith(GAMEKIT_URL)){		
		switch(msg.text) {
			case CAN_I_VOTE:
				var recaptcha = document.getElementById(RECAPTCHA_SUBMIT_ID);
				if(!recaptcha){
					sendResponse(VOTE);
				}
				break;
			case CHECK_CAPTCHA_IMAGES:
				if(document.getElementsByClassName("g-recaptcha-bubble-arrow")[0].parentElement.style.visibility == 'hidden'){
					sendResponse(SEND_CAPTCHA);
				}else{
					sendResponse(NOTIFY_CAPTCHA);
				}
				break;
			case CHECK_IF_FILLED:
				if(document.getElementsByClassName("g-recaptcha-bubble-arrow")[0].parentElement.style.visibility == 'hidden'){
					sendResponse(SEND_CAPTCHA);
				}else{
					sendResponse(CHECK_IF_FILLED);
				}
				break;
		}
	}
});