export const slugify = (value: string): string => {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const generateUniqueTrainingSlug = (
  title: string,
  existingSlugs: string[]
): string => {
  const baseSlug = slugify(title) || 'training'
  const usedSlugs = new Set(existingSlugs.map(slug => slug.toLowerCase()))

  if (!usedSlugs.has(baseSlug)) {
    return baseSlug
  }

  let suffix = 2
  let candidate = `${baseSlug}-${suffix}`

  while (usedSlugs.has(candidate)) {
    suffix++
    candidate = `${baseSlug}-${suffix}`
  }

  return candidate
}
