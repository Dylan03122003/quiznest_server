export function excludeFields(obj: any, fieldsToExclude: string[]) {
  if (!obj || typeof obj !== 'object') {
    throw new Error('Input must be an object')
  }

  if (!Array.isArray(fieldsToExclude)) {
    throw new Error('fieldsToExclude must be an array of field names')
  }

  const result = { ...obj }

  for (const field of fieldsToExclude) {
    delete result[field]
  }

  return result
}
