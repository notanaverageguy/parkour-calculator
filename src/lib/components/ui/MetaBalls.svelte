<script>
	import undent from '../../utils/undent';
	import { createProgram, getProgramSetters } from '../../utils/gl_utils';
	import { onMount } from 'svelte';
	import { mat3, mat4, vec2, vec3, vec4 } from 'gl-matrix';

	let ballCount;
	let canvas;

	onMount(() => {
		function get_ball_count() {
			const area = window.innerWidth * window.innerHeight;

			const oneK = 1280 * 720; // ~1K
			const twoK = 2560 * 1440; // ~2K

			const minBalls = 15;
			const maxBalls = 50;

			// Normalize between 1K and 2K
			const t = Math.min(Math.max((area - oneK) / (twoK - oneK), 0), 1);

			return Math.round(minBalls + t * (maxBalls - minBalls));
		}
		ballCount = get_ball_count();
		const gl = canvas.getContext('webgl2');
		if (!gl) throw new Error('No GL For you!');

		// ************************************************** //
		// resize canvas support
		function resize() {
			if (canvas.width == canvas.clientWidth && canvas.height == canvas.clientHeight) return;

			canvas.width = canvas.clientWidth;
			canvas.height = canvas.clientHeight;

			setters.uniforms.u_resolution?.(new Float32Array([canvas.width, canvas.height]));
		}

		// ************************************************** //

		// ************************************************** //
		// mouse position
		window.addEventListener('pointermove', (e) => {
			const x = e.clientX; // X relative to viewport
			const y = e.clientY; // Y relative to viewport
			setters.uniforms.u_mousePos?.(new Float32Array([x, window.innerHeight - y])); // flip Y for WebGL
		});
		// ************************************************** //
		// Shaders
		var vertexShaderSource = undent`#version 300 es
		in vec2 a_position;
		void main() { gl_Position = vec4(a_position,0.0,1.0); }
	`;
		var fragmentShaderSource = undent`#version 300 es
		precision highp float;

		struct Ball {
			vec2 pos;
			float radius;
		};
		const float ss = 0.01;
		const float linewidth = 0.01;
		const float mouseRadius = 10.0;
		const int ballCount = ${ballCount};
		
		uniform vec2 u_resolution;		
		uniform vec2 u_mousePos;
		
		uniform Ball u_balls[ballCount];

		out vec4 outColor;

		void main() {
		  // distance to mouse
			float o = mouseRadius/distance(gl_FragCoord.xy, u_mousePos);
			// add distance to each ball
			for(int i=0;i<ballCount;i++) o += u_balls[i].radius/distance(gl_FragCoord.xy, u_balls[i].pos);
			// make an edge
			o = smoothstep(1.0-linewidth,(1.0-linewidth)+ss,o) * (1.0-smoothstep(1.,1.+ss,o));
			// color it grey
			outColor = vec4(vec3(o*.5),o);
		}
	`;

		const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
		const setters = getProgramSetters(gl, program);
		// create a clipping space quad
		const positions = [-1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0];
		setters.attribs.a_position(new Float32Array(positions));

		// utility random
		function random(...args) {
			switch (args.length) {
				default:
				case 0:
					return Math.random();
				case 1:
					return Math.random() * args[0];
				case 2:
					return args[0] + Math.random() * (args[1] - args[0]);
			}
		}

		// create random balls
		var balls = [...Array(ballCount)].map((x, i) => ({
			pos: [random(innerWidth), random(innerHeight)],
			vel: vec2.random(vec2.create(), random(3, 5)),
			radius: random(10, 12)
		}));

		function updateBalls() {
			var dt = 0.016;
			balls.forEach((ball) => {
				if (ball.pos[0] - ball.radius < 0 || ball.pos[0] + ball.radius > innerWidth)
					ball.vel[0] *= -1;
				if (ball.pos[1] - ball.radius < 0 || ball.pos[1] + ball.radius > innerHeight)
					ball.vel[1] *= -1;
				ball.pos[0] += dt * ball.vel[0];
				ball.pos[1] += dt * ball.vel[1];
			});
			balls.forEach((ball, i) => {
				setters.uniforms[`u_balls[${i}].pos`](new Float32Array(ball.pos));
				setters.uniforms[`u_balls[${i}].radius`]([ball.radius]);
			});
		}

		// ************************************************** //
		function renderScene() {
			updateBalls();

			gl.viewport(0, 0, canvas.width, canvas.height);
			// Clear the canvas
			gl.clearColor(0, 0, 0, 1);
			gl.clear(gl.COLOR_BUFFER_BIT);
			// render a quad
			gl.useProgram(program);
			gl.drawArrays(gl.TRIANGLES, 0, 6);
		}

		// ************************************************** //
		resize();
		window.addEventListener('resize', resize);

		// ************************************************** //
		// render loop
		async function loop() {
			await renderScene();
			requestAnimationFrame(loop);
		}
		requestAnimationFrame(loop);
	});
</script>

<canvas bind:this={canvas}></canvas>

<style>
	canvas {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		padding: 0;
		margin: 0;
		z-index: -1;
	}
</style>
