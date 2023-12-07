const isDev = require("electron-is-dev");

module.exports = {
    is_development: isDev ? true : false,
    node_url: 'https://gstapi.themunim.com/api',
    gst_secret_key: 'MUNIM_UTILITY_@%$&@*#^(007)!_SECRETKEY_IDENTIX_inhouse'
}

// dev node_url: 'https://devgstapi.themunim.com/api',