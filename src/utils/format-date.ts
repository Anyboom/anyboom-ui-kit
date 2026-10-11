/**
 * Форматирование даты в удобный вид для чтения.
 * @param {string} dateString - дата и время.
 */
export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString()
}
