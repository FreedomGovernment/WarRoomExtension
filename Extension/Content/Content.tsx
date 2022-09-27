console.log('[Content.tsx]')
import React, {useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Card } from '@material-ui/core'
import { LocalStorageOptions, StoredOptionsGet } from '../Storage'
import Messages from '../Messages'
import './Content.css'

const App: React.FC<{}> = () => {
  console.log('[Content.tsx:App')
  const [options, options_set] = useState<LocalStorageOptions | null>(null)
  const [enabled, enabled_set] = useState<boolean>(true)
  const [modal_visible, modal_visible_set] = useState<boolean>(true)

  if (!enabled || !options) return null

  useEffect(() => {
    StoredOptionsGet().then((options) => {
      options_set(options)
      modal_visible_set(options.modal_visible)
    })
  }, [])

  const MessageHandle = (message: Messages) => {
    console.log('[Content.tsx:App:MessageHandle] Received message ')
    if (message === Messages.MODAL_VISIBLE_TOGGLE) {
      console.log("[Content.tsx:App:MessageHandle] Received MODAL_VISIBLE_TOGGLE message, setting. !modal_visible:" + !modal_visible)
      modal_visible_set(!modal_visible)
    }
  }
 
  useEffect(() => {
    chrome.runtime.onMessage.addListener(MessageHandle)
    return () => {
      chrome.runtime.onMessage.removeListener(MessageHandle)
    }
  }, [modal_visible])
  
  console.log('options.city_home:' + options.city_home + 
              ' options.modal_visible:' + options.modal_visible + 
              ' modal_visible:' + modal_visible)

  return (<>{ modal_visible && (
    <Card className='ModalCard'>
      <div>Hello world from the modal!</div>
    </Card>
  )}</>)
  //  return (<Card className='ModalCard'>
  //  <WeatherCard
  //    city={options.city_home}
  //    units_temperature={options.units_temperature} />
  //</Card>)
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)
