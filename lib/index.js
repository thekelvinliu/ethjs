'use strict';

var EthQuery = require('ethjs-query');
var EthFilter = require('ethjs-filter');
var EthContract = require('ethjs-contract');
var HttpProvider = require('ethjs-provider-http');
var unit = require('ethjs-unit');
var keccak256 = require('js-sha3').keccak_256;
var toBN = require('number-to-bn');
var BN = require('bn.js');
var utils = require('ethjs-util');
// require buffer if it isn't present
var Buf = typeof Buffer === 'undefined' ? require('buffer') : Buffer;

module.exports = Eth;

/**
 * Returns the ethjs Eth instance.
 *
 * @method Eth
 * @param {Object} cprovider the web3 standard provider object
 * @param {Object} options the Eth options object
 * @returns {Object} eth Eth object instance
 * @throws if the new flag is not used in construction
 */

function Eth(cprovider, options) {
  if (!(this instanceof Eth)) {
    throw new Error('[ethjs] the Eth object requires you construct it with the "new" flag (i.e. `const eth = new Eth(...);`).');
  }
  var self = this;
  self.options = options || {};
  self.setProvider = function (provider) {
    var query = new EthQuery(provider, self.options.query);
    self.currentProvider = provider;
    Object.keys(Object.getPrototypeOf(query)).forEach(function (methodName) {
      self[methodName] = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return query[methodName].apply(query, args);
      };
    });
    self.filter = new EthFilter(query, self.options.query);
    self.contract = new EthContract(query, self.options.query);
  };
  self.setProvider(cprovider);
}

Eth.BN = BN;
Eth.isAddress = function (val) {
  return utils.isHexString(val, 20);
};
Eth.keccak256 = function (val) {
  return '0x' + keccak256(val);
};
Eth.Buffer = Buf;
Eth.isHexString = utils.isHexString;
Eth.fromWei = unit.fromWei;
Eth.toWei = unit.toWei;
Eth.toBN = toBN;
Eth.fromAscii = utils.fromAscii;
Eth.toAscii = utils.toAscii;
Eth.fromUtf8 = utils.fromUtf8;
Eth.toUtf8 = utils.toUtf8;
Eth.HttpProvider = HttpProvider;