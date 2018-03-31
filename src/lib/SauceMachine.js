import { Pump } from './Pump'
import { Socket } from './Socket'
import { Mutex } from 'async-mutex'
import { Http } from './Http'
import { Button } from './Button'
import { Display } from './Display'

export class SauceMachine {
  constructor () {
    this.status = {
      busy: false,
      drink: undefined,
      currentPump: undefined,
      lastAction: undefined
    }

    this.display = new Display()

    this.mutex = new Mutex()

    this.defaultDrink = {
      name: 'Oscar Sauce',
      type: 'mixed',
      pumps: [
        {
          id: 0,
          volume: 45,
          density: 1,
          name: 'Fireball'
        },
        {
          id: 1,
          volume: 45,
          density: 1,
          name: 'Orange Juice'
        },
        {
          id: 0,
          volume: 45,
          density: 1,
          name: 'Fireball'
        },
        {
          id: 1,
          volume: 45,
          density: 1,
          name: 'Orange Juice'
        }
      ]
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

    this.button = new Button()

    this.mode = this.button.readSwitch()

    this.button.on('button', data => {
      this._defaultDrink()
    })

    this.button.on('switch', data => {
      this.mode = data
    })
  }

  _madeDrink (drink) {
    if (this.mutex.isLocked()) throw new Error('Already making a drink')
    if (drink.type !== this.mode) throw new Error('Switch in wrong position')
    this.makeDrink(drink)
  }

  _defaultDrink () {
    if (this.mutex.isLocked()) throw new Error('Already making a drink')
    if (this.defaultDrink.type !== this.mode) throw new Error('Switch in wrong position')
    const drink = JSON.parse(JSON.stringify(this.defaultDrink))
    this.makeDrink(drink)
  }

  _setDrink (drink) {
    this.defaultDrink = drink
    this.status.lastAction = 'set-drink'
    this.sendStatus()
  }

  iterPumps (pumps) {
    return pumps.reduce((pump, p) => {
      p.then(() => {
        this.display.displayStatus(pump.name)
        return this.pump.pour(pump.id, pump.volume)
      }).then(() => {
        this.status.currentPump = pump.id
        this.http.status = this.status
        this.socket.sendStatus(this.status)
      })
    }, new Promise())
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
        this.display.displayDrink(drink.name)
        this.http.status = this.status
        this.socket.sendStatus(this.status)

        // TODO: check switch
        return this.iterPumps(drink.pumps).then(() => release())
      }).then(() => {
        this.status = {
          busy: false,
          drink: undefined,
          currentPump: undefined,
          lastAction: 'make-drink'
        }

        this.display.clear()

        this.http.status = this.status
        this.socket.sendStatus(this.status)
      })
  }

  destroy () {
    this.display.destroy()
    this.pump.destroy()
    this.button.destroy()
  }
}
