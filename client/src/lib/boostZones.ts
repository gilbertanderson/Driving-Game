export interface BoostZone {
  position: [number, number, number];
  rotation: number;
  width: number;
  length: number;
  radius: number;
}

export const BOOST_ZONES: BoostZone[] = [
  { position: [65, 0.03, -15], rotation: -Math.PI / 4, width: 12, length: 8, radius: 8 },
  { position: [15, 0.03, -110], rotation: 0, width: 12, length: 8, radius: 8 },
  { position: [-30, 0.03, -55], rotation: Math.PI / 2, width: 12, length: 8, radius: 8 }
];

export function checkBoostZone(x: number, z: number): boolean {
  for (const zone of BOOST_ZONES) {
    const dx = x - zone.position[0];
    const dz = z - zone.position[2];
    const distance = Math.sqrt(dx * dx + dz * dz);
    if (distance < zone.radius) {
      return true;
    }
  }
  return false;
}
