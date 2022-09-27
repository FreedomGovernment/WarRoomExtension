import {  LocalStorage, StoredOptionsDefault, StoredFeedsDefault, StoredSegmentsDefault, 
          StoredCitiesDefault }
  from '../Storage'
import { v4 as uuidv4 } from 'uuid';

console.log("[Background.ts]")


chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "FeedUpdate") {
    console.log('tick')
    //chrome.storage.local.get(["feeds", "segments"], (res) => {
    //  FeedEstuarySorterProcess(res.feeds, res.segments)
    //})
  }
})

chrome.runtime.onInstalled.addListener(() => {
  const res: LocalStorage = {
    options: {
      enabled: false,
      modal_visible: false,
      city_home: 'Eugene',
      units_temperature: 'metric',
    },
    cities: []
  }
  console.log('res:' + res)
  
  chrome.alarms.create("FeedUpdate", {
    periodInMinutes: 1/60,
  });

  chrome.contextMenus.create({
    "id": "FeedAddSelectionContextMenu",
    "title": "Add User to list.",
    "contexts": ["selection"]
  });

  chrome.contextMenus.create({
    "id": "FeedAddPageContextMenu",
    "title": "Add current page to list."
  });
})
