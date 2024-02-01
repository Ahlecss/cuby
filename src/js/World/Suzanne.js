import { Object3D, BoxGeometry, MeshPhongMaterial, Mesh, Vector3, Quaternion, Float32BufferAttribute, BufferGeometryUtils } from 'three'
import gsap, { Power3 } from 'gsap'

export default class Suzanne {
  constructor(options) {
    // Options
    this.assets = options.assets

    // Set up
    this.container = new Object3D()
    this.container.name = 'Suzanne'

    this.deltaY = 0
    this.angle = 0
    this.isScrolling = false;
    this.canvas = document.getElementsByTagName('canvas')[0]
    this.initialP;
    this.totalAngle = 0;
    this.scrollStopTimeout;

    this.canvas.addEventListener('wheel', (e) => this.scroll(e))

    this.createCube()
    this.createQuaternion()
    gsap.ticker.add((time, deltaTime) => { this.newTwist(time, deltaTime) })
  }
  createCube() {
    const geometry = new BoxGeometry(25, 25, 25, 10, 10, 10);
    const material = new MeshPhongMaterial({wireframe: true})
    this.cube = new Mesh(geometry, material);
    this.container.add(this.cube);
    this.initialP = this.cube.geometry.attributes.position.array.slice();
    //camera.position.z = 5;
  }
  createQuaternion() {
    const quaternion = new Quaternion();
    quaternion.setFromAxisAngle(
      new Vector3(0, 1, 0),
      Math.PI / 2
    );
    const vector = new Vector3(1, 0, 0);
    vector.applyQuaternion(quaternion);

  }
  scroll(event) {
    this.deltaY += event.deltaY
    this.cube.rotation.y = this.deltaY / 1000

    console.log(this.cube.rotation.y)

    this.angle = event.deltaY * 100

    this.totalAngle += this.angle

    this.isScrolling = true

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.isScrolling = false;
      gsap.to(this.cube.rotation, {y: 0, duration: Math.abs(0.0002 * this.deltaY)})
      this.deltaY = 0;
    }, 150);
}

// Function to stop scrolling and trigger the lerping back to the original position
  

  newTwist() {
    const q = new Quaternion();
    const up = new Vector3(0, 1, 0);
    const p = this.cube.geometry.attributes.position.array;

    if (this.isScrolling) {
      for (let i = 0; i < p.length; i += 3) {
        q.setFromAxisAngle(
          up,
          p[i + 1] * ((this.angle / 10000) / 500)
        );
        let vec = new Vector3(p[i], p[i + 1], p[i + 2])
        vec.applyQuaternion(q);

        p[i] = vec.x
        p[i + 2] = vec.z
      }
    } /*else {
      var lerpedVertices = [];
      for (var i = 0; i < p.length; i += 3) {
          var currentVertex = new Vector3().fromArray(this.cube.geometry.attributes.position.array, i);
          var originalVertex = new Vector3().fromArray(this.initialP, i);
          
          var lerpedVertex = new Vector3().lerpVectors(currentVertex, originalVertex, 0.1);
          lerpedVertices.push(lerpedVertex.x, lerpedVertex.y, lerpedVertex.z);
        }
        this.cube.geometry.setAttribute('position', new Float32BufferAttribute(lerpedVertices, 3));
      }*/
    this.cube.geometry.computeVertexNormals()
    this.cube.geometry.attributes.position.needsUpdate = true;
  }

  lerp(a, b, alpha) {
    return a + alpha * (b - a)
  }
}