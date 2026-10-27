import { useMemo } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { geo } from "./geometries";
import { INK } from "./materials";
import { Part, type Vec3 } from "./Part";
import { paintGroundTile, toTexture, canvas2d } from "./paint";

/** Drives the R3F camera from frame-computed values (call every render). */
export const CameraRig: React.FC<{ position: Vec3; target: Vec3; fov?: number; roll?: number }> = ({
  position,
  target,
  fov = 30,
  roll = 0,
}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(...position);
  camera.up.set(Math.sin(roll), Math.cos(roll), 0);
  camera.lookAt(...target);
  if (camera.fov !== fov) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
  return null;
};

const SKY_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
const SKY_FRAG = /* glsl */ `
uniform vec3 uTop;
uniform vec3 uBottom;
uniform float uHorizon;
varying vec2 vUv;
void main() {
  float t = smoothstep(uHorizon, 1.0, vUv.y);
  gl_FragColor = vec4(mix(uBottom, uTop, t), 1.0);
  #include <colorspace_fragment>
}
`;

/** Huge gradient backdrop. Colors can change per frame (day/night cycles). */
export const Sky: React.FC<{ top: string; bottom: string; horizon?: number; z?: number }> = ({
  top,
  bottom,
  horizon = 0.3,
  z = -80,
}) => {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: SKY_VERT,
        fragmentShader: SKY_FRAG,
        depthWrite: false,
        uniforms: {
          uTop: { value: new THREE.Color() },
          uBottom: { value: new THREE.Color() },
          uHorizon: { value: 0 },
        },
      }),
    [],
  );
  mat.uniforms.uTop.value.set(top);
  mat.uniforms.uBottom.value.set(bottom);
  mat.uniforms.uHorizon.value = horizon;
  return (
    <mesh position={[0, 10, z]} material={mat} renderOrder={-10}>
      <planeGeometry args={[220, 120]} />
    </mesh>
  );
};

/** A flat painted layer (clouds, treelines, leaves) placed in depth for parallax. */
export const Painted: React.FC<{
  texture: THREE.Texture;
  size: [number, number];
  position: Vec3;
  rotation?: Vec3;
  opacity?: number;
}> = ({ texture, size, position, rotation, opacity = 1 }) => (
  <mesh position={position} rotation={rotation}>
    <planeGeometry args={size} />
    <meshBasicMaterial
      map={texture}
      transparent
      opacity={opacity}
      depthWrite={false}
      toneMapped={false}
      side={THREE.DoubleSide}
    />
  </mesh>
);

export const Ground: React.FC<{
  seed?: number;
  colors?: { base: string; light: string; dark: string; tuft: string };
  size?: number;
}> = ({
  seed = 3,
  colors = { base: "#a7a35f", light: "#c2b878", dark: "#7f8a47", tuft: "#6f8e3f" },
  size = 120,
}) => {
  const tex = useMemo(() => {
    const t = paintGroundTile(1024, seed, colors);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(size / 5, size / 5);
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -size / 2 + 10]}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
};

/** Flat disc with an ink ring (sun, moon, coins...). Always faces +z. */
export const Disc: React.FC<{ position: Vec3; radius: number; color: string; glow?: string }> = ({
  position,
  radius,
  color,
  glow,
}) => {
  const glowTex = useMemo(() => {
    if (!glow) return null;
    const { canvas, ctx } = canvas2d(256, 256);
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, glow);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return toTexture(canvas);
  }, [glow]);
  return (
    <group position={position}>
      {glowTex ? (
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[radius * 7, radius * 7]} />
          <meshBasicMaterial map={glowTex} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      ) : null}
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[radius * 1.09, 48]} />
        <meshBasicMaterial color={INK} toneMapped={false} />
      </mesh>
      <mesh>
        <circleGeometry args={[radius, 48]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
};

const r2 = (n: number) => Math.round(n * 100) / 100;

export const Palm: React.FC<{
  position: Vec3;
  height?: number;
  lean?: number;
  seed?: number;
  scale?: number;
  sway?: number;
  leaf?: string;
}> = ({ position, height = 5, lean = 0.8, seed = 1, scale = 1, sway = 0, leaf = "#5d8f3e" }) => {
  const n = 7;
  const pt = (t: number): [number, number] => [lean * t * t, height * t];
  const segs = Array.from({ length: n }, (_, i) => {
    const [x0, y0] = pt(i / n);
    const [x1, y1] = pt((i + 1) / n);
    const r = r2(0.17 - 0.06 * (i / n));
    const len = Math.hypot(x1 - x0, y1 - y0);
    return {
      pos: [(x0 + x1) / 2, (y0 + y1) / 2, 0] as Vec3,
      rot: -Math.atan2(x1 - x0, y1 - y0),
      g: geo.capsule(r, r2(Math.max(0.05, len - r * 0.6))),
    };
  });
  const [tx, ty] = pt(1);
  const fronds = 8;
  return (
    <group position={position} scale={scale}>
      {segs.map((s, i) => (
        <Part
          key={i}
          geometry={s.g}
          color={i % 2 ? "#8c6a4a" : "#7d5d40"}
          grain={0.12}
          position={s.pos}
          rotation={[0, 0, s.rot]}
        />
      ))}
      <group position={[tx, ty, 0]} rotation={[0, 0, sway]}>
        {[0, 1, 2].map((k) => (
          <Part
            key={k}
            geometry={geo.sphere()}
            color="#6d4b2f"
            scale={0.13}
            position={[Math.cos(k * 2.1) * 0.15, -0.15, Math.sin(k * 2.1) * 0.15]}
          />
        ))}
        {Array.from({ length: fronds }, (_, k) => (
          <group key={k} rotation={[0, (k / fronds) * Math.PI * 2 + seed, 0]}>
            <group rotation={[0.25 + (k % 3) * 0.12, 0, 0]}>
              <Part
                geometry={geo.sphere()}
                color={leaf}
                grain={0.08}
                scale={[0.24, 0.035, 0.85]}
                position={[0, 0, 0.75]}
              />
              <group position={[0, 0, 1.45]} rotation={[0.55, 0, 0]}>
                <Part
                  geometry={geo.sphere()}
                  color={leaf}
                  grain={0.08}
                  scale={[0.19, 0.03, 0.6]}
                  position={[0, 0, 0.45]}
                />
              </group>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
};

const BUSH_PUFFS: [number, number, number, number][] = [
  [0, 0.42, 0, 0.5],
  [-0.55, 0.3, 0.08, 0.38],
  [0.55, 0.32, 0.02, 0.4],
  [-0.25, 0.68, -0.1, 0.36],
  [0.3, 0.7, -0.05, 0.34],
  [0.05, 0.26, 0.3, 0.32],
];

export const Bush: React.FC<{ position: Vec3; scale?: number | Vec3; color?: string; rotation?: Vec3 }> = ({
  position,
  scale = 1,
  color = "#6e9a45",
  rotation,
}) => (
  <group position={position} scale={scale} rotation={rotation}>
    {BUSH_PUFFS.map(([x, y, z, r], i) => (
      <Part
        key={i}
        geometry={geo.sphere()}
        color={i % 2 ? color : new THREE.Color(color).offsetHSL(0.01, 0, -0.04).getStyle()}
        grain={0.1}
        position={[x, y, z]}
        scale={r}
      />
    ))}
  </group>
);

export const Rock: React.FC<{ position: Vec3; scale?: Vec3; color?: string }> = ({
  position,
  scale = [0.4, 0.25, 0.35],
  color = "#9b958c",
}) => <Part geometry={geo.sphere()} color={color} grain={0.15} position={position} scale={scale} />;

export const Hut: React.FC<{ position: Vec3; rotation?: Vec3 }> = ({ position, rotation }) => (
  <group position={position} rotation={rotation}>
    {[-1.1, 1.1].map((x) => (
      <Part key={x} geometry={geo.capsule(0.07, 1.6)} color="#7d5d40" position={[x, 0.85, 0.7]} />
    ))}
    <Part
      geometry={geo.box(2.8, 0.14, 2.1, 0.06)}
      color="#b39257"
      pattern="#97773f"
      patternAmt={0.6}
      patternScale={6}
      grain={0.15}
      position={[0, 1.3, -0.1]}
      rotation={[-0.62, 0, 0]}
    />
    {[-0.9, -0.3, 0.3, 0.9].map((x, i) => (
      <Part
        key={x}
        geometry={geo.sphere()}
        color={i % 2 ? "#6b9343" : "#5d873a"}
        grain={0.1}
        scale={[0.42, 0.06, 1.1]}
        position={[x, 1.42, -0.15]}
        rotation={[-0.62, (i - 1.5) * 0.15, 0]}
      />
    ))}
    <Part geometry={geo.box(2.2, 0.06, 1.2, 0.03)} color="#a88a55" position={[0, 0.03, -0.2]} outline={0.015} />
  </group>
);

/** Campfire; `flicker` 0..1 is driven by a GSAP timeline. */
export const Campfire: React.FC<{ position: Vec3; flicker: number; glow?: number }> = ({
  position,
  flicker,
  glow = 1,
}) => {
  const glowTex = useMemo(() => {
    const { canvas, ctx } = canvas2d(256, 256);
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(255,190,90,0.55)");
    g.addColorStop(1, "rgba(255,150,60,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    return toTexture(canvas);
  }, []);
  const s = 0.9 + flicker * 0.2;
  return (
    <group position={position}>
      {Array.from({ length: 7 }, (_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <Part
            key={i}
            geometry={geo.sphere()}
            color="#8f8a84"
            grain={0.15}
            scale={[0.13, 0.09, 0.12]}
            position={[Math.cos(a) * 0.38, 0.05, Math.sin(a) * 0.32]}
          />
        );
      })}
      <Part geometry={geo.capsule(0.06, 0.55)} color="#6b4a33" position={[0, 0.08, 0]} rotation={[0, 0.6, Math.PI / 2]} />
      <Part geometry={geo.capsule(0.06, 0.55)} color="#5e402c" position={[0, 0.12, 0]} rotation={[0, -0.7, Math.PI / 2]} />
      <group position={[0, 0.12, 0.02]} scale={[1, s, 1]}>
        <Part geometry={geo.sphere()} color="#ef8a2e" flat scale={[0.22, 0.42, 0.18]} position={[0, 0.32, 0]} outline={0.016} />
        <Part geometry={geo.sphere()} color="#ffd65c" flat scale={[0.12, 0.26, 0.1]} position={[0, 0.24, 0.1]} outline={0} />
      </group>
      <mesh position={[0, 0.4, -0.2]}>
        <planeGeometry args={[3.2 * glow, 3.2 * glow]} />
        <meshBasicMaterial
          map={glowTex}
          transparent
          opacity={0.6 + flicker * 0.4}
          depthWrite={false}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};

/** Flat sheet of paper with a painted front texture and a plain back. */
export const Sheet: React.FC<{
  front: THREE.Texture;
  back?: THREE.Texture;
  size: [number, number];
  position?: Vec3;
  rotation?: Vec3;
}> = ({ front, back, size, position, rotation }) => (
  <group position={position} rotation={rotation}>
    <mesh>
      <planeGeometry args={size} />
      <meshBasicMaterial map={front} toneMapped={false} />
    </mesh>
    <mesh rotation={[0, Math.PI, 0]}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={back ?? front} toneMapped={false} />
    </mesh>
  </group>
);
