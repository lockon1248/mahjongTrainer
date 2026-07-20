export const readRequiredNodeMajor = (nvmrcText) => {
  const normalized = nvmrcText.trim()

  if (!/^[1-9]\d*$/.test(normalized))
    throw new Error('invalid Node major in .nvmrc')

  return Number(normalized)
}

export const assertSupportedNodeVersion = (actualVersion, requiredMajor) => {
  const actualMajor = Number(actualVersion.replace(/^v/, '').split('.')[0])

  if (actualMajor === requiredMajor)
    return

  throw new Error(
    `Node ${requiredMajor} is required by .nvmrc; current runtime is ${actualVersion}. Run "nvm use".`
  )
}
