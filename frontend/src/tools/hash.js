// Unsecured

async function hash(message) {
    // Преобразование сообщения в буфер
    const buffer = new TextEncoder().encode(message);
  
    // Получение хэша с использованием алгоритма SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  
    // Преобразование буфера хэша в строку
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

export default hash