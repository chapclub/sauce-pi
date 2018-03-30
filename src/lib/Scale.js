import HX711 from 'hx711'

export class Scale {
  /**
   * @constructor
   * @param pins Object with props 'clock' and 'data'
   */
  constructor (pins) {
    const { clock, data } = pins
    this.scale = new HX711(clock, data)
    this.scale.setScale(-414.89)
    this.scale.tare()
    this._initOffset = this.scale.getOffset()
  }

  measure () {
    return this.scale.getUnits() + this.scale.getOffset()
  }

  tare () {
    this.scale.tare()
  }
}
