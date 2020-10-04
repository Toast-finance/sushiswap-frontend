import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../utils/formatBalance'

interface WithdrawModalProps extends ModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  tokenName?: string
    decimals?: number
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({
  onConfirm,
  onDismiss,
  max,
  tokenName = '',
    decimals = 18,
}) => {
  const [val, setVal] = useState('')
  const [display, setDisplay] = useState('')
  const [pendingTx, setPendingTx] = useState(false)

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

    const fullDisplay = useMemo(() => {
        return getFullDisplayBalance(max, decimals)
    }, [max])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
        setVal((new BigNumber(e.currentTarget.value)).multipliedBy(new BigNumber(10).pow(decimals-18)).toFixed())
        setDisplay(e.currentTarget.value)
    },
    [setVal],
  )

    const handleSelectMax = useCallback(() => {
        setVal(fullBalance)
        setDisplay(fullDisplay)
    }, [fullBalance, setVal, fullDisplay, setDisplay])

  return (
    <Modal>
      <ModalTitle text={`Withdraw ${tokenName}`} />
      <TokenInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={display}
        max={fullDisplay}
        symbol={tokenName}
      />
      <ModalActions>
        <Button text="Cancel" variant="secondary" onClick={onDismiss} />
        <Button
          disabled={pendingTx}
          text={pendingTx ? 'Pending Confirmation' : 'Confirm'}
          onClick={async () => {
            setPendingTx(true)
            await onConfirm(val)
            setPendingTx(false)
            onDismiss()
          }}
        />
      </ModalActions>
    </Modal>
  )
}

export default WithdrawModal
