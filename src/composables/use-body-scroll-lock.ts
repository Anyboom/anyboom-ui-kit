export function useBodyScrollLock() {
  function lock(): void {
    document.body.style.overflow = 'hidden'
  }

  function unlock(): void {
    document.body.style.overflow = ''
  }

  return { lock, unlock }
}
