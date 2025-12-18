export function hasPermission(userPermissions = [], required = []) {
  if (!required.length) return true
  return required.some((p) => userPermissions.includes(p))
}
