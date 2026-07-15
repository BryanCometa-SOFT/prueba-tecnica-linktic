// Formatea una fecha ISO a YYYY-MM-DD HH:MM AM/PM, o "-" si es null/undefined
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'

  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'

  hours = hours % 12 || 12

  return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`
}

// Formatea un número a moneda COP con símbolo $
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
