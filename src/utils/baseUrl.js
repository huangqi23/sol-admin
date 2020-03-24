let baseUrl = '/sysApi' // 本地代理

switch (process.env.NODE_ENV) {
    case 'serve':
        baseUrl = 'http://localhost:8434/' // 测试环境url
        break
    case 'dev':
        baseUrl = 'http://testserver.feleti.cn/' // 测试环境url
        break
    case 'pre':
        baseUrl = 'https://pre-server.feleti.cn' // 预上线环境url
        break
    case 'production':
        // baseUrl = 'https://api.feleti.cn' // 生产环境url
        baseUrl = '/sysApi' // 生产环境url
        break
}

export default baseUrl
