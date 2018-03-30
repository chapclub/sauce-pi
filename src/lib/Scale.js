import HX711 from 'hx711'
import { pinout } from '../../config/pinout'

export class Scale {
  constructor () {
    const { clock, data } = pinout.scalePins
    this.scale = new HX711(clock, data)
    this.scale.setScale(-414.89)
    this.scale.tare()
  }

  measure () {
    const measurement = this.scale.getUnits()
    return measurement < 0 ? 0 : Math.ceil(measurement)
  }

  raw () {
    return this.scale.read()
  }

  tare () {
    this.scale.tare()
  }
}
