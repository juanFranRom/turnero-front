//Solo sirve para recibir de nuestras api o en su defecto que respondan json
import CryptoJS from 'crypto-js';

const encryptData = (data) => {
    if(data)
    {
        const ciphertext = CryptoJS.AES.encrypt(data, "aX&y**v0O06H^5jJ").toString();
        return ciphertext;
    }
    return null
}

const decryptFetch = async (response) => {
    try {
        const bytes = CryptoJS.AES.decrypt(response, "aX&y**v0O06H^5jJ");
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData
    } catch (error) {
        return null
    }
}

export const encryptFetch = async (url, options, body, callback) => {
    try {
        let encryptBody = encryptData(JSON.stringify(body))
        let response = await fetch(url, {
            ...options,
            cache: 'no-store',
            body: JSON.stringify({
                data: `${encryptBody}`
            })
        })
        response = await response.json()
        response.data = await decryptFetch(response.data)
        callback(response)
    } catch (error) {
        console.log(error);
    }
}

export const middleFetch = async (url, options) => {
    try {
        let response = await fetch(url, options);

        if (response.status === 401) {
            // Aquí puedes ejecutar tu lógica para cerrar sesión

            if (window) {
                if (window.localStorage.getItem('user-innova')) {
                    window.localStorage.removeItem('user-innova')
                    window.location.reload()
                }
            }
        }
        response = await response.json();
        return response
    } catch (error) {
        console.error('Error en customFetch:', error);
        throw error;
    }
};

