var Referer = require('referer-parser');
var referer_urls = [
    'http://www.google.com/search?q=gateway+oracle+cards+denise+linn&hl=en&client=safari',
    'https://twitter.com/snormore/status/524524090938245120',
    'http://www.bing.com/search?q=test&go=Submit&qs=n&form=QBLH&pq=test&sc=9-4',
];
for (var _i = 0, referer_urls_1 = referer_urls; _i < referer_urls_1.length; _i++) {
    var referer_url = referer_urls_1[_i];
    var r = new Referer(referer_url);
    console.log(referer_url);
    console.log("known: ".concat(r.known, ", with referer: ").concat(r.referer, " medium: ").concat(r.medium, ", "));
}
