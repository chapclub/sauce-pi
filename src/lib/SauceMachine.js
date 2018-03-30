import { Pump } from './Pump'
import { Socket } from './Socket'
import { Mutex } from 'async-mutex'

export class SauceMachine {
  constructor () {
    this.status = {
      busy: false,
      drink: {
        // Oscar Sauce
      },
      currentPump: undefined
    }

    this.mutex = new Mutex()

    this.defaultDrink = {
      // Oscar Sauce
    }

    this.pump = new Pump([0, 1, 2, 3], { scalePins: { clock: 4, data: 5 } })
    this.socket = new Socket()

    this.socket.on('make-drink', data => {
      if (this.mutex.isLocked()) throw new Error('Already making a drink')
      this.makeDrink(data)
    })

    this.socket.on('default-drink', data => {
      if (this.mutex.isLocked()) throw new Error('Already making a drink')
      const drink = JSON.parse(JSON.stringify(this.defaultDrink))
      this.makeDrink(drink)
    })

    this.socket.on('set-drink', data => {
      this.defaultDrink = data
    })
  }

  makeDrink (drink) {
    this.mutex.acquire()
      .then(release => {
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

        release()

        this.status = {
          busy: false,
          drink: undefined,
          currentPump: undefined
        }
      })
  }
}
