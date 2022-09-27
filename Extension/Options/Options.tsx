import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Box, Button, Card, CardContent, Grid, TextField, Typography } 
  from '@material-ui/core'
import "./Options.css"
import {
  LocalStorageOptions,
  StoredOptionsGet,
  StoredOptionsSet,
} from "../Storage"

type FormState = 'ready' | 'saving'

const App: React.FC<{}> = () => {
  const [options, options_set] = useState<LocalStorageOptions | null>(null)
  const [form_state, form_state_set] = useState<FormState>('ready')

  useEffect(() => {
    StoredOptionsGet().then((options) => options_set(options))
  }, [])
  
  if (!options || options == undefined) return null

  const CityHomeChangeHandle = (city_home: string) => {
    console.log("[Options.tsx:CityHomeChangeHandle] city_home: " + city_home)
    options_set({
      ...options,
      city_home
    })
  }

  const HomeCitySaveHandle = () => {
    form_state_set('saving')
    StoredOptionsSet(options).then(() => {
      setTimeout(() => {
        form_state_set('ready')
      }, 1000)
    })
  }

  const fields_disabled = form_state === 'saving'

  return (
    <Box mx="10%" my="2%">
      <Card>
        <CardContent>
          <Grid container direction="column" spacing={4}>
            <Grid item>
            </Grid>
            <Grid item>
              <Typography variant='h2'>Options</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1">Home city name</Typography>
              <TextField fullWidth placeholder="Enter your home city..." 
                value={options.city_home}
                onChange={(event) => CityHomeChangeHandle(event.target.value)}
                disabled={ fields_disabled }
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={HomeCitySaveHandle}
                disabled={ fields_disabled }>
                  { form_state === 'ready' ? 'Save' : 'Saving...' }
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}

const container = document.createElement('div')
document.body.appendChild(container)
const root = createRoot(container)
root.render(<App />)
