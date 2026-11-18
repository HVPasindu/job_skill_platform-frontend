// Progressive enhancement only: CSS artwork is available before and without WebGL.
// Browsers without these optional device hints keep the normal desktop behavior.
export function canLoad3D(device = navigator) {
  const connection = device.connection;
  if (
    connection?.saveData ||
    ["slow-2g", "2g"].includes(connection?.effectiveType)
  )
    return false;
  if (device.hardwareConcurrency && device.hardwareConcurrency <= 2)
    return false;
  if (device.deviceMemory && device.deviceMemory <= 2) return false;
  return true;
}
