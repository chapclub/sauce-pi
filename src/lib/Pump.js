import { Gpio } from 'onoff'
import { Scale } from './Scale'
import { pinout } from '../../config/pinout'

export class Pump {
  constructor () {
    this.scale = new Scale()
    this.scale.tare()
    const { pumpPins } = pinout
    this.pumps = [
      new Gpio(pumpPins[0]),
      new Gpio(pumpPins[1]),
      new Gpio(pumpPins[2]),
      new Gpio(pumpPins[3])
    ]
    /*
    pumpPins.forEach(elem => {
      this.pumps.push(new Gpio(pumpPins[elem], 'out'))
    })
    */
    // this.pumps.forEach(pump => {
    //   pump.write(0, err => {
    //     if (err) throw new Error(err)
    //   })
    // })
  }

  /**
   * @function pump
   * @argument pump 0-indexed number of the pump
   */
  pour (pump, quantity) {
    return new Promise((resolve, reject) => {
      this.scale.tare()
      let currVolume = 0
      this.pumps[pump].write(1, err => {
        reject(err)
      })

      while (currVolume < quantity) {
        currVolume = this.scale.measure()
      }

      this.scale.tare()

      this.pumps[pump].write(0, err => {
        reject(err)
      })
      resolve()
    })
  }

  destroy () {
    this.pumps.forEach(pump => pump.unexport())
  }
}
