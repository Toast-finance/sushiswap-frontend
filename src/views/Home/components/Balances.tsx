import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import numeral from 'numeral'
import {useWallet} from 'use-wallet'

import Card from '../../../components/Card'
import CardContent from '../../../components/CardContent'
import Label from '../../../components/Label'
import Spacer from '../../../components/Spacer'
import Value from '../../../components/Value'
import YamIcon from '../../../components/SushiIcon'

import useFarms from '../../../hooks/useFarms'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnharvested from '../../../hooks/useUnharvested'
import useYam from '../../../hooks/useSushi'
import useBlock from '../../../hooks/useBlock'
import useAllEarnings from '../../../hooks/useAllEarnings'
import useAllStakedValue from '../../../hooks/useAllStakedValue'

import {bnToDec} from '../../../utils'
import {getBalanceNumber} from '../../../utils/formatBalance'
import {getSushiSupply, getSushiContract} from '../../../sushi/utils'
import {getSushiAddress} from '../../../sushi/utils'
import BigNumber from 'bignumber.js'
import CountUp from 'react-countup'
import AccountButton from "../../../components/TopBar/components/AccountButton";

const PendingRewards: React.FC = () => {
    const [start, setStart] = useState(0)
    const [end, setEnd] = useState(0)
    const [scale, setScale] = useState(1)

    const allEarnings = useAllEarnings()
    let sumEarning = 0
    for (let earning of allEarnings) {
        sumEarning += new BigNumber(earning)
            .div(new BigNumber(10).pow(18))
            .toNumber()
    }

    useEffect(() => {
        setStart(end)
        setEnd(sumEarning)
    }, [sumEarning])

    return (
        <span
            style={{
                transform: `scale(${scale})`,
                transformOrigin: 'right bottom',
                transition: 'transform 0.5s',
                display: 'inline-block',
            }}
        >
      <CountUp
          start={start}
          end={end}
          decimals={end < 0 ? 4 : end > 1e5 ? 0 : 3}
          duration={1}
          onStart={() => {
              setScale(1.25)
              setTimeout(() => setScale(1), 600)
          }}
          separator=","
      />
    </span>
    )
}

const Balances: React.FC = () => {
    const [totalSupply, setTotalSupply] = useState<BigNumber>()
    const [TVL, setTVL] = useState<Number>()

    const yam = useYam()
    const sushiBalance = useTokenBalance(getSushiAddress(yam))
  const houseBalance = useTokenBalance("0x19810559df63f19cfe88923313250550edadb743")
  const avoBalance = useTokenBalance("0x774adc647a8d27947c8d7c098cdb4cdf30b126de")
  const eggsBalance = useTokenBalance("0x98be5a6b401b911151853d94a6052526dcb46fe3")
  const {account, ethereum}: { account: any; ethereum: any } = useWallet()

    const block = useBlock()
    const startBlock = 10750000
    const farmStarted = ethereum && block >= startBlock

    const [farms] = useFarms()
    const allStakedValue = useAllStakedValue()

    useEffect(() => {
        async function fetchTotalSupply() {
            const supply = await getSushiSupply(yam)
            setTotalSupply(supply)
        }

        function fetchTVL() {
            if (allStakedValue && allStakedValue.length) {
                const sumWeth = farms.reduce(
                    (c, {id}, i) => c + (allStakedValue[i].totalWethValue.toNumber() || 0),
                    0,
                )

                console.log('Total ETH value LPs represent =', sumWeth, 'ETH')
                console.log(
                    farms.map(({tokenSymbol}, i) => {
                        console.log(
                            tokenSymbol,
                            allStakedValue[i].tokenAmount.toNumber(),
                            allStakedValue[i].totalWethValue.toNumber(),
                            'ETH',
                        )
                    }),
                )

                setTVL(sumWeth);
            }
        }

        if (yam) {
            fetchTotalSupply()
        }
        fetchTVL()
    }, [yam, setTotalSupply, allStakedValue, farms, setTVL])

    return (
        <div>
            <StyledWrapper>
                <Card>
                    <CardContent>
                        <Label text="Total Value Locked"/>
                        {!!account && TVL > 0 &&
                        <StyledValue>{TVL.toFixed(3)} ETH</StyledValue>
                        }
                        {!!account && TVL == null &&
                        <StyledValue>Loading ...</StyledValue>
                        }
                        {!!!account &&
                        <AccountButton />
                        }
                    </CardContent>
                </Card>
            </StyledWrapper>
            <br />
            <StyledWrapper>
                <Card>
                    <CardContent>
                        <StyledBalances>
                            <StyledBalance>
                                <YamIcon icon={"🏠"}/>
                                <Spacer/>
                                <div style={{flex: 1}}>
                                  <StyledBalanceHeader>
                                    <Label text="Your HOUSE Balance"/>
                                    <StyledBalanceLink
                                      href="https://uniswap.info/token/0x19810559df63f19cfe88923313250550edadb743"
                                      rel="noreferrer noopner"
                                      target="_blank"
                                    >Get HOUSE</StyledBalanceLink>
                                  </StyledBalanceHeader>
                                    {!!account &&
                                    <Value
                                        value={getBalanceNumber(houseBalance) * Math.pow(10, 18)}
                                        decimals={0}
                                    />
                                    }
                                    {!!!account &&
                                    <AccountButton />
                                    }
                                </div>
                            </StyledBalance>
                        </StyledBalances>
                    </CardContent>
                </Card>
                <Spacer/>

                <Card>
                    <CardContent>
                        <Label text="Total HOUSE Supply (fixed)"/>
                        <StyledValue>20,000</StyledValue>
                    </CardContent>
                </Card>
            </StyledWrapper>
          <br />
          <StyledWrapper>
            <Card>
              <CardContent>
                <StyledBalances>
                  <StyledBalance>
                    <YamIcon icon={"🥑"}/>
                    <Spacer/>
                    <div style={{flex: 1}}>
                      <StyledBalanceHeader>
                        <Label text="Your AVO Balance"/>
                        <StyledBalanceLink
                          href="https://uniswap.info/token/0x774adc647a8d27947c8d7c098cdb4cdf30b126de"
                          rel="noreferrer noopner"
                          target="_blank"
                        >Get AVO</StyledBalanceLink>
                      </StyledBalanceHeader>
                      {!!account &&
                      <Value
                          value={getBalanceNumber(avoBalance)}
                      />
                      }
                      {!!!account &&
                      <AccountButton />
                      }
                    </div>
                  </StyledBalance>
                </StyledBalances>
              </CardContent>
            </Card>
            <Spacer/>

            <Card>
              <CardContent>
                <Label text="Total AVO Supply (fixed)"/>
                <StyledValue>100,000</StyledValue>
              </CardContent>
            </Card>
          </StyledWrapper>
          <br />
          <StyledWrapper>
            <Card>
              <CardContent>
                <StyledBalances>
                  <StyledBalance>
                    <YamIcon icon={"🥚"}/>
                    <Spacer/>
                    <div style={{flex: 1}}>
                      <StyledBalanceHeader>
                        <Label text="Your EGGS Balance"/>
                        <StyledBalanceLink
                          href="https://uniswap.info/token/0x98be5a6b401b911151853d94a6052526dcb46fe3"
                          rel="noreferrer noopner"
                          target="_blank"
                        >Get EGGS</StyledBalanceLink>
                      </StyledBalanceHeader>
                      {!!account &&
                      <Value
                          value={getBalanceNumber(eggsBalance)}
                      />
                      }
                      {!!!account &&
                      <AccountButton />
                      }
                    </div>
                  </StyledBalance>
                </StyledBalances>
              </CardContent>
            </Card>
            <Spacer/>

            <Card>
              <CardContent>
                <Label text="Total EGGS Supply (fixed)"/>
                <StyledValue>100,000</StyledValue>
              </CardContent>
            </Card>
          </StyledWrapper>
            <br />
            <StyledWrapper>
                <Card>
                    <CardContent>
                        <StyledBalances>
                            <StyledBalance>
                                <YamIcon/>
                                <Spacer/>
                                <div style={{flex: 1}}>
                                    <StyledBalanceHeader>
                                      <Label text="Your TOAST Balance"/>
                                      <StyledBalanceLink
                                        href="https://uniswap.info/token/0x774fb37e50db4bf53b7c08e6b71007bf1f1d9a47"
                                        rel="noreferrer noopner"
                                        target="_blank"
                                      >Get TOAST</StyledBalanceLink>
                                    </StyledBalanceHeader>
                                    {!!account &&
                                    <Value
                                        value={getBalanceNumber(sushiBalance)}
                                    />
                                    }
                                    {!!!account &&
                                    <AccountButton />
                                    }
                                </div>
                            </StyledBalance>
                        </StyledBalances>
                    </CardContent>
                    <Footnote>
                        Pending harvest
                        <FootnoteValue>
                            <PendingRewards/> TOAST
                        </FootnoteValue>
                    </Footnote>
                </Card>
                <Spacer/>

                <Card>
                    <CardContent>
                        <Label text="Total TOAST Supply"/>
                        {totalSupply &&
                        <Value
                            value={getBalanceNumber(totalSupply)}
                        />
                        }
                        {!totalSupply &&
                        <AccountButton />
                        }
                    </CardContent>
                    <Footnote>
                        New rewards per block
                        <FootnoteValue>1,000 TOAST</FootnoteValue>
                    </Footnote>
                </Card>
            </StyledWrapper>

        </div>
    )
}

const Footnote = styled.div`
  font-size: 14px;
  padding: 8px 20px;
  color: ${(props) => props.theme.color.grey[400]};
  border-top: solid 1px ${(props) => props.theme.color.grey[300]};
`
const FootnoteValue = styled.div`
  font-family: 'Roboto Mono', monospace;
  float: right;
`

const StyledWrapper = styled.div`
  align-items: center;
  display: flex;
  @media (max-width: 768px) {
    width: 100%;
    flex-flow: column nowrap;
    align-items: stretch;
  }
`

const StyledBalances = styled.div`
  display: flex;
`

const StyledBalance = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
`

const StyledBalanceHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-between;
`

const StyledBalanceLink = styled.a`
  font-weight: 600;
  font-size: 0.825rem;
  color: ${(props) => props.theme.color.grey[400]};
`

const StyledValue = styled.div`
  font-family: 'Roboto Mono', monospace;
  color: ${(props) => props.theme.color.grey[600]};
  font-size: 36px;
  font-weight: 700;
`

export default Balances
