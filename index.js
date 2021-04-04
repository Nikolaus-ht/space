// import * as THREE from "./build/three.module.js"

let camera, scene, renderer, starGeo, starPO
let loader = new THREE.TextureLoader()

//Basic Set Up
let init = () => {
    scene = new THREE.Scene()

    let fov = 60
    let w = window.innerWidth
    let h = window.innerHeight
    let aspect = w/h
    let near = 1
    let far = 1000
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(0, -250, 0)
    camera.lookAt(0,0,0)

    renderer = new THREE.WebGLRenderer()
    renderer.setSize(w,h)
    renderer.setPixelRatio(devicePixelRatio)
    document.body.appendChild(renderer.domElement)

    //Orbit Camera
    let control = new THREE.OrbitControls(camera, renderer.domElement)
    control.update()
}



//Object
let object = () =>
{
    //SpaceShip
    let mtLoad = new THREE.MTLLoader()
    mtLoad.load('./Asset/X-WING.mtl', function(materials)
    {
        let objLoad = new THREE.OBJLoader()
        objLoad.setMaterials(materials)
        objLoad.load('./Asset/X-WING.obj', function(object)
        {
            object.position.set(0, 0, 0)
            object.scale.set(10, 10, 10)
            object.rotation.set(0, 1.55, 1.5)
            scene.add(object)
        })
    })


    //Star
    starGeo = new THREE.Geometry()
    let starPost = undefined
    for(let i = 0; i < 400; i++)
    {
            starPost = new THREE.Vector3(
            Math.random() * 600 - 300,
            Math.random() * 600 - 300,
            Math.random() * 600 - 300
        )
        starPost.velocity = 0
        starPost.acceleration = 0.02
        starGeo.vertices.push(starPost)
    }

    let starTexture = new loader.load("./Asset/whiteCirc.png")
    let starMat = new THREE.PointsMaterial({
        color: 0xAAAAAA,
        size: 1,
        map: starTexture
    })

    starPO = new THREE.Points(starGeo, starMat)
    scene.add(starPO) 
}

//Light
let createLight = () =>
{
    let aLight = new THREE.AmbientLight("#FFFFFF", 0.6)
    scene.add(aLight)

    let pLight = new THREE.PointLight("#FFFFFF", 0.7, 1000)
    pLight.position.set(300, 300, 300)
    pLight.castShadow = true
    pLight.shadow.camera.far = 700
   
    scene.add(pLight)
}

//Render
let render = () => {
    //Restart Star
    starGeo.vertices.forEach(p => {
        p.velocity += p.acceleration
        p.y -= p.velocity
        if(p.y <- 200)
        {
            p.y = 200
            p.velocity = 0  
        }
        
    });
    starGeo.verticesNeedUpdate = true
    starPO.rotation.y = 0.002

    //Render
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}

//Resize windows
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight

    camera.updateProjectionMatrix();
})

//Load
window.onload = () =>
{
    init()
    object()
    createLight()
    render()
}