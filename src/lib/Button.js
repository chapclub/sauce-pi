import EventEmitter from 'events'
import { Gpio } from 'onoff'
import { pinout } from '../../config/pinout'

export class Button extends EventEmitter {
  constructor () {
    super()
    const { buttonPin, switchPin } = pinout
    this.switch = new Gpio(switchPin, 'in', 'both')
    this.button = new Gpio(buttonPin, 'in', 'falling')

    this.button.watch((err, value) => {
      if (err) throw err
      this.emit('button', 'some data')
    })

    this.switch.watch((err, value) => {
      if (err) throw err
      this.emit('switch', 'some more data')
    })
  }
}
