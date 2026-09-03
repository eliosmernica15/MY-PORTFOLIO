'use client';
import { useEffect, useState } from 'react';
import { useMediaQuery } from './useMediaQuery';

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
  const enable3D = !prefersReducedMotion && !isMobile && finePointer && cores > 4 && window.innerWidth >= 1024;
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

export function getDeviceProfile(): DeviceProfile {
  // No cache — the profile depends on viewport size and matchMedia
  // state, which can change at runtime (orientation, window resize,
  // user toggling system reduced motion). The call is cheap (a few
  // matchMedia + a few property reads), so re-deriving on every call
  // is the correct trade-off. The previous module-level cache froze
  // the profile at first import, so a tablet rotated after page load
  // would stay in its original `enable3D` bucket until full reload.
  return readDeviceProfile();
}

export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(defaultProfile);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  useEffect(() => {
    const update = () => setProfile(readDeviceProfile());
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, [reduced, fine]);
  return profile;
}
