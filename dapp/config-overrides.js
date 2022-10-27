const webpack = require('webpack'); 

module.exports = function override (config, env) {
    console.log('override')
    let loaders = config.resolve
    loaders.fallback = {
      	"crypto": require.resolve("crypto-browserify"), 
        "stream": require.resolve("stream-browserify"), 
	"assert": require.resolve("assert"), 
	"http": require.resolve("stream-http"), 
	"https": require.resolve("https-browserify"), 
	"os": require.resolve("os-browserify"), 
	"url": require.resolve("url") 
    }
    
    config.plugins = (config.plugins || []).concat([
   	new webpack.ProvidePlugin({ 
	      Buffer: ['buffer', 'Buffer'] 
	    }) 
   ]) 
    return config
}
