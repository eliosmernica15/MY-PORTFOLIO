export interface DeviceProfile {
  isTouch: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  isLowPower: boolean;
  enableHeavyEffects: boolean;
  enable3D: boolean;
  enableMagnetic: boolean;
  enableCustomCursor: boolean;
}

const defaultProfile: DeviceProfile = {
  isTouch: false,
  isMobile: false,
  prefersReducedMotion: false,
  isLowPower: false,
  enableHeavyEffects: true,
  enable3D: true,
  enableMagnetic: true,
  enableCustomCursor: true,
};

export function readDeviceProfile(): DeviceProfile {
  if (typeof window === 'undefined') return defaultProfile;

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobile = window.innerWidth < 1024;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const isLowPower = cores <= 4 || isMobile;
  const enableHeavyEffects = !prefersReducedMotion && !isLowPower;
  const enable3D =
    !prefersReducedMotion &&
    !isMobile &&
    finePointer &&
    cores > 4 &&
    window.innerWidth >= 1024;

  return {
    isTouch,
    isMobile,
    prefersReducedMotion,
    isLowPower,
    enableHeavyEffects,
    enable3D,
    enableMagnetic: finePointer && !prefersReducedMotion && !isLowPower,
    enableCustomCursor: finePointer && !prefersReducedMotion,
  };
}

let cachedProfile: DeviceProfile | null = null;

export function getDeviceProfile(): DeviceProfile {
  if (!cachedProfile) cachedProfile = readDeviceProfile();
  return cachedProfile;
}
