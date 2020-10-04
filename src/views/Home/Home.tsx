import React from 'react'
import styled from 'styled-components'

import chef from '../../assets/img/chef.png'

import Button from '../../components/Button'
import Container from '../../components/Container'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'

import Balances from './components/Balances'

const Home: React.FC = () => {
  return (
    <Page>
        <img src={chef} height={120} />

        {/*<StyledInfo>🔥 You can now add & boost reward pools for your favorite token by <strong>BURNING TOAST</strong>! 🔥<br />(look for the "add" and "boost" buttons)</StyledInfo>*/}
        <br /><br />

        <StyledInfo>
            Toast.finance started with the HOUSE and AVO tokens. We added EGGS, and finally, we're cooking up some TOAST.<br />This is a community project. HOUSE, AVO and EGGS all have fixed supplies and are totally and fairly distributed to the community.<br />
            TOAST is our inflationary rewards token, and is only earned by participating in pools here. Like all of our tokens, it has a <strong>0% dev share</strong>!<br />There were no ICOs, no presales, no airdrops, no early wallets, and no dev/team wallets or funds.
        </StyledInfo>
        <br />


        <Container>
        <Balances />
      </Container>
      <Spacer size="lg" />

    </Page>
  )
}

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

export default Home
