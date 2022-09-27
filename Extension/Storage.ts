import { UnitsTemperature } from "./Components/Weather/OpenWeather"
import { v4 as uuidv4 } from 'uuid';

export interface LocalStorageOptions {
  enabled: boolean
  modal_visible: boolean
  city_home?: string
  units_temperature?: UnitsTemperature
}

export interface LocalStorage {
  options?: LocalStorageOptions
  cities?: string[]
}

export type LocalStorageKeys = keyof LocalStorage

export function StoredCitiesDefault() : string[] {
  return []
}

export function StoredCitiesGet(): Promise<string[]> {
  const keys: LocalStorageKeys[] = ["cities"]
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (res: LocalStorage) => {
      resolve(res.cities ?? [])
    })
  })
}

export function StoredCitiesSet(cities: string[]): Promise<void> {
  const values: LocalStorage = {
    cities
  }
  return new Promise((resolve) => {
    chrome.storage.local.set(values, () => {
      resolve()
    })
  })
}



export function StoredOptionsSet(options: LocalStorageOptions): Promise<void> {
  const values: LocalStorage = {
    options,
  }
  return new Promise((resolve) => {
    chrome.storage.local.set(values, () => {
      resolve()
    })
  })
}

export function StoredOptionsDefault() : LocalStorageOptions {
  return {
    enabled: false,
    modal_visible: false,
    city_home: 'Eugene',
    units_temperature: 'metric',
  }
}

export function StoredOptionsGet(): Promise<LocalStorageOptions> {
  const keys: LocalStorageKeys[] = ['options']
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, (res: LocalStorage) => {
      //console.log('[Storage.tx:StoredOptionsGet]\nres.options: ' + 
      //            res.options.units_temperature)
      resolve(res.options ?? StoredOptionsDefault())
    })
  })
}

export function StoredReset() {
  const res: LocalStorage = {
    options: StoredOptionsDefault(),
    cities: StoredCitiesDefault()
  }
  return new Promise((resolve) => {
    chrome.storage.local.set(res, () => {
      resolve(res)
    })
  })
}
