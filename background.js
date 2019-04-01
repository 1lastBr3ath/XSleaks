const notify = url => {
  chrome.notifications.create({
    priority: 2,
    type    : 'basic',
    message : `URL: ${url}`,
    title   : 'Potential XS leak',
    iconUrl : 'http://cm2.pw/favicon.ico'
  });
}

chrome.notifications.onClicked.addListener(id => {
    //chrome.notifications.clear(id);
    //window.open('about:blank', 'xsleaks').document.write(JSON.stringify(PATTERNS));
});

chrome.runtime.onMessage.addListener(message => notify(message.url));
