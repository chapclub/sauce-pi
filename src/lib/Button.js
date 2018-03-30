import EventEmitter from 'events'
import { Gpio } from 'onoff'
import { pinout } from '../../config/pinout'
import { debounce } from 'lodash'

export class Button extends EventEmitter {
  constructor () {
    super()
    const { buttonPin, switchPin } = pinout
    this.switch = new Gpio(switchPin, 'in', 'both')
    this.button = new Gpio(buttonPin, 'in', 'falling')

    this.button.watch(debounce((err, value) => {
      if (err) throw err
      this.emit('button', {})
    }, 500))

    this.switch.watch(debounce((err, value) => {
      if (err) throw err
      const mode = value ? 'cocktail' : 'shots'
      this.emit('switch', { mode: mode })
    }, 500))
  }

  readSwitch () {
    return this.switch.readSync() ? 'cocktail' : 'shots'
  }
}
