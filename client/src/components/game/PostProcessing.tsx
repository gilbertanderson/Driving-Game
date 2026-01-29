import { EffectComposer, Bloom, Vignette, DepthOfField } from "@react-three/postprocessing";
import { useRacing } from "@/lib/stores/useRacing";

export function PostProcessing() {
  const { phase, speed } = useRacing();
  
  const bloomIntensity = phase === "racing" ? 0.3 + (speed / 200) * 0.4 : 0.2;
  
  return (
    <EffectComposer>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      <Vignette
        offset={0.3}
        darkness={phase === "racing" ? 0.4 + (speed / 200) * 0.2 : 0.3}
      />
      {phase === "racing" && speed > 100 && (
        <DepthOfField
          focusDistance={0.01}
          focalLength={0.02}
          bokehScale={2}
        />
      )}
    </EffectComposer>
  );
}
