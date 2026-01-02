export function hasPermission(userPermissions = [], required) {
  if (!required) return false;

  const requiredList = Array.isArray(required)
    ? required
    : [required];

  return requiredList.some((p) =>
    userPermissions.includes(p)
  );
}
