import EventEmitter from 'events'
import express from 'express'

export class Http extends EventEmitter {
  constructor () {
    super()
    this.app = express()
    this.app.post('/makeDrink', (req, res) => {
      try {
        if (!req.body.name || !req.body.type || !req.body.pumps) {
          this.emit('default-drink', {})
        } else {
          this.emit('make-drink', req.body)
        }
        res.sendStatus(200)
      } catch (err) {
        res.status(500).send(err.message)
      }
    })

    this.app.post('/setDrink', (req, res) => {

    })

    this.app.get('/state', (req, res) => {

    })
  }
}
