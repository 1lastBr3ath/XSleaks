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

const WHITELISTS = `
.mil
.gov
2900larocca.dk
9apps.com
9game.cn
activpn.com
addepar.com
addeparvum.com
aetkasmart.de
affinity.co
agilebits.com
airbnb-aws.com
airbnbcitizen.com
airbnb.com
airtable.com
alditalk-kundenbetreuung.de
algolia.net
algolianet.com
alibaba.com
alibabagroup.com
alibaba-inc.com
alibabapictures.com
alibabaplanet.com
alicdn.com
aliexpress.com
aligame.com
alihealth.cn
alimama.com
alios.cn
alipay.com
aliqin.cn
alisports.com
alitrip.com
aliyun.com
allseason.net
amap.com
amazon.com
angha.me
anghami.com
apinetflix.com
arxius.io
ashleymadison.com
as.im
astaro.at
astaro.ch
astaro.com
astaro.de
astaroedu.com
astaro.info
astaro.net
astaro.org
astaro-security.com
astaro-tech.com
atairbnb.com
authy.com
autoconfig.de
autoconfig.email
autoconfig.nl
autoconfig.w
autodiscover.busines
autodiscover.cn
autodiscover.co
autodiscover.de
autodiscover.e
autodiscover.email
autodiscover.exchange
autodiscover.fr
autodiscover.in
autodiscover.info
autodiscover.nl
autodiscover.ru
autodiscover.u
autodiscover.w
autonavi.com
autumn.net
ayyildiz.de
base.de
berush.com
betterscience.org
binance.com
binary.com
bitbucket.io
bitdefender.com
bitdefender.net
blau.de
blauworld.de
blinksale.com
blogger.com
booztx.com
buddypress.org
bugcrowd.com
buildkiteartifacts.com
buildkiteassets.com
buildkite.com
buildkiteusercontent.com
byairbnb.com
cadre.com
caffeine.tv
cainiao.com
CAR10.net
cash.me
cbhq.net
cesppa.com
claritymoney.com
cobinhood.com
coinbase.com
coinfalcon.com
coinjar.com
colourbox.com
colourbox.de
colourbox.dk
concrete5.org
content.team
cougarlife.com
creditkarma.com
criteo.com
criteo.net
cudasvc.com
custhelp.com
cuvva.co
cuvva.com
cyberoam.com
cylance.com
damai.cn
data.com
dayu.com
defense.gov
deliveroo.com
deliveroo-data.io
deliveroo-data.net
deliveroo-data-test.io
deliveroo.net
delivery-club.ru
detectify.com
dev.media
dev.service
dev.support
dev.tool
dev.travel
digitaloceanspaces.com
dingtalk.com
directly.com
dns.ee
download.im
drchrono.com
drchronomedia.com
duckduckgo.com
dynoquant.com
dyson.com
earn.com
ebay-kleinanzeigen.de
editors.team
electroneum.com
envy.ph
establishedmen.com
etao.com
eventbrite.com
facebook.com
fanduel.com
fb.com
fb.me
fdbox.net
flickr.com
fliggy.com
fonic.de
fonic-mobile.de
force.com
freelancer.com
freemarket.com
freya.net
ftp.eu
ftp.gallery
ftp.in
ftp.media
ftp.new
fuzzing-project.org
fw-notify.net
gatecoin.com
geeny.io
getaltx.com
getmevo.com
getpostman.com
getsentry.com
getsentry.net
getsidekick.com
github.com
gitlab.com
gitter.im
gmail.com
gojekapi.com
goldman.com
goldmansachs.com
goodhire.com
google.com
gotinder.com
grab.co
grab.com
grabtaxi.com
grammarly.io
grammarly.net
gsam.com
gs.com
guardian.service
gusto.com
gusto-demo.com
hacker.one
hackerone.com
hackerone-ext-content.com
hackerone.net
hackerone-user-content.com
hboeck.de
healthifyme.com
highwebmedia.com
hitmanpro.com
hitmanpro.nl
honestdollar.com
hosted.by
hs-sites.com
hubapi.com
hubspot.com
hubspot.net
hulu.com
huluqa.com
ibm.com
icq.com
icq.net
identity.com
igpayment.com
ikarem.io
inbound.org
indeed.com
innogames.com
innogames.de
instagram.com
instapaper.com
intercomassets.com
intercomcdn.com
irccloud-cdn.com
irccloud.com
isc2cares.org
joomla.org
k-classic-mobil.de
kpn.com
labs-semrush.com
lamoda.ru
leantesting.com
leaseweb.com
letgo.com
liberapay.com
liberapay.org
library.co
lifeomic.com
live.com
live.net
livestream.com
load.support
localhost.cc
localhost.live
localhost.net
login.gov
lootdog.io
luxuryretreats.com
lync.com
ly.st
lyst.ca
lyst.com
made.by
magicleap.com
mail.biz
mail.black
mail.ci
mail.co
mail.eu
mail.exchange
mail.fr
mail.info
mail.jp
mail.media
mail.new
mail.pic
mail.plu
mail.support
mail.uk
mail.vip
mail.world
mapbox.com
marcus.com
mei.com
meraki.com
messenger.com
mevo.com
minodes.com
MIT.edu
mixmax.com
mojave.net
mozilla.net
mozilla.org
muscache.com
mx1.email
myastaro.com
mybank.cn
mykeymanager.com
myteksi.com
myteksi.net
naijatuale.com
nerdwallet.com
nero.cc
netflix.com
nettokom.de
network-auth.com
netzclub.net
newrelic.com
nflxext.com
nflximg.net
nflxvideo.net
nitata.com
nolimitvpn.com
norma-mobil.de
notjet.net
o2business.de
o2.de
o2online.de
o2service.de
oath.com
odnoklassniki.ru
office.com
ok.ru
onedrive.com
onpatient.com
ortelmobile.de
outlook.com
overstock.com
owncloud.com
owncloud.help
owncloud.org
owox.com
pandora.com
paydiant.com
paypal.com
payu.com
p-cdn.com
pegasus.cc
periscope.tv
pinterest.com
platform.sh
postman.co
prod.tool
pro.glas
pscp.tv
pstmn.io
purevpn.com
quantshack.com
quora.com
ratelimited.me
reflexion.net
remind.com
rets.io
rets.ly
retsly.com
rocket-internet.com
rocket-internet.de
s48.a
salesforce.com
salesforceiq.com
salesforceliveagent.com
salesforce.org
Sandboxie.com
savagebeast.com
season.net
secnews.gr
securegatewayaccess.com
secure.team
semrush.com
sfox.com
sharepoint.com
shenjing.com
shopify.com
shuqi.com
shuqireader.com
simfinity.de
simple.com
skyfish.com
skyscanner.com
skyscanner.net
sm.cn
smule.com
snapchat.com
soku.com
solarcity.com
sophos.com
spam.cn
spotflux.com
sproutsocial.com
square.com
squareup.com
staging-airtableblocks.com
staging.service
starbucks.ca
starbucks.com
starbucks.de
starbucks.fr
start.ru
summer.net
surfright.nl
sway.com
symphony.com
tech.team
telefonica.de
tesla.cn
tesla.com
teslamotors.com
tesla.service
tesla.services
test2.shop
test.exchange
test.support
theendlessweb.com
thefacebook.com
tinder.com
tmall.com
tornado.ee
tudou.com
tweetdeck.com
twilio.com
twimg.com
twitter.com
uber.com
uberinternal.com
ubnt.com
uc.cn
ucweb.com
udemy.com
umeng.com
upserve.com
upwork.com
urbandictionary.com
urbandictionary.net
vanillacommunities.com
vanilladevelopment.com
vanillaforums.com
vanillastaging.com
venmo.com
veritone.com
vhx.tv
vimeo.com
vine.co
vivy.com
warriorforum.com
webdisk.cloud
webdisk.cn
webdisk.de
webdisk.it
webdisk.me
webdisk.tech
webmail.blog
webmail.support
whatsapp.com
whatsapp.net
whatsappsim.de
who-is-using-me.com
will-never-love.me
withairbnb.com
wolfman.co
wordcamp.org
wordpress.net
wordpress.org
wrath.ph
xiami.com
xoom.com
yahoo.com
yahoo.net
yammer.com
ycombinator.com
yelp.com
youku.com
youneedabudget.com
youtube.com
yunos.com
zellepay.com
zendesk.com
zeus.cc
zmbk.co
zoma.to
zomatobook.com
zomato.com
z.tt
zynga.com
zyngagames.com
`;

const BLACKLISTS = `
https://www.google.com/search?
https://developer.mozilla.org/en-US/docs/
https://www.youtube.com/(watch|embed|search|results|playlist|channel)?
`;

const reset = () => {
  PATTERNS = {
    window   :[window.length],
    frames   :[frames.length],
    history  :[history.length],
    //resource :[performance.getEntriesByType('resource').length],
  };
  NOTIFIED = false;
  console.table(PATTERNS);
  // delete history if > 2
  if(history.length>2) delete(PATTERNS['history']);
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
      NOTIFIED=true;
}

const record = () => {
  Object.entries(PATTERNS).forEach(([key,value]) => {
    const CURRENT_VALUE = window[key].length;
    const PREVIOUS_VALUE = value[value.length-1];
    if(CURRENT_VALUE != PREVIOUS_VALUE){
      PATTERNS[key].push(CURRENT_VALUE);
      const SAVED_URLS = localStorage['XSLINKS'] || '';
      const CURRENT_URL = document.URL.replace(/[?&;]utm_\w+?=[^&;]+/ig, '');
      if(!NOTIFIED && !SAVED_URLS.includes(CURRENT_URL+'\n')){
        notify(CURRENT_URL);
        localStorage['XSLINKS'] = SAVED_URLS + CURRENT_URL + '\n';
      }
      console.table(PATTERNS);
    }
  });
}

reset();
//if(WHITELISTS.split('\n').filter(url=>url&&document.domain.endsWith(url.trim()))!=false){
  const parts = document.domain.split('.').reverse();
  const pattern = new RegExp(`^[\\w.]*${parts[1]}\\.${parts[0]}$`, 'mu');
  const match = WHITELISTS.match(pattern);
  if(match && document.domain.endsWith(match)){
    if(false==BLACKLISTS.split('\n').filter(url=>{return(url && new RegExp('^'+url.replace(/[.*+?/\\[{'^"}\]&$]/g, '\\$&'), 'mu').test(document.URL))})){
      TIMER = setInterval(record, 100);
      setTimeout(notify, 1000 * 30, document.URL, TIMER);
      const observer = new MutationObserver(record);
      observer.observe(document.documentElement, {childList:true,attributes:true,subtree:true});
    }
  }
//}
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
