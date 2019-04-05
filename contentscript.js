'use strict';

/*************************
    1. window.length
    2. frames.length
    3. history.length
    4. performance.getEntriesByType('resource') // seems to be of NO HELP
*************************/

let TIMER;
let PATTERNS;
let NOTIFIED;
const CHANNEL_ID = '-281857647';
const TOKEN = '824308319:AAGzNYLsgrpHnDBCebEdTnT64ESdO9vKTIg';
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}/sendMessage?parse_mode=HTML&disable_web_page_preview=true&chat_id=${CHANNEL_ID}`;

const reset = () => {
  PATTERNS = {
    window   :[window.length],
    frames   :[frames.length],
    //history  :[history.length],
    //resource :[performance.getEntriesByType('resource').length],
  };
  NOTIFIED = false;
  console.table(PATTERNS);
}

const notify = (url, clear=false) => {
      if(clear){
        clearInterval(TIMER);
        if(Object.values(PATTERNS).filter(i=>i.length>1)==false) return;
      }
      fetch(TELEGRAM_API, {
        mode:'no-cors',
        method:'POST',
        credentials:'omit',
        referrerPolicy:'no-referrer',
        body: `text=${encodeURIComponent(url)}\n${JSON.stringify(PATTERNS)}`,
        headers: {'Content-type':'application/x-www-form-urlencoded'},
      });
}

const record = () => {
  Object.entries(PATTERNS).forEach(([key,value]) => {
    const CURRENT_VALUE = window[key].length;
    const PREVIOUS_VALUE = value[value.length-1];
    if(CURRENT_VALUE != PREVIOUS_VALUE){
      PATTERNS[key].push(CURRENT_VALUE);
      if(!NOTIFIED){
        NOTIFIED = true;
        notify(document.URL.replace(/[?&;]utm_\w+?=[^&;]+/ig, ''));
      }
      console.table(PATTERNS);
    }
  });
}

reset();
TIMER = setInterval(record, 100);
setTimeout(notify, 1000 * 30, document.URL, TIMER);
const observer = new MutationObserver(record);
observer.observe(document.documentElement, {childList:true,attributes:true,subtree:true});

/***** From @terjanq *****/
/*
 var lastLength = -1;
    var start = Date.now();
    var int = setInterval(()=>{
        if(window.length != lastLength){
            lastLength = window.length;
            console.log(lastLength, Date.now() - start);
        }
    },100);
  setTimeout(clearInterval, 10000, int);
*/
