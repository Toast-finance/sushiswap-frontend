import React, { useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'
import useFarm from '../../hooks/useFarm'
import useRedeem from '../../hooks/useRedeem'
import useSushi from '../../hooks/useSushi'
import { getMasterChefContract } from '../../sushi/utils'
import { getContract } from '../../utils/erc20'
import Harvest from './components/Harvest'
import Stake from './components/Stake'
import {ModalProps} from "../../components/Modal";
import BigNumber from "bignumber.js";

interface FarmProps extends ModalProps {
  isCommunity: boolean
}

const Farm: React.FC<FarmProps> = ({isCommunity = true}) => {
  const { farmId } = useParams()
  const {
    pid,
    lpToken,
    lpTokenAddress,
    tokenAddress,
    earnToken,
    name,
    icon,
    decimals,
  } = useFarm(farmId, isCommunity) || {
    pid: 0,
    lpToken: '',
    lpTokenAddress: '',
    tokenAddress: '',
    earnToken: '',
    name: '',
    icon: '',
    decimals: 18,
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const sushi = useSushi()
  const { ethereum } = useWallet()

  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpTokenAddress)
  }, [ethereum, lpTokenAddress])

  const { onRedeem } = useRedeem(getMasterChefContract(sushi))

  const lpTokenName = useMemo(() => {
    return lpToken.toUpperCase()
  }, [lpToken])

  const earnTokenName = useMemo(() => {
    return earnToken.toUpperCase()
  }, [earnToken])

  return (
    <>
      <PageHeader
        icon={icon}
        subtitle={`Deposit ${lpTokenName}  Tokens and earn ${earnTokenName}`}
        title={name}
      />
      <StyledInfo>
        🏆<b>Pro Tip</b>: To get ${lpTokenName}, {lpTokenName.endsWith("BPT") ? <a href={"https://pools.balancer.exchange/#/pool/" + lpTokenAddress + "/"} target={"_blank"}>add liquidity to the Balancer pool</a> : (lpTokenAddress !== tokenAddress ? <a href={"https://uniswap.info/pair/" + lpTokenAddress} target={"_blank"}>add liquidity to the Uniswap pair</a> : <a href={"https://etherscan.io/token/" + lpTokenAddress} target={"_blank"}>find the token through Etherscan</a>)}.<br />Please do your own research about how liquidity pools operate before you do this.<br />If the liquidity pool contains HOUSE, please be aware that HOUSE has no decimals and that your balance may be rounded when you withdraw.
      </StyledInfo>
      <br />
      <StyledFarm>
        <StyledCardsWrapper>
          <StyledCardWrapper>
            <Harvest pid={pid} />
          </StyledCardWrapper>
          <Spacer />
          <StyledCardWrapper>
            <Stake
              lpContract={lpContract}
              pid={pid}
              tokenName={lpToken.toUpperCase()}
              decimals={decimals}
            />
          </StyledCardWrapper>
        </StyledCardsWrapper>
        <Spacer size="lg" />
        <StyledInfo>
          ⭐️ Every time you stake and unstake, the contract will
          automagically harvest TOAST rewards for you!
        </StyledInfo>
        <Spacer size="lg" />
      </StyledFarm>
    </>
  )
}

const StyledFarm = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledCardsWrapper = styled.div`
  display: flex;
  width: 600px;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 80%;
  }
`

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[400]};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;
`

export default Farm
