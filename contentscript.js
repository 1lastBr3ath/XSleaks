'use strict';

/*************************
    1. window.length
    2. frames.length
    3. history.length
    4. performance.getEntriesByType('resource') // seems to be of NO HELP
*************************/

let PATTERNS;
const CHANNEL_ID = '-281857647';
const TOKEN = '824308319:AAGzNYLsgrpHnDBCebEdTnT64ESdO9vKTIg';
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}/sendMessage?parse_mode=HTML&disable_web_page_preview=true&chat_id=${CHANNEL_ID}`;

const reset = () => {
  PATTERNS = {
    window   :[window.length],
    frames   :[frames.length],
    history  :[history.length],
    //resource :[performance.getEntriesByType('resource').length],
  };
  localStorage['XSLINKS'] = localStorage['XSLINKS']||'';
}

const notify = url => {
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
  let NOTIFIED = false;
  const CURRENT_URL = document.URL.replace(/[?&;]utm_\w+?=[^&;]+/ig, '');
  if((localStorage['XSLINKS']||'').includes(CURRENT_URL+'\n')) return;
  localStorage['XSLINKS'] += CURRENT_URL + '\n';
  Object.entries(PATTERNS).forEach(([key,value]) => {
    const CURRENT_VALUE = window[key].length;
    const PREVIOUS_VALUE = value[value.length-1];
    if(!NOTIFIED && CURRENT_VALUE != PREVIOUS_VALUE){
      PATTERNS[key].push(CURRENT_VALUE);
      notify(CURRENT_URL);
      NOTIFIED = true;
    }
  });
  if(NOTIFIED) console.table(PATTERNS);
}

reset();
const observer = new MutationObserver(record);
observer.observe(document.documentElement, {childList:true,attributes:true,subtree:true});
