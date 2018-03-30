import { Gpio } from 'onoff'
import Scale from './Scale'
import { pinout } from '../../config/pinout'

export class Pump {
  constructor () {
    this.scale = new Scale()
    this.scale.tare()
    this.pumps = []
    const { pumpPins } = pinout
    pumpPins.forEach(elem => {
      this.pumps.push(new Gpio(pumpPins[elem], 'out'))
    })
    this.pumps.forEach(pump => {
      pump.write(0, err => {
        throw new Error(err)
      })
    })
  }

  /**
   * @function pump
   * @argument pump 0-indexed number of the pump
   */
  pour (pump, quantity) {
    let currVolume = 0
    this.pumps[pump].write(1, err => {
      throw new Error(err)
    })
    while (currVolume < quantity) {
      setTimeout(() => {
        currVolume = this.scale.measure()
      }, 250)
    }
    this.pumps[pump].write(0, err => {
      throw new Error(err)
    })
  }

  destroy () {
    this.pumps.forEach(pump => pump.unexport())
  }
}
