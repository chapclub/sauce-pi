export const pinout = {
  pumpPins: [
    10, // Broadcom
    9, // Broadcom
    11, // Broadcom
    13 // Broadcom
  ],
  scalePins: {
    clock: 7, // Wiring Pi
    data: 6 // Wiring Pi
  },
  buttonPin: 19, // Broadcom
  switchPin: 26, // Broadcom,
  lcdPins: { // Broadcom
    rs: 17,
    e: 18,
    data: [
      27,
      22,
      23,
      24
    ],
    cols: 8,
    rows: 2
  }
}