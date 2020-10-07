import { useCallback } from 'react'

import useSushi from './useSushi'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import {approve, getHeadChefContract, getMasterChefContract} from '../sushi/utils'

const useApprove = (lpContract: Contract, headChef = false) => {
  const { account }: { account: string; ethereum: provider } = useWallet()
  const sushi = useSushi()
  let masterChefContract = ""
  if (headChef) {
    masterChefContract = getHeadChefContract(sushi)
  }
  else {
    masterChefContract = getMasterChefContract(sushi)
  }

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterChefContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, lpContract, masterChefContract])

  return { onApprove: handleApprove }
}

export default useApprove
