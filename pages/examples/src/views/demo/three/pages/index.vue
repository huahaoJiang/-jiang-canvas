<template>
  <div
    id="page_1"
    ref="threePageRef"
    class="h-100%"></div>
</template>
<script lang="ts" setup>
import * as THREE from 'three'

const threePageRef = ref()

const scene = unref(new THREE.Scene())
const renderer = unref(new THREE.WebGLRenderer())

let camera: THREE.PerspectiveCamera
let cube: THREE.Mesh

onMounted(() => {
  const rect = threePageRef.value.getBoundingClientRect()
  renderer.setSize(rect.width, rect.height)

  camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 1000)
  camera.position.set(0, 0, 20)

  // 画正方体
  drawCube()
  scene.add(cube)

  // 画线
  const line = drawLine()
  scene.add(line)

  threePageRef.value.appendChild(renderer.domElement)

  animate()
})

function drawCube() {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  cube = new THREE.Mesh(geometry, material)
  cube.position.set(0, 0, 1)
}

function drawLine() {
  const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
  const points = []
  points.push(new THREE.Vector3(-10, 0, 0))
  points.push(new THREE.Vector3(0, 10, 0))
  points.push(new THREE.Vector3(10, 0, 0))

  const geometry = new THREE.BufferGeometry().setFromPoints(points)
  return new THREE.Line(geometry, material)
}

function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}

// function setText() {
//   return new THREE.TextGeometry('ssss', parameters)
// }
</script>
<style>
#page_1 {
  position: absolute;
  top: 10px;
  width: 100%;
  text-align: center;
  z-index: 100;
  display: block;
}
</style>
