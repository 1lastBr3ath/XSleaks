'use strict';

/*************************
    1. window.length
    2. frames.length
    3. history.length
    4. performance.getEntriesByType('resource') // seems to be of NO HELP
*************************/

let TIMER;
let PATTERNS;
const CHANNEL_ID = '-395531536';
const TOKEN = '824308319:AAGzNYLsgrpHnDBCebEdTnT64ESdO9vKTIg';
let TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}/sendMessage?disable_web_page_preview=true&chat_id=${CHANNEL_ID}`;

const reset = () => {
  PATTERNS = {
    window   :[window.length],
    frames   :[frames.length],
    history  :[history.length],
    //resource :[performance.getEntriesByType('resource').length],
  };
  console.table(PATTERNS);
  // delete history if > 2
  if(history.length>2) delete(PATTERNS['history']);
}

const notify = (msg, clear=false) => {
      if(clear){
        clearInterval(TIMER);
        if(Object.values(PATTERNS).filter(i=>i.length>1)==false) return;
      }
      const SAVED_URLS = sessionStorage['XSLINKS'] || '';
      const CURRENT_URL = msg.url.replace(/[?&;]utm_\w+?=[^&;]+/ig, '');
      if(!SAVED_URLS.includes(CURRENT_URL+'\n')){
        let body = JSON.stringify(msg.body);//.replace(/&/g,'%26'));
        let headers = {'Content-type':'application/x-www-form-urlencoded'};
        if(body.length>2000){ // send as document if body > 2000 bytes
          body = new FormData();
          body.append('caption', msg.url);
          body.append('document', new Blob([msg.body], {type:'text/html'}), 'diff.txt');

          headers['Content-type'] = 'multipart/form-data';
          TELEGRAM_API = TELEGRAM_API.replace('sendMessage', 'sendDocument');
        }
        else{
          body = `text=${escape(msg.url)}%0a${body}`;
          TELEGRAM_API = TELEGRAM_API.replace('sendDocument', 'sendMessage');
        }
        fetch(TELEGRAM_API, {
          body        : body,
          method      : 'POST',
          credentials : 'omit',
          headers     : headers,
          mode        : 'no-cors',
          referrerPolicy:'no-referrer',
        });
        sessionStorage['XSLINKS'] = SAVED_URLS + CURRENT_URL + '\n';
      }
      console.table(msg.body);
}

const record = () => {
  Object.entries(PATTERNS).forEach(([key,value]) => {
    const CURRENT_VALUE = window[key].length;
    const PREVIOUS_VALUE = value[value.length-1];
    if(CURRENT_VALUE != PREVIOUS_VALUE){
      PATTERNS[key].push(CURRENT_VALUE);
      notify({url:document.URL,body:PATTERNS});
      console.table(PATTERNS);
    }
  });
}

reset();
chrome.runtime.onMessage.addListener(msg=>{
  const rhost = new URL(msg.url).hostname;
  const lhost = new URL(document.URL).hostname;
  if(!lhost.endsWith(rhost.match(/[^.]+\.\w+$/iu)[0])) return;

  if('xsproceed'!=msg.body) return(notify(msg));

  TIMER = setInterval(record, 100);
  setTimeout(notify, 1000 * 30, {url:document.URL, body:PATTERNS}, true);
  const observer = new MutationObserver(record);
  observer.observe(document.documentElement, {childList:true,attributes:true,subtree:true});
});
/*
TODO:
- Compare 2 authd responses instead of authd vs unauthd because unauthd requests mostly redirect to login page
- Check if the unauthed request gets redirected to 3rd domain (i.e. the domain change on redirect) -> it's possible to detect redirect to 3rd domain with CSP
- Check if the unauthed request's Content-type differ or have XFO un/set or have different XXP
*/
