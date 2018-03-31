import Lcd from 'lcd'
import { pinout } from '../../config/pinout'

export class Display {
  constructor () {
    this.ready = false
    this.name = undefined
    this.mixer = undefined
    const { lcdPins } = pinout
    this.lcd = new Lcd(lcdPins)
    this.lcd.on('ready', () => {
      this.ready = true
      this.lcd.setCursor(0, 0)
      this.lcd.clear()
    })
  }

  displayDrink (name) {
    this.name = name
    this.lcd.autoscroll()
    this.lcd.setCursor(0, 0)
    this.lcd.print(`Making ${this.name}`, err => {
      if (err) throw err
    })
  }

  displayStatus (mixer) {
    this.mixer = mixer
    this.lcd.autoscroll()
    this.lcd.setCursor(0, 1)
    this.lcd.print(`Pouring ${mixer}`, err => {
      if (err) throw err
    })
  }

  clear () {
    this.lcd.clear()
  }

  destroy () {
    this.lcd.clear()
    this.lcd.close()
  }
}
