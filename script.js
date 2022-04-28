// GLSL
const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const fragmentShader = `
uniform vec2 iResolution;
uniform float iGlobalTime;

varying vec2 vUv; 

void main(void){
    // float time=iGlobalTime * 0.6;
    float time=iGlobalTime * 0.05;
    vec2 uv = ( -1.0 + 2.0 * vUv ) * 2.0;

    vec2 uv0=uv;
    float i0=1.4;
    float i1=1.9;
    float i2=1.4;
    float i4=0.6;

    for(int s = 0; s < 50; s++) {
        vec2 r;
        r = vec2( cos( uv.y * i0 - i4 + time / i1), sin( uv.x * i0 - i4 + time / i1 )) / i2;
        r += vec2( -r.y, r.x ) * 0.3;
        uv.xy += r - 0.5;
        i0 *= 1.93;
        i1 *= 1.15;
        i2 *= 4.7;
        i4 += 0.65 + 0.1 * time * i1;
    }

    float r = sin( uv.x + time ) * 0.4 + 0.6;
    float b = sin( uv.y + time ) * 0.4 + 1.0;
    float g = 0.0;


    //  gl_FragColor = vec4(r,g,b,1.0);
    gl_FragColor = vec4( r, 1.0, b, 1.0);
}
`;


// three.js
window.addEventListener('DOMContentLoaded', init);

function init(){
    // レンダラーを作成
    const canvasElement = document.querySelector('#myCanvas');
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0x000000, 0); // 明示的に背景色を透過 (デフォルト値)
    canvasElement.appendChild( renderer.domElement );

    // シーンを作成
    const scene = new THREE.Scene();
    // カメラ
    const camera = new THREE.Camera();
    camera.position.z = 1;

    // 時間
    let startTime = Date.now();

    // カスタムユニフォーム（GLSLの設定？）
    let uniforms = {
        iGlobalTime: { type: "f", value: 1.0 },
        iResolution: { type: "v1", value: new THREE.Vector2(), }
    };

    // 平面メッシュ
    const geometry = new THREE.PlaneBufferGeometry(2, 2);

    // 質感（ここでGLSLのコードを使用）
    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    // メッシュを作成
    const mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    // onWindowResize();
    // window.addEventListener( 'resize', onWindowResize, false );

    // renderer.render( scene, camera );
    animate();

    function animate() {
        requestAnimationFrame( animate );
        var currentTime = Date.now();
        uniforms.iGlobalTime.value = (currentTime - startTime) * 0.01;
        renderer.render( scene, camera );
    }
}
