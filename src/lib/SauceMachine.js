import { Pump } from './Pump'
import { Socket } from './Socket'
import { Mutex } from 'async-mutex'
import { Http } from './Http'

export class SauceMachine {
  constructor () {
    this.status = {
      busy: false,
      drink: undefined,
      currentPump: undefined,
      lastAction: undefined
    }

    this.mutex = new Mutex()

    this.defaultDrink = {
      // Oscar Sauce
    }

    this.pump = new Pump([0, 1, 2, 3], { scalePins: { clock: 4, data: 5 } })
    this.socket = new Socket()

    this.socket.on('make-drink', data => {
      this._makeDrink(data)
    })

    this.socket.on('default-drink', data => {
      this._defaultDrink()
    })

    this.socket.on('set-drink', data => {
      this._setDrink(data)
    })

    this.http = new Http()
    this.http.status = this.status

    this.http.on('make-drink', data => {
      this._makeDrink(data)
    })

    this.http.on('default-drink', data => {
      this._defaultDrink()
    })

    this.http.on('set-drink', data => {
      this._setDrink(data)
    })
  }

  _madeDrink (drink) {
    if (this.mutex.isLocked()) throw new Error('Already making a drink')
    this.makeDrink(drink)
  }

  _defaultDrink () {
    if (this.mutex.isLocked()) throw new Error('Already making a drink')
    const drink = JSON.parse(JSON.stringify(this.defaultDrink))
    this.makeDrink(drink)
  }

  _setDrink (drink) {
    this.defaultDrink = drink
    this.status.lastAction = 'set-drink'
    this.sendStatus()
  }

  makeDrink (drink) {
    this.mutex.acquire()
      .then(release => {
        this.status = {
          busy: true,
          drink: drink,
          currentPump: undefined,
          lastAction: 'make-drink'
        }
        this.http.status = this.status
        this.socket.sendStatus(this.status)

        // TODO: check switch
        drink.pumps.forEach(pump => {
          setTimeout(() => {
            this.pump.pour(pump.id, pump.volume * pump.density)
            this.status.currentPump = pump.id
            this.http.status = this.status
            this.socket.sendStatus(this.status)
          }, 1000)
        })

        release()

        this.status = {
          busy: false,
          drink: undefined,
          currentPump: undefined,
          lastAction: 'make-drink'
        }

        this.http.status = this.status
        this.socket.sendStatus(this.status)
      })
  }
}
