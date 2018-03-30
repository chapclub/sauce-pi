import io from 'socket.io-client'
import EventEmitter from 'events'

export class Socket extends EventEmitter {
  constructor () {
    super()
    this.socket = new io('http://10.8.107.114:6969')
    this.socket.on('connect', () => {
      this.socket.emit('message', 'hello world')
    })

    this.socket.on('make-drink', data => {
      if (!data.name || !data.type || !data.pumps) {
        this.emit('default-drink', {})
      } else {
        this.emit('make-drink', data)
      }
    })

    this.socket.on('set-drink', data => {
      this.emit('set-drink', data)
    })
  }

  makeDrinkResponse (status) {
    this.socket.emit('make-drink.response', status)
  }

  lastOperationResponse (operation) {
    // return last operation
  }

  setDrinkResponse () {
    // same as makeDrinkResponse but for set-drink
  }
}
