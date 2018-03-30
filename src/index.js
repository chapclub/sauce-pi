import { Scale } from './lib/Scale'

const scale = new Scale()

setInterval(() => {
  console.log(scale.measure())
}, 1000)
