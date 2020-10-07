import { useCallback } from 'react'

import useSushi from './useSushi'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import {approve, getHeadChefContract, getMasterChefContract, boost} from '../sushi/utils'

const useBoost = (pid : number) => {
  const { account }: { account: string; ethereum: provider } = useWallet()
  const sushi = useSushi()
  const headChefContract = getHeadChefContract(sushi)

  const handleBoost = useCallback(async () => {
    try {
      const tx = await boost(pid, headChefContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, pid, headChefContract])

  return { onBoost: handleBoost }
}

export default useBoost
