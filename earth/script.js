// three.js

let mesh;
let earth_rotate = 0;

    // レンダラーを作成
    const canvasElement = document.querySelector('#myCanvas');
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0x000000, 1); // 明示的に背景色を透過 (デフォルト値)
    canvasElement.appendChild( renderer.domElement );

    // シーンを作成
    let scene = new THREE.Scene();
    // カメラ
    // const camera = new THREE.Camera();
    // camera.position.z = 1;

    // カメラを作成
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, +1000);

    // 時間
    let startTime = Date.now();

    // 球体メッシュ
    const geometry = new THREE.SphereGeometry(300, 30, 30);

    // 質感
    // 画像を読み込む
    const loader = new THREE.TextureLoader();
    const texture = loader.load('img/earth_tx.png');
    // マテリアルにテクスチャーを設定
    const material = new THREE.MeshStandardMaterial({
        map: texture,
        // wireframe: true
    });

    // メッシュを作成
    mesh = new THREE.Mesh(geometry, material);
    scene.add( mesh );

    // 平行光源
    // const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    const directionalLight = new THREE.AmbientLight(0xFFFFFF);
    directionalLight.position.set(1, 1, 1);
    // シーンに追加
    scene.add(directionalLight);

    // onWindowResize();
    // window.addEventListener( 'resize', onWindowResize, false );

    // renderer.render( scene, camera );
    animate();

    function animate() {
        
        var currentTime = Date.now();
        renderer.render( scene, camera );

        // メッシュを回転させる
        earth_rotate += 0.001;
        mesh.rotation.y = earth_rotate;
        // レンダリング
        renderer.render(scene, camera);

        requestAnimationFrame( animate );
    }


/* ---------------------------------- */
/* Scroll Control! */
gsap.registerPlugin(ScrollTrigger);
//set camera position

// mesh.rotation.set(0, 1, 0)

gsap.to(mesh.rotation, {
    // y: +5,
    scrollTrigger:{
        trigger: "#container",
        start: 'top top',
        end: "bottom bottom",
        scrub: true,
        markers: true,
        onUpdate: self => {
            // console.log("あ");
            // console.log("progress:", self.progress.toFixed(3), "direction:", self.direction, "velocity", self.getVelocity(3));
            earth_rotate += self.getVelocity(3) * 0.0001;
        }
    },
})
