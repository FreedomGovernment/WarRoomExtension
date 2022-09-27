console.log("[Popup.tsx]")
import React, { useEffect, useState } from 'react'
import { Box, Grid, InputBase, IconButton, Paper, Typography, Switch }
  from '@material-ui/core'
import { Add as AddIcon, PictureInPicture as PIPIcon }
  from '@material-ui/icons'
import { createRoot } from 'react-dom/client'
import Messages from '../Messages'
//import 'fontsource-roboto'
import { StoredCitiesSet, StoredCitiesGet, StoredOptionsSet, StoredOptionsGet,
         LocalStorageOptions } from '../Storage'
import './Popup.css'

const App: React.FC<{}> = () => {
  console.log("[Popup.tsx:App]")
  const [cities, cities_set] = useState<string[]>([])
  const [city_input, city_input_set] = useState<string>('')
  const [options, options_set] = useState<LocalStorageOptions | null>(null)

  useEffect(() => {
    StoredCitiesGet().then(cities => cities_set(cities))
    StoredOptionsGet().then((options) => options_set(options))
  }, [])

  console.log(city_input)

  const HandleCityButtonClick = () => {
    if(city_input ==='') return
    const updated_cities = [...cities, city_input]
    StoredCitiesSet(updated_cities)
    .then(() => {
      cities_set([...cities, city_input])
      city_input_set('')
    })
  }

  const CityDeleteButtonClickHandle = (index: number) => {
    console.log("[Popup.tsx:CityDeleteButtonClickHandle")
    cities.splice(index, 1)
    const updated_cities = [...cities]
    StoredCitiesSet(updated_cities).then(() => {
      cities_set(updated_cities)
    })
  }

  if (!options) return null

  const ModalVisibleToggleHandle = () => {
    console.log("ModalVisibleToggleHandle")
    chrome.tabs.query({
        active: true,
        currentWindow: true,
      }, (tabs) => {
        if (tabs.length <= 0) {
          console.log("tabs.length invalid: " + tabs.length)
          return
        }
        const tab_id = tabs[0].id
        if (tab_id == undefined) return
        console.log("Sending message to tab_id: " + tab_id)
        chrome.runtime.lastError;
        chrome.tabs.sendMessage(tab_id, Messages.MODAL_VISIBLE_TOGGLE)
        console.log("Done sending message.")
      }
    )
    console.log('')
  }
  
  const EnabledToggleHandle = (enabled: boolean) => {
    const options_new = {
      ...options,
      enabled
    }
    options_set(options_new)
    StoredOptionsSet(options_new)
  }

  const UnitsTemperatureChangeHandle = () => {
    const local_storage_options: LocalStorageOptions = {
      ...options,
      units_temperature: options.units_temperature === 'metric' ? 'imperial' : 
                                                                  'metric'
    }
    StoredOptionsSet(local_storage_options)
  }

  return (
    <div>
      <h1 style={{visibility: 'hidden'}}>RSS Commentary</h1>
      <h2>News</h2>
      <Box mx='8px' my='16px'>
        <Grid container justifyContent="space-evenly">
          <Grid item>
            
          </Grid>
        </Grid>
      </Box>
      <h2>Weather</h2>
      <Box mx='8px' my='16px'>
        <Grid container justifyContent="space-evenly">
          <Grid item>
            <Typography variant="body1">Enable On This Site</Typography>
            <Switch
              color='primary'
              checked={options.enabled}
              onChange={(event, checked) => { 
                EnabledToggleHandle(checked);
                console.log("toggle")
              }}
            />
          </Grid>
          <Grid item>
            <Paper>
              <Box mx ='15px' my='5px'>
                <InputBase placeholder="Add a city name"
                  value={city_input}
                  onChange={(event) => city_input_set(event.target.value)} />
                <IconButton onClick={HandleCityButtonClick}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <Box>
                <IconButton onClick={UnitsTemperatureChangeHandle}>
                  {options.units_temperature === 'metric' ?  '\u2103' : 
                                                             '\u2109'
                  }
                </IconButton>
              </Box>
            </Paper>
          </Grid>
          <Grid item>
            <Paper>
              <Box>
                <IconButton onClick={ModalVisibleToggleHandle}>
                  <PIPIcon />
                </IconButton>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Box height='16px' />
      </Box>
    </div>
  )
}
//<FeedEstuarySorter />
const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)
