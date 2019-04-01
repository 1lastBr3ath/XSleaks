'use strict';

/*************************
    1. window.length
    2. frames.length
    3. history.length
    4. performance.getEntriesByType('resource')
*************************/

let COUNT;
let NOTIFIED;
let CURRENT_URL;

let PATTERNS;
let LAST_PATTERNS;

const reset = () => {
  COUNT = 5;
  NOTIFIED = false;
  CURRENT_URL = document.URL;
  PATTERNS = {
    window   :'',
    frames   :'',
    //history  :'',
    //resource :'',
  };
  LAST_PATTERNS = Object.assign({}, PATTERNS);
}

const clean = (item,match,replace) => {
  // delete repeated items
  LAST_PATTERNS[item] = PATTERNS[item] = PATTERNS[item].replace(match,replace);
}

const notify = url => { // notify only once??
  //chrome.runtime.sendMessage({url: url});
  if(document.URL!=CURRENT_URL || !NOTIFIED){
      NOTIFIED = true;
      CURRENT_URL = document.URL;
      fetch('//raw.cm2.pw/',{
        mode:'no-cors',
        method:'POST',
        credentials:'omit',
        referrer:'no-referrer',
        headers: {'Content-type':'text/plain'},
        body: `${CURRENT_URL}\n${JSON.stringify(PATTERNS)}`,
      });
  }
}

const record = () => {
  if(CURRENT_URL!=document.URL) reset();  // TODO: doesn't work well with touch.facebook.com
  Object.keys(PATTERNS).forEach(pattern => {
    PATTERNS[pattern] += ('resource'!=pattern ? window[pattern].length : performance.getEntriesByType('resource').length)+',';
  });
  // clean repeated counts
  if(PATTERNS['window'].length > COUNT){  // COUNT = 5
    Object.entries(PATTERNS).forEach(item => {
      let matches;
      const pattern = new RegExp(`(\\d+,)\\1{${parseInt(COUNT/2)},}$`);
      if(matches=item[1].match(pattern)){
        clean(item[0],matches[0],matches[1]);
      }
      else if(LAST_PATTERNS[item[0]]!=item[1]){
        console.table(item);
        notify(document.URL);
        LAST_PATTERNS[item[0]] = item[1];
      }
    });
  }
  //console.table(PATTERNS);
  //console.log('LAST_PATTERN', LAST_PATTERNS);
}

const observer = new MutationObserver(record);
observer.observe(document.documentElement, {childList:true,attributes:true,subtree:true});
