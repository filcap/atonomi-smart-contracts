const AtonomiToken = artifacts.require('AMLToken')
const SafeMathLib = artifacts.require('SafeMathLib')
const Atonomi = artifacts.require('Atonomi')
const NetworkSettings = artifacts.require('NetworkSettings')
const init = require('../test/helpers/init')
const web3Utils = require('web3-utils')

module.exports = function (deployer, network, accounts) {
  if (network !== 'development') return

  const actors = init.getTestActorsContext(accounts)
  const owner = actors.owner

  const tokenDecimals = 18
  const multiplier = 10 ** tokenDecimals
  const regFee = 1 * multiplier
  const actFee = 1 * multiplier
  const repReward = 1 * multiplier
  const reputationShare = 20
  const blockThreshold = 5760 // assuming 15s blocks, 1 write per day
  const deviceReg = 'apple-iphone1'
  const deviceAct = 'apple-iphone2'
  const deviceRegIdHash = web3Utils.soliditySha3({t: 'bytes32', v: web3.fromAscii(deviceReg)})
  const deviceRegPubKey = '0x9c274091da1ce47bd321f272d66b6e5514fb82346d7992e2d1a3eefdeffed791'
  const deviceActPubKey = '0x4a984091da1ce47bd321f272d66b6e5514fb82346d7992e2d1a3eefdeffed353'

  let a, t
  deployer.deploy(SafeMathLib)
  deployer.link(SafeMathLib, AtonomiToken)
  deployer.deploy(AtonomiToken, 'Atonomi Token', 'ATMI', 1000000000000000000000000000, tokenDecimals, false, {from: owner})
    .then(() => deployer.deploy(NetworkSettings,
      regFee, actFee,
      repReward,
      reputationShare,
      blockThreshold,
      {from: owner}))

    .then(() => deployer.deploy(Atonomi,
      AtonomiToken.address,
      NetworkSettings.address,
      {from: owner}))
}
