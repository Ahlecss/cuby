import { Object3D, PointLight, Color, AmbientLight } from 'three'

export default class PointLightSource {
  constructor(options) {
    // Set options
    this.debug = options.debug

    // Set up
    this.container = new Object3D()
    this.container.name = 'Point Light'
    this.params = {
      color: 0xff006e,
      positionX: 0,
      positionY: 2,
      positionZ: 5,
    }
    this.params2 = {
      color: 0xfb5607,
      positionX: 10,
      positionY: 12,
      positionZ: 15,
    }

    this.createPointLight()
    this.createPointLight2()

    if (this.debug) {
      this.setDebug()
    }
  }
  createPointLight() {
    this.light = new AmbientLight(this.params.color, 2, 100)
    this.light.position.set(
      this.params.positionX,
      this.params.positionY,
      this.params.positionZ
    )
    //this.container.add(this.light)
  }
  createPointLight2() {
    this.light2 = new AmbientLight(this.params2.color, 2, 100)
    this.light2.position.set(
      this.params2.positionX,
      this.params2.positionY,
      this.params2.positionZ
    )
    this.container.add(this.light2)
  }
  setDebug() {
    // Color debug
    this.debugFolder = this.debug.addFolder({
      title: 'Point Light',
      expanded: false
    })
    this.debugFolder
      .addInput(this.params, 'color', {
        view: 'color',
        expanded: false,
        picker: 'inline',
      })
      .on('change', () => {
        this.light.color = new Color(this.params.color)
      })
    //Position debug
    this.debugFolder
      .addInput(this.light, 'position', {
        label: 'x, y, z',
        x: {min: -5, max: 5},
        y: {min: -5, max: 5},
        z: {min: -5, max: 5},
      })
  }
}
