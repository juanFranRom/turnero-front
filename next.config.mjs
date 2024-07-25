/** @type {import('next').NextConfig} */

const nextConfig = {
    basePath: '/innova',
    env: {
        SECRETKEY: 'aX&y**v0O06H^5jJ',
        //REACT_APP_BASE_URL: 'http://localhost:8420/api',
        //SERVER_APP_BASE_URL: 'http://localhost:8420/api',
        //WS_APP_BASE_URL: 'ws://localhost:9000'
        REACT_APP_BASE_URL: 'https://monic.com.ar:8420/api',
        SERVER_APP_BASE_URL: 'https://monic.com.ar:8420/api',
        WS_APP_BASE_URL: 'ws://monic.com.ar:9000'
    }
}

export default nextConfig
