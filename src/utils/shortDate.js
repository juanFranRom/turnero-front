
export function shortDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2); // Solo tomamos los últimos dos dígitos del año
  
    return `${day}-${month}-${year}`;
}