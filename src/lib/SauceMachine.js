import { Pump } from './Pump'
import { Socket } from './Socket'

export class SauceMachine {
  constructor () {
    this.status = {
      busy: false,
      drink: {
        // Oscar Sauce
      },
      currentPump: undefined
    }

    this.defaultDrink = {
      // Oscar Sauce
    }

    this.pump = new Pump([0, 1, 2, 3], { scalePins: { clock: 4, data: 5 } })
    this.socket = new Socket()

    this.socket.on('make-drink', data => {
      this.makeDrink(data)
    })

    this.socket.on('default-drink', data => {
      const drink = this.defaultDrink
      this.makeDrink(drink)
    })

    this.socket.on('set-drink', data => {
      this.defaultDrink = data
    })
  }

  makeDrink (drink) {
    this.status = {
      busy: true,
      drink: drink,
      currentPump: undefined
    }
    this.socket.makeDrinkResponse(this.status)

    // TODO: check switch
    drink.pumps.forEach(pump => {
      setTimeout(() => {
        this.pump.pour(pump.id, pump.volume * pump.density)
        this.status.currentPump = pump.id
        this.socket.makeDrinkResponse(this.status)
      }, 1000)
    })

    this.status = {
      busy: false,
      drink: undefined,
      currentPump: undefined
    }
  }
}
