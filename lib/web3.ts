import Web3 from 'web3'

export const initWeb3 = async () => {
  const ethereum = (window as any).ethereum
  await ethereum.enable()
  return new Web3(ethereum)
}
