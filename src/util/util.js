/**
 * 工具库
 */
export default {
    getQueryParams() {
        const params = {}
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => { params[key] = value })
        return params
    }
}