<template>
  <div
    id="page_robot"
    ref="threePageRef"
    class="h-100%"></div>
</template>
<script lang="ts" setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import Nx from '@/assets/images/env/0/nx.jpg'
import Ny from '@/assets/images/env/0/ny.jpg'
import Nz from '@/assets/images/env/0/nz.jpg'
import Px from '@/assets/images/env/0/px.jpg'
import Py from '@/assets/images/env/0/py.jpg'
import Pz from '@/assets/images/env/0/pz.jpg'

const threePageRef = ref()

const scene = unref(new THREE.Scene())
scene.background = new THREE.Color('#191919')
const renderer = unref(new THREE.WebGLRenderer())
let controls: OrbitControls

let camera: THREE.PerspectiveCamera

let mixer: THREE.AnimationMixer | null = null
let action: THREE.AnimationAction | null = null
let actions: THREE.AnimationAction[] = [] // 存储所有的动画动作
let currentActionIndex = 0 // 当前播放的动画的索引

/**
 * 纹理加载器
 */
const cubeTextureLoader = new THREE.CubeTextureLoader()
const environmentMapTexture = cubeTextureLoader.load([Px, Nx, Py, Ny, Pz, Nz])

/**
 * 模型加载器
 */

let body: THREE.Group
const gltfLoader = new GLTFLoader()
gltfLoader.load('src/assets/gltf/RobotExpressive.gltf', gltf => {
  body = gltf.scene
  body.rotation.y = Math.PI / 2
  mixer = new THREE.AnimationMixer(gltf.scene)
  // 为每一个动画创建一个动作并存储在actions数组中
  for (let i = 0; i < gltf.animations.length; i++) {
    action = mixer.clipAction(gltf.animations[i])
    actions.push(action)
  }

  gltf.scene.scale.set(0.25, 0.25, 0.25)
  scene.add(gltf.scene)
  actions[currentActionIndex].play()
})

// 辅助坐标系
const axesHelper = new THREE.AxesHelper(3)
axesHelper.visible = false
scene.add(axesHelper)

/**
 * 地板
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(8, 8),
  new THREE.MeshStandardMaterial({
    color: '#111',
    aoMapIntensity: 1,
    flatShading: true,
    metalness: 0.4, // 镜面反射，1为镜面，0为石材
    roughness: 0.1, //粗糙程度
    envMap: environmentMapTexture,
    envMapIntensity: 2
  })
)
floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

/**
 * 灯
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 4)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(400, 400)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(0, 5, 5)
scene.add(directionalLight)

/**
 * 相机
 */
// camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
// camera.position.set(3, 4, 5)
// scene.add(camera)

onMounted(() => {
  const rect = threePageRef.value.getBoundingClientRect()
  renderer.setSize(rect.width, rect.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 100)
  camera.position.set(1, 2, 3)
  scene.add(camera)
  camera.updateProjectionMatrix()

  controls = new OrbitControls(camera, threePageRef.value)
  controls.enableDamping = true // 阻尼效果

  threePageRef.value.appendChild(renderer.domElement)

  // animate()
  tick()
})
const clock = new THREE.Clock()
let oldElapsedTime = 0
const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  mixer?.update(deltaTime)

  // 更新控制器
  controls.update()

  renderer.render(scene, camera)
  requestAnimationFrame(tick)
}

// function animate() {
//   requestAnimationFrame(animate)
//   renderer.render(scene, camera)
// }
</script>
