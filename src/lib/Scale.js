import HX711 from 'hx711'
import { pinout } from '../../config/pinout'

export class Scale {
  constructor () {
    const { clock, data } = pinout.scalePins
    this.scale = new HX711(clock, data)
    this.scale.setScale(-414.89)
    this.scale.tare()
    // this._initOffset = this.scale.getOffset()
    this._initOffset = -85345
  }

  measure () {
    return this.scale.getUnits() + this.scale.getOffset()
    // return this.scale.getUnits() + this._initOffset
  }

  raw () {
    return this.scale.read()
  }

  tare () {
    this.scale.tare()
  }
}
