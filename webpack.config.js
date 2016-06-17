var webpack = require('webpack')
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports={
	entry:{
		main:"main"
	},
	output:{

		filename:"bound.js",
		path:"./server/app/dist/",
		publicPath:"/app/dist/",
	},
	plugins:[
  		new webpack.ProvidePlugin({
        "$": "jquery",
        "jquery": "jquery",
        "window.jquery":"jquery"
   	 }),
  		new ExtractTextPlugin("style.css")
	],
	  devServer:{
      hot:true,
      inline:true,
      proxy:{
        //'*':"http://192.168.0.43:8078"
      },
      port:8078,
      host:'127.0.0.1'
   },
    externals: {
    jquery: "jQuery",//用外部的jQuery代替里面的jquery
   // bootJS:Path.resolve("./node_modules/bootstrap/dist/js/bootstrap.min.js")
  },
	resolve: {
    	extensions: ['', '.js', '.css', '.scss'],
	    modulesDirectories: [
	      '',
	      '.',
	      'node_modules',
	      './style',
	    ] //模块查找路径设置
	  },
	  module: {
	    loaders: [
	     {test: /\.js$/,loader: 'babel',include: __dirname},
      	  {test:/\.scss/,loader:ExtractTextPlugin.extract('style','css!autoprefixer!sass')},
      	  {test:/\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/, loader: 'url-loader?limit=50000&name=[path][name].[ext]'}

	    ]
 	 }
}