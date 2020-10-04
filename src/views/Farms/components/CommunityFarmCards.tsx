import BigNumber from 'bignumber.js'
import React, { useEffect, useState } from 'react'
import Countdown, { CountdownRenderProps } from 'react-countdown'
import styled, { keyframes } from 'styled-components'
import { useWallet } from 'use-wallet'
import Button from '../../../components/Button'
import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import CardIcon from '../../../components/CardIcon'
import Loader from '../../../components/Loader'
import Spacer from '../../../components/Spacer'
import { Farm } from '../../../contexts/Farms'
import useAllStakedValue, {
  StakedValue,
} from '../../../hooks/useAllStakedValue'
import useFarms from '../../../hooks/useFarms'
import useSushi from '../../../hooks/useSushi'
import {getEarned, getMasterChefContract, getPoolSingleWeight, getPoolWeight} from '../../../sushi/utils'
import { bnToDec } from '../../../utils'
import {getBalanceNumber} from "../../../utils/formatBalance";
import useEarnings from "../../../hooks/useEarnings";
import {supportedPools} from "../../../sushi/lib/constants";
import UNIV2PairAbi from "../../../sushi/lib/abi/uni_v2_lp.json";
import ERC20Abi from "../../../sushi/lib/abi/erc20.json";

interface FarmWithStakedValue extends Farm, StakedValue {
  apy: BigNumber
}

const FarmCards: React.FC = () => {
  //const [farms] = useFarms()
  const [farms, setFarms] = useState(localStorage.getItem("pools") ? JSON.parse(localStorage.getItem("pools")) : [])

  const { account } = useWallet()
  const sushi = useSushi()

    const { ethereum }: { ethereum: any } = useWallet()
    // @ts-ignore
    window.eth = ethereum
    const chainId = Number(ethereum.chainId)

  useEffect(() => {
    async function fetchFarms() {
      //const [farms] = useFarms()
      let pools = await supportedPools(sushi, getMasterChefContract(sushi), chainId, false, ethereum);
      setFarms(pools)

    }
    fetchFarms()
  }, [sushi, setFarms])

  //const stakedValue = useAllStakedValue(farms)

  let rows = farms.reduce(
      (farmRows : any, farm : any, i : any) => {
        const sushiIndex = 1
        const sushiPrice = new BigNumber(farms[sushiIndex].value.tokenPriceInWeth)
        console.log("sushi price " + sushiPrice)

        const BLOCKS_PER_YEAR = new BigNumber(2336000)
        const SUSHI_PER_BLOCK = new BigNumber(1000)

        const farmWithStakedValue = {
          ...farm,
          ...farms[i].value,
          apy: (farms[i].value && sushiPrice.toNumber() > 0)
              ? sushiPrice
                  .times(SUSHI_PER_BLOCK)
                  .times(BLOCKS_PER_YEAR)
                  .times(farms[i].value.poolWeight)
                  .div(farms[i].value.totalWethValue)
              : null,
        }
        const newFarmRows = [...farmRows]
          if (![0,1,14,11,2,3,4,5,6,7].includes(farm.pid)) {
              if (newFarmRows[newFarmRows.length - 1].length === 3) {
                  newFarmRows.push([farmWithStakedValue])
              } else {
                  newFarmRows[newFarmRows.length - 1].push(farmWithStakedValue)
              }
          }
        return newFarmRows
      },
      [[]],
  )

  return (
      <StyledCards>
        {!!rows[0].length ? (
            rows.map((farmRow : any, i : any) => (
                <StyledRow key={i}>
                  {farmRow.map((farm : any, j : any) => (
                      <React.Fragment key={j}>
                        <FarmCard farm={farm} />
                        {(j === 0 || j === 1) && <StyledSpacer />}
                      </React.Fragment>
                  ))}
                </StyledRow>
            ))
        ) : (
            <StyledLoadingWrapper>
              <Loader text="Preparing the toaster ..." />
            </StyledLoadingWrapper>
        )}
      </StyledCards>
  )
}

interface FarmCardProps {
  farm: FarmWithStakedValue
}

const FarmCard: React.FC<FarmCardProps> = ({ farm }) => {
  const [startTime, setStartTime] = useState(0)
  const [harvestable, setHarvestable] = useState(0)
  const [poolWeight, setPoolWeight] = useState(0)

  const { account } = useWallet()
  const { lpTokenAddress } = farm
  const sushi = useSushi()
  const earned = useEarnings(farm.pid)

  const renderer = (countdownProps: CountdownRenderProps) => {
    const { hours, minutes, seconds } = countdownProps
    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
    const paddedHours = hours < 10 ? `0${hours}` : hours
    return (
        <span style={{ width: '100%' }}>
        {paddedHours}:{paddedMinutes}:{paddedSeconds}
      </span>
    )
  }

  useEffect(() => {
    async function fetchEarned() {
      setHarvestable(getBalanceNumber(earned))
    }
    async function fetchWeight() {
      const weight = await getPoolSingleWeight(getMasterChefContract(sushi), farm.pid)
      setPoolWeight(weight.toNumber() / 1000)
    }
    fetchEarned()
    if (sushi) {
      fetchWeight()
    }
  }, [sushi, lpTokenAddress, earned, setHarvestable, setPoolWeight])

  const poolActive = true // startTime * 1000 - Date.now() <= 0

  return (
      <StyledCardWrapper>
        {farm.pid === 1 && <StyledCardAccent />}
        <Card>
          <CardContent>
            <StyledContent>
              <CardIcon>{farm.icon}</CardIcon>
              <StyledTitle>{farm.name}</StyledTitle>
              <StyledDetails>
                <StyledDetail>Add <a href={farm.lpToken.endsWith("BPT") ? "https://pools.balancer.exchange/#/pool/" + farm.lpTokenAddress + "/" : (farm.lpTokenAddress !== farm.tokenAddress ? "https://uniswap.info/pair/" : "https://etherscan.io/token/") + farm.lpTokenAddress} target={"_blank"} style={{color: "#805e49"}}>{farm.lpToken.toUpperCase()}</a></StyledDetail>
                <StyledDetail style={{fontSize: 10, marginTop: 5, marginBottom: 5}}>({farm.lpTokenAddress})</StyledDetail>
                <StyledDetail>Make {farm.earnToken.toUpperCase()} {poolWeight > 1 ? <span>(<strong>{poolWeight}x</strong> Rewards)</span> : ""}</StyledDetail>
              </StyledDetails>

              <Spacer />

              <Button
                  disabled={!poolActive}
                  text={poolActive ? 'Select' : undefined}
                  to={`/farms/${farm.lpTokenAddress}`}
              >
                {!poolActive && (
                    <Countdown
                        date={new Date(startTime * 1000)}
                        renderer={renderer}
                    />
                )}
              </Button>
              <Spacer />

              {harvestable > 0 &&
              <StyledDetailsHarvest>
                {harvestable.toLocaleString('en-US',  { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TOAST ready
              </StyledDetailsHarvest>
              }

              {harvestable <= 0 &&
              <StyledDetailsHarvest>
                &nbsp;
              </StyledDetailsHarvest>
              }

              <StyledInsight>
                    <span>Estimated APY</span>
                    <span>
                {farm.apy
                    ? `${farm.apy
                        .times(new BigNumber(100))
                        .toNumber()
                        .toLocaleString('en-US')
                        .slice(0, -1) || "???"}%`
                    : 'Loading ...'}
              </span>
                    {/* <span>
                {farm.tokenAmount
                  ? (farm.tokenAmount.toNumber() || 0).toLocaleString('en-US')
                  : '-'}{' '}
                {farm.tokenSymbol}
              </span>
              <span>
                {farm.wethAmount
                  ? (farm.wethAmount.toNumber() || 0).toLocaleString('en-US')
                  : '-'}{' '}
                ETH
              </span> */}
                  </StyledInsight>
            </StyledContent>
          </CardContent>
        </Card>
      </StyledCardWrapper>
  )
}

const RainbowLight = keyframes`
  
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  animation: ${RainbowLight} 2s linear infinite;
  border-radius: 12px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: -1;
`

const StyledCards = styled.div`
  width: 900px;
  @media (max-width: 768px) {
    width: 100%;
  }
`

const StyledLoadingWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`

const StyledRow = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.theme.spacing[4]}px;
  flex-flow: row wrap;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: center;
  }
`

const StyledCardWrapper = styled.div`
  display: flex;
  width: calc((900px - ${(props) => props.theme.spacing[4]}px * 2) / 3);
  position: relative;
`

const StyledTitle = styled.h4`
  color: ${(props) => props.theme.color.grey[600]};
  font-size: 24px;
  font-weight: 700;
  margin: ${(props) => props.theme.spacing[2]}px 0 0;
  padding: 0;
`

const StyledContent = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
`

const StyledSpacer = styled.div`
  height: ${(props) => props.theme.spacing[4]}px;
  width: ${(props) => props.theme.spacing[4]}px;
`

const StyledDetails = styled.div`
  margin-top: ${(props) => props.theme.spacing[2]}px;
  text-align: center;
`

const StyledDetailsHarvest = styled.div`
  margin-top: ${(props) => props.theme.spacing[2]}px;
  text-align: center;
  color: #d16c00;
`

const StyledDetail = styled.div`
  color: ${(props) => props.theme.color.grey[500]};
`

const StyledInsight = styled.div`
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  border-radius: 8px;
  background: #fffdfa;
  color: #aa9584;
  width: 100%;
  margin-top: 12px;
  line-height: 32px;
  font-size: 13px;
  border: 1px solid #e6dcd5;
  text-align: center;
  padding: 0 12px;
`

export default FarmCards