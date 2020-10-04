import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'
import TokenInput from '../../../components/TokenInput'
import { getFullDisplayBalance } from '../../../utils/formatBalance'

interface DepositModalProps extends ModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  tokenName?: string
  decimals?: number
}

const DepositModal: React.FC<DepositModalProps> = ({
  max,
  onConfirm,
  onDismiss,
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
      <ModalTitle text={`Deposit ${tokenName} Tokens`} />
      <TokenInput
        value={display}
        onSelectMax={handleSelectMax}
        onChange={handleChange}
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

export default DepositModal
