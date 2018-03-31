import io from 'socket.io-client'
import EventEmitter from 'events'

export class Socket extends EventEmitter {
  constructor () {
    super()
    this.socket = new io('http://sauce.delvaze.xyz:6970')
    this.socket.on('connect', () => {
      this.socket.emit('message', 'hello world')
    })

    this.socket.on('make-drink', data => {
      console.log('make drink pls: ' + data)
      const { name, type, pumps } = data.drink
      if (!name || !type || !pumps) {
        this.emit('default-drink', {})
      } else {
        this.emit('make-drink', JSON.parse(data))
      }
    })

    this.socket.on('set-drink', data => {
      this.emit('set-drink', JSON.parse(data))
    })
  }

  sendStatus (status) {
    this.socket.emit(status)
  }
}
