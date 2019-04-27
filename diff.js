const compare = async (url, tabId) => {
  let response;
  let pattern = /(?:(?:<(?:script|object|param|embed|applet|i?frame|meta|base|form|input|button)[\s/]+[^>]+?(?:^on|src|href|data|classid|code|srcdoc|action|formaction)\s*=)|<script|['" ]javascript:(?!void)).{30}/gsuim;

  try{
    response = await fetch(url, {credentials: 'include'});
    //const authed_headers = response.headers;
    const authed_body = await response.text();
    
    response = await fetch(url, {credentials: 'omit', redirect: 'error'});
    //const unauthed_headers = response.headers;
    const unauthed_body = await response.text();
    
    const authd = authed_body.match(pattern);
    const unauthd = unauthed_body.match(pattern);
    
    pattern = /(?:^on|src|href|data|classid|code|srcdoc|action|formaction)\s*=\s*(['"]).+$/gsuim;
    
    let diffs = [];
    authd.forEach(i=>{
    	const ai = i.match(pattern)[0];
    	const ui = unauthd.filter(i=>i.includes(ai));
    	if(false==ui) diffs.push(ai || ui.join(' < - > '));
    });
    chrome.tabs.sendMessage(tabId, {url:url,body:diffs.join('%0a').replace(/[?;&]/g, i=>escape(i))});
  }
  catch(e){
    chrome.tabs.sendMessage(tabId, {url:url,body:e.message});
  }
}
