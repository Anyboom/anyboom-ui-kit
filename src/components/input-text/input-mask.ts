/* eslint-disable regexp/no-obscure-range -- маска ввода допускает кириллицу */
export interface InputMaskToken {
  pattern: RegExp
}

export type InputMaskTokens = Record<string, InputMaskToken>

export const inputMaskTokens: InputMaskTokens = {
  '#': { pattern: /\d/ },
  '@': { pattern: /[a-zA-Zа-яА-Я]/ },
  '*': { pattern: /[a-zA-Z0-9а-яА-Я]/ },
}

function isTokenFilled(char: string): boolean {
  return Object.values(inputMaskTokens).some(token =>
    token.pattern.test(char),
  )
}

export function applyMask(value: string, mask: string | null): string {
  if (!mask || !value) {
    return value
  }

  let result = ''
  let valueIndex = 0

  for (let maskIndex = 0; maskIndex < mask.length; maskIndex++) {
    if (valueIndex >= value.length) {
      break
    }

    const maskChar = mask[maskIndex]
    const token = inputMaskTokens[maskChar]

    if (token) {
      const valueChar = value[valueIndex]

      if (token.pattern.test(valueChar)) {
        result += valueChar
        valueIndex++
      }
      else {
        valueIndex++
        maskIndex--
      }
    }
    else {
      result += maskChar

      if (value[valueIndex] === maskChar) {
        valueIndex++
      }
    }
  }

  return result
}

export function unmaskValue(value: string, mask: string | null): string {
  if (!mask || !value) {
    return value
  }

  let result = ''
  let valueIndex = 0

  for (let maskIndex = 0; maskIndex < mask.length; maskIndex++) {
    if (valueIndex >= value.length) {
      break
    }

    const maskChar = mask[maskIndex]
    const token = inputMaskTokens[maskChar]

    if (token) {
      if (token.pattern.test(value[valueIndex])) {
        result += value[valueIndex]
      }
      valueIndex++
    }
    else if (value[valueIndex] === maskChar) {
      valueIndex++
    }
  }

  return result
}

export function shouldClearMaskedValue(
  value: string,
  mask: string | null,
): boolean {
  if (!mask || !value) {
    return false
  }

  return !value.split('').some(isTokenFilled)
}
