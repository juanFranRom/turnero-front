/** @type {import('next').NextConfig} */

const nextConfig = {
    basePath: '/innova',
    env: {
        SECRETKEY: 'aX&y**v0O06H^5jJ',
        //REACT_APP_BASE_URL: 'http://localhost:8420/api',
        //SERVER_APP_BASE_URL: 'http://localhost:8420/api'
        REACT_APP_BASE_URL: 'https://monic.com.ar:8420/api',
        SERVER_APP_BASE_URL: 'https://monic.com.ar:8420/api'
    }
}

export default nextConfig