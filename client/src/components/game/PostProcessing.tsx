import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useRacing } from "@/lib/stores/useRacing";

export function PostProcessing() {
  const { phase, speed } = useRacing();
  
  const bloomIntensity = phase === "racing" ? 0.3 + (speed / 200) * 0.4 : 0.2;
  const vignetteIntensity = phase === "racing" ? 0.4 + (speed / 200) * 0.2 : 0.3;
  
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
        darkness={vignetteIntensity}
      />
    </EffectComposer>
  );
}
