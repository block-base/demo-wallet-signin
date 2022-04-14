import Web3 from 'web3'

export default async (_ctx, inject) => {
  if (process.server) return

  if (window.ethereum) {
    inject('plainEthereum', window.ethereum)
  }

  if (window.web3) {
    inject('plainWeb3', window.web3)
  }

  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    try {
      await window.ethereum.enable()
    } catch (e) {
      console.error(e)
      return
    }
  } else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  } else {
    return
  }

  const web3 = new Web3(window.web3.currentProvider)
  inject('web3', web3)

  const ethereum = {}
  inject('ethereum', ethereum)
}
