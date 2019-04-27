const compare = async (url, tabId) => {
  let response;
  let pattern = /(?:(?:<(?:script|object|param|embed|applet|i?frame|meta|base|form|input|button)[\s/]+[^>]+?(?:^on|src|href|data|classid|code|srcdoc|action|formaction)\s*=)|<script|['" ]javascript:(?!void)).{50}/gsuim;

  try{
    response = await fetch(url, {credentials: 'include', referrer: url});
    //const authed_headers = response.headers;
    const authed_status = response.status;
    const authed_body = await response.text();
    
    response = await fetch(url, {credentials: 'omit', redirect: 'manual'});
    //const unauthed_headers = response.headers;
    const unauthed_status = response.status || 302;
    const unauthed_body = await response.text();
    
    if(authed_status != unauthed_status){
      throw({message:{[authed_status]:unauthed_status}});
    }
    const authd = authed_body.match(pattern) || [];
    const unauthd = unauthed_body.match(pattern) || [];
    
    pattern = /<script|['" ]javascript:(?!void)|(?:^on|src|href|data|classid|code|srcdoc|action|formaction)\s*=\s*(['"]).+/gsuim;
    
    let diffs = [];
    authd.forEach(i=>{
    	const ai = i.match(pattern)[0];
    	const ui = unauthd.filter(i=>i.includes(ai));
    	if(false==ui) diffs.push(ai || ui.join(' < - > '));
    });
    diffs.length && chrome.tabs.sendMessage(tabId, {url:url,body:diffs.join('%0a').replace(/[?;&\s]/g, i=>escape(i))});
  }
  catch(e){
    chrome.tabs.sendMessage(tabId, {url:url,body:e.message});
  }
}
