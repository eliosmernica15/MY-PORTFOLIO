// Re-export the device profile types and the sync getter. The hook
// version (`useDeviceProfile`) lives in `src/hooks/useDeviceProfile.ts`
// and is re-exported below so component code can import either from
// the same path (`hooks/useDeviceProfile`) without worrying about
// which file the implementation is in.
export { useDeviceProfile, readDeviceProfile, getDeviceProfile } from '../src/hooks/useDeviceProfile';
export type { DeviceProfile } from '../src/hooks/useDeviceProfile';
