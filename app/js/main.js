import { Scene, WebGLRenderer, OrthographicCamera, Mesh, PlaneBufferGeometry, CanvasTexture, ShaderMaterial, Vector2 } from 'three'
import logo from './../assets/download-1.svg'
import shader from './base.*'

class Main{
    constructor(){
        this.node = document.getElementById( 'main' )
        this.camera = new OrthographicCamera( )
        this.scene = new Scene()
        this.renderer = new WebGLRenderer( { antialias : true, alpha : true, preserveDrawingBuffer: true } )
        this.node.appendChild( this.renderer.domElement )

        this.loadImage( logo )

        var mat = new ShaderMaterial({
            uniforms : {
                tex : { value : null },
                resolution : { value : new Vector2( 960, 540 ) },
                time : { value : 0 },
                radius : { value : 8 },
                invert : { value : false }
            },
            vertexShader : shader.vert,
            fragmentShader : shader.frag
        })
        this.plane = new Mesh( new PlaneBufferGeometry( 1, 1 ), mat )
        this.scene.add( this.plane )

        this.onResize()
        requestAnimationFrame( ( time ) => this.step( time ) )

        document.body.addEventListener( 'dragover', ( e ) => e.preventDefault(), false)
        document.body.addEventListener('drop', ( e ) => this.onDrop( e ), false )
        window.addEventListener('keydown', ( e ) => {
            if( e.keyCode == 73 ) this.plane.material.uniforms.invert.value = !this.plane.material.uniforms.invert.value
            if( /^\d+$/.test(e.key) ) {
                this.plane.material.uniforms.radius.value = 2 + parseInt( e.key * 2 )
                clearInterval( this.randomInterval )
            }

            if( e.keyCode == 82 ) {
                this.randomInterval = setInterval( ( ) => {
                    this.plane.material.uniforms.radius.value = 2 + Math.random() * 10
                }, 1000)
            }
        })

        this.randomInterval = setInterval( ( ) => {
            this.plane.material.uniforms.radius.value = 2 + Math.random() * 10
        }, 1000)
    }

    loadImage( src ){
        var canvas = document.createElement( 'canvas' )
        var ctx = canvas.getContext( '2d' )
        var img = new Image()
        img.onload = () => {
            ctx.filter = 'blur(1px)'
            ctx.drawImage( img, ( 960 - 300 ) * 0.5, ( 540 - 300 ) * 0.5, 300, 300 )
            this.plane.material.uniforms.tex.value = new CanvasTexture( canvas )
        }
        img.src = src
        canvas.width = 960
        canvas.height = 540
    }


    onDrop( e ){
        e.preventDefault()
        let file = e.dataTransfer.files[ 0 ]
        let reader = new FileReader()
        console.log( file )
        var ext = file.name.split( '.' )[ file.name.split( '.' ).length - 1 ]
        reader.readAsDataURL( file )

        reader.onloadend = ( e ) => {
            if( ext == 'svg' ) {
                this.loadImage( reader.result )
                return
            }
            if( ext == 'png' || ext == 'gif' || ext == 'jpg' || ext == 'jpeg' ) document.querySelector( '#bg' ).style[ 'background-image' ] = 'url( ' + reader.result + ' )'
            if( ext == 'mp4' || ext == 'mov' ) {
                var bg = document.querySelector( '#bg' )
                var v = document.createElement( 'video' )
                bg.appendChild( v )
                v.src = URL.createObjectURL(file)
                v.play()
                v.loop = true
                v.addEventListener( 'loadedmetadata', e => {
                    var vdar = v.videoHeight / v.videoWidth
                    var sar = bg.offsetHeight / bg.offsetWidth
                    if( vdar > sar ) {
                        v.setAttribute( 'width', bg.offsetWidth )
                        v.setAttribute( 'height', bg.offsetWidth * vdar )
                        v.style.transform = 'translate3d( 0px, ' + -( bg.offsetWidth * vdar - bg.offsetHeight ) / 2 + 'px, 0px )'
                    } else {
                        v.setAttribute( 'height', bg.offsetHeight )
                        v.setAttribute( 'width', bg.offsetHeight / vdar )
                        v.style.transform = 'translate3d( ' + -(  bg.offsetHeight / vdar - bg.offsetWidth  ) / 2 + 'px, 0px, 0px )'

                    }
                })
            }
        }

    }


    onResize( ) {
        var [ width, height ] = [ this.node.offsetWidth, this.node.offsetHeight ]
        this.renderer.setSize( width, height )
        this.renderer.setPixelRatio( window.devicePixelRatio )
        Object.assign( this.camera, { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 } )
        this.camera.position.z = 10
        this.plane.scale.set( width, height )
        this.camera.updateProjectionMatrix()
    }
  
    step( time ){
        requestAnimationFrame( ( time ) => this.step( time ) )
        this.plane.material.uniforms.time.value += 0.05
        this.renderer.render( this.scene, this.camera )
    }


}

new Main()