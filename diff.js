const BLOCKERS = 'script,applet,object,param,embed,frame[src],frame[srcdoc],iframe[src],iframe[srcdoc],meta[http-equiv="set-cookie"],meta[http-equiv="refresh"],base[href],form[action],input[formaction],button[formaction],link[rel="import"],[href^="javascript:"]';

const ATTRIBUTES = {
  'a'       : 'href',
  'script'  : 'src', // could also use innerText
  'object'  : 'classid,data,type',
  'applet'  : 'code,object',
  'param'   : 'name,value',
  'embed'   : 'code,src,type',
  'frame'   : 'src,srcdoc',
  'iframe'  : 'src,srcdoc',
  'base'    : 'href',
  'form'    : 'action',
  'input'   : 'formaction',
  'button'  : 'formaction',
  'meta'    : 'http-equiv', // {'http-equiv': 'refresh,set-cookie'},
  'link'    : 'href', // only rel="import" elements are selected from blockers function
}

const compare = async (url, tabId) => {
  let abody;
  let ubody;
  try{
    let [authd_status, authd_body] = await send(url);
    let [unauthd_status, unauthd_body] = await send(url, 'omit');
    
    if(authd_status != unauthd_status){
      throw({message:{[authd_status]:unauthd_status}});
    }
    
    abody = authd_body;
    ubody = unauthd_body;
  }
  catch(e){
    return(chrome.tabs.sendMessage(tabId, {url:url,body:e.message}));
  }
  
  let diffs = [];
  const attr_pattern = /<([a-z]+)[ /][^>]*?(on[a-z]+?)\s*=\s*['"]?/suim;
  const [,tag,attr] = abody.match(attr_pattern) || [''];  // TODO: needs improvement
  const authd = blockers(abody, BLOCKERS + (tag&&`,${tag}[${attr}]`||''));
  
  authd.forEach(i=>{  // looping over authd assuming authd responses have more number of blockers
    let SELECTOR;
    const tag = i.tagName.toLowerCase();
    const attributes = ATTRIBUTES[tag].split(',');
    const [,,attr] = i.outerHTML.match(attr_pattern) || [''];
    if(attr) attributes.push(attr);
    let avalues = [];
    attributes.forEach(attr=>{
      value=i.getAttribute(attr);
      if(value) return(avalues.push(`${attr}="${value}"`));
      delete(attributes[attributes.indexOf(attr)]);
    });
    
    switch(tag){
      case 'link':
        SELECTOR = 'link[rel="import"][href]';
        break;
      case 'script':
        SELECTOR = 'script' + (avalues[0]?'[src]':'');
        break;
      case 'meta':
        SELECTOR = 'meta[http-equiv="refresh"],meta[http-equiv="set-cookie"]';
        break;
      default:
        SELECTOR = tag+JSON.stringify(attributes).replace(/\bnull,|(?<!\\)"/g,'').replace(/\\"/g,'"').replace(/,/g,']['); // a little hack to make it a SELECTOR
    }
    
    // check these against unauthd
    const unauthd = blockers(ubody, SELECTOR);
    
    unauthd.forEach(elem=>{
      let uvalues=[];
      if('script'==tag && !elem.hasAttribute('src')){
        avalues.push(i.innerHTML.substring(0,200));
        uvalues.push(elem.innerHTML.substring(0,200));
      } // take only upto 200 chars
      else uvalues = attributes.map(attr=>`${attr}="${elem.getAttribute(attr)}"`);
      if(!equals(avalues, uvalues)) diffs.push(`<${tag} ${avalues.join(" ")}>`);
    });
  });
  if(diffs = [...new Set(diffs)]) chrome.tabs.sendMessage(tabId, {url:url,body:diffs.join('\n').replace(/[&]/g, i=>escape(i))});
}

const equals = (a, b) => {  // used for array comparison
  a = a.sort();
  b = b.sort();
  return a.every((v,i)=>v?v==b[i]:true);  // ignore falsy elements
}

const send = async (url, credentialed='include') => {
  const response = await fetch(url, {credentials: credentialed, referrer: url, redirect: 'manual'});
  //const headers = response.headers;
  const status = response.status;
  const body = await response.text();
  return([status,body]);
}

const blockers = (body, selector) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(body, 'text/html');
  return doc.querySelectorAll(selector);
}
