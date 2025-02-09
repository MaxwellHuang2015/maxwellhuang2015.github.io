import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

const AnalogNote = defineNoteConfig({
  dir: '模拟电路',
  link: '/analog/',
  sidebar: 'auto'
})

const DigitalNote = defineNoteConfig({
  dir: '数字逻辑',
  link: '/digital/',
  sidebar: 'auto'
})

const MCUNote = defineNoteConfig({
  dir: '微机原理',
  link: '/mcu/',
  sidebar: 'auto'
})

export const notes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [
    AnalogNote,
    DigitalNote,
    MCUNote
  ]
})
