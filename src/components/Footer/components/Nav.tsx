import React from 'react'
import styled from 'styled-components'
import Page from "../../Page";

const Nav: React.FC = () => {
    return (
        <div style={{paddingBottom: "20px"}}>
            <br/>
            <StyledInfo style={{fontSize: 12}}>
                This project is in beta and all features are offered as-is without audit or guarantee. Please do your
                own research about cryptocurrency, Ethereum tokens, staking, Uniswap pools, impermanent loss, defi, and
                yield farming. None of the content published on this website constitutes a recommendation that you
                participate in our ecosystem. If you do decide to participate in our experimental platform, please
                ensure that you understand all risks involved and know exactly what it is that you are doing.
                Trading and investing in cryptocurrencies (also called digital or virtual currencies, crypto assets, altcoins and tokens) involves substantial risk of loss.
                HOUSE, AVO, EGGS and TOAST are all experimental tokens with no inherent value. Any value is up to the community.
            </StyledInfo>
            <br />
            <StyledNav>
                <StyledLink
                    target="_blank"
                    href="https://t.me/toastfinance"
                >
                    Telegram
                </StyledLink>
                <StyledLink
                    target="_blank"
                    href="https://github.com/Toast-finance/"
                >
                    GitHub
                </StyledLink>
                <StyledLink target="_blank" href="https://twitter.com/toastfinance">
                    Twitter
                </StyledLink>
                <StyledLink target="_blank"
                            href="https://etherscan.io/token/0x19810559df63f19cfe88923313250550edadb743">
                    HOUSE Contract
                </StyledLink>
                <StyledLink target="_blank"
                            href="https://etherscan.io/token/0x774adc647a8d27947c8d7c098cdb4cdf30b126de">
                    AVO Contract
                </StyledLink>
                <StyledLink target="_blank"
                            href="https://etherscan.io/token/0x98be5a6b401b911151853d94a6052526dcb46fe3">
                    EGGS Contract
                </StyledLink>
                <StyledLink target="_blank"
                            href="https://etherscan.io/token/0x774fb37e50db4bf53b7c08e6b71007bf1f1d9a47">
                    TOAST Contract
                </StyledLink>
                <StyledLink target="_blank"
                            href="https://etherscan.io/address/0xd725621e3b031d74e62c280dc0f5be0b50dfa050">
                    MasterChef
                </StyledLink>
                <StyledLink target="_blank"
                            href="https://etherscan.io/address/0xf9ada18d40c104348620ab946954a8434ec95edc">
                    HeadChef
                </StyledLink>
                <StyledLink target="_blank" href="https://gov.toast.finance/#/toast">
                    Proposals
                </StyledLink>
            </StyledNav>
        </div>
    )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
  justify-content: center;
`

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[400]};
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.color.grey[500]};
  }
`

const StyledInfo = styled.h3`
  color: ${(props) => props.theme.color.grey[500]};
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  padding: 0;
  text-align: center;

  > b {
    color: ${(props) => props.theme.color.grey[600]};
  }
`

export default Nav
