Object.defineProperty(exports, "__esModule", {
  value: true
});

const rootCas = require('ssl-root-cas').create();
rootCas.addFile(__dirname + '/cas/ca_bundle.crt');
rootCas.addFile(__dirname + '/cas/gdig2.crt.pem');

exports.RootCas = rootCas;
exports.default = rootCas;