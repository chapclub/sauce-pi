import { SauceMachine } from './lib/SauceMachine'

const sauceMachine = new SauceMachine()

process.on('SIGINT', () => {
  sauceMachine.destroy()
  process.exit()
})
