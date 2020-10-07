import { useCallback } from 'react'

import useSushi from './useSushi'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import {approve, getHeadChefContract, getMasterChefContract, boost, add} from '../sushi/utils'

const useAdd = (token : string) => {
  const { account }: { account: string; ethereum: provider } = useWallet()
  const sushi = useSushi()
  const headChefContract = getHeadChefContract(sushi)

  const handleAdd = useCallback(async () => {
    try {
      const tx = await add(token, headChefContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, token, headChefContract])

  return { onAdd: handleAdd }
}

export default useAdd
