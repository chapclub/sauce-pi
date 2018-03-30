import { SauceMachine } from './lib/SauceMachine'

try {
  const sauce = new SauceMachine()
} catch (err) {
  console.log(err.message)
}
