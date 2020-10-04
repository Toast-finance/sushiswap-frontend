import Web3 from 'web3'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'
import ERC20ABI from '../constants/abi/ERC20.json'

export const getContract = (provider: provider, address: string) => {
  const web3 = new Web3(provider)
  const contract = new web3.eth.Contract(
    (ERC20ABI.abi as unknown) as AbiItem,
    address,
  )
  return contract
}

export const getAllowance = async (
  lpContract: Contract,
  masterChefContract: Contract,
  account: string,
): Promise<string> => {
  try {
    const allowance: string = await lpContract.methods
      .allowance(account, masterChefContract.options.address)
      .call()
    return allowance
  } catch (e) {
    return '0'
  }
}

export const getBalance = async (
  provider: provider,
  tokenAddress: string,
  userAddress: string,
): Promise<string> => {
  const lpContract = getContract(provider, tokenAddress)
  try {
    const balance: string = await lpContract.methods
      .balanceOf(userAddress)
      .call()
    return balance
  } catch (e) {
    return '0'
  }
}

export const getSymbol = async (
    provider: provider,
    tokenAddress: string,
): Promise<string> => {
  const lpContract = getContract(provider, tokenAddress)
  try {
    const balance: string = await lpContract.methods
        .symbol()
        .call()
    return balance
  } catch (e) {
    return '1'
  }
}

export const getNormalizedWeight = async (
    provider: provider,
    tokenAddress: string,
): Promise<Number> => {
  const lpContract = getContract(provider, tokenAddress)
  try {
    const balance: Number = await lpContract.methods
        .getNormalizedWeight("0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
        .call()
    return balance
  } catch (e) {
    console.log(e.toString())
    return 500000000000000000
  }
}

export const getToken0 = async (
    provider: provider,
    tokenAddress: string,
): Promise<string> => {
  const lpContract = getContract(provider, tokenAddress)
  try {
    const balance: string = await lpContract.methods
        .token0()
        .call()
    return balance
  } catch (e) {
    return '0'
  }
}

export const getToken1 = async (
    provider: provider,
    tokenAddress: string,
): Promise<string> => {
  const lpContract = getContract(provider, tokenAddress)
  try {
    const balance: string = await lpContract.methods
        .token1()
        .call()
    return balance
  } catch (e) {
    return '0'
  }
}
