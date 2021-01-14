varying vec2 vUv;

uniform sampler2D tex;
uniform vec2 resolution;
uniform float time;
uniform bool invert;
// uniform float seed;
// uniform bool darkMode;
// uniform bool useTime;
uniform float radius;
// uniform float radius;
// uniform float frequency;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)
// #pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

void main() {

    float mSize = radius;
    
    float vx = floor( ( resolution.x ) * vUv.x / mSize );
    float mx = mod( ( resolution.x ) * vUv.x , mSize ) / mSize;
    float vy = floor( ( resolution.y ) * vUv.y / mSize );
    float my = mod( ( resolution.y ) * vUv.y , mSize ) / mSize;

    vec4 map = texture( tex, vec2( vx / ( resolution.x / mSize ), vy / ( resolution.y / mSize ) ) );
    
    float cout = 0.0;
    float nr;
    if( invert ) nr = 1.0 - map.a;
    else nr = map.a;
    float nn = ( snoise3( vec3( vx * 10.5, vy * 10.5, time ) ) + 1.0 ) * 0.5;
    nr *= nn;
    cout += ( 1.0 - length( vec2( ( mx - 0.5 ) * 2.0, ( my - 0.5 ) * 2.0 ) ) ) * nr;

    float cut = smoothstep( 0.1, 0.15, cout );
 
	gl_FragColor = vec4( cut );

}
 