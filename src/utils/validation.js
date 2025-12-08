// src/utils/validation.js

// E-posta formatı doğru mu? (örn: @isareti var mı, .com var mı)
export const validateEmail = (email) => {
    // Daha katı ve standart bir kontrol:
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// GÜNCELLENEN KISIM:
export const validatePassword = (password) => {
    // Eğer password varsa ve uzunluğu 6'dan büyükse TRUE, yoksa FALSE döner
    // !! işareti veriyi zorla boolean (true/false) yapar.
    return !!password && password.length >= 6;
};