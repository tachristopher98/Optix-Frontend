import { Synaps } from '@synaps-io/verify-sdk'
import { useEffect } from 'react'

const Modal = () => {
  useEffect(() => {
    // Prevent multiple initializations with react strict mode
    // https://react.dev/learn/synchronizing-with-effects#fetching-data
    let init = true

    Synaps.init({
      sessionId: '$YOUR_SESSION_ID',
      onFinish: () => {
        alert('Verification finished')
      },
      mode: 'modal',
    })

    return () => {
      init = false
    }
  }, [])

  const handleOpen = () => {
    Synaps.show()
  }

  return (
    <div className="App">
      <button onClick={handleOpen}>Start verification</button>
    </div>
  )
}

export default Modal
