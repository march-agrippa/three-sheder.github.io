'use strict';

// GLSL
const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
varying vec2 vUv;

uniform float time;
uniform vec2 resolution;
uniform vec2  mouse;

void main() {
    vec2 pos = (gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x, resolution.y);
	vec2 mouse_pos = (mouse - 0.5) * 2.0;
	mouse_pos.y *= resolution.y / resolution.x * -1.0;
	
	float l = 0.01 / length(mouse_pos - pos);
    gl_FragColor = vec4(l, l, l, 1.0);
}
`;


// three.js
    const canvasSize = {
        w: window.innerWidth,
        h: window.innerHeight,
    };

    // レンダラーを作成
    const canvasElement = document.querySelector('#myCanvas');
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( canvasSize.w, canvasSize.h );
    renderer.setClearColor(0x000000, 1); // 明示的に背景色を透過 (デフォルト値)
    canvasElement.appendChild( renderer.domElement );

    // シーンを作成
    let scene = new THREE.Scene();

    // カメラを作成
    // ウィンドウとwebGLの座標を一致させるため、描画がウィンドウぴったりになるようカメラを調整
    const fov = 60;
    const fovRad = (fov / 2) * (Math.PI / 180);
    const dist = canvasSize.h / 2 / Math.tan(fovRad);
    const camera = new THREE.PerspectiveCamera(
        fov,
        canvasSize.w / canvasSize.h,
        0.1,
        1000
    );
    camera.position.z = dist;

    // 時間
    let startTime = Date.now();



    // カスタムユニフォーム（GLSLの設定？）
    let uMouse = new THREE.Vector2(0.0, 0.0);
    let uResolution = new THREE.Vector2(canvasSize.w, canvasSize.h);
    let uniforms = {
        time: { type: "f", value: 1.0 },
        resolution: { type: "v2", value: uResolution, },
        mouse: { type: 'v2', value: uMouse, }
    };

    // 平面メッシュ
    const geometry = new THREE.PlaneBufferGeometry(canvasSize.w, canvasSize.h);

    // 質感（ここでGLSLのコードを使用）
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    // メッシュを作成
    let mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );

    // 平行光源
    // const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    const directionalLight = new THREE.AmbientLight(0xFFFFFF);
    directionalLight.position.set(1, 1, 1);
    // シーンに追加
    scene.add(directionalLight);

      //マウス座標を取得
    renderer.domElement.addEventListener('mousemove', function (e) {
    uMouse = new THREE.Vector2(
        e.clientX / canvasSize.w,
        e.clientY / canvasSize.h
    );
    console.log(e.clientY);
    console.log( "Y" + (e.clientY - 0.5) * -2.0);
    // console.log(e.clientX);
    // console.log( "X" + (e.clientX - 0.5) * 2.0);
    }, false);

    // renderer.render( scene, camera );
    animate();

    function animate() {
        
        var currentTime = Date.now();
        uniforms.time.value = (currentTime - startTime) * 0.01;
        uniforms.mouse.value = uMouse;

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
            // earth_rotate += self.getVelocity(3) * 0.0001;
        }
    },
})
