package main

import (
	"strings"

	"github.com/gin-gonic/gin"
)

// NewRouter 创建 Gin 路由
func NewRouter() *gin.Engine {

	r := gin.Default()

	setupMiddleware(r)

	setupStatic(r)

	setupAPI(r)

	return r
}

// 中间件
func setupMiddleware(r *gin.Engine) {

	r.Use(func(c *gin.Context) {

		// CORS
		c.Writer.Header().Set(
			"Access-Control-Allow-Origin",
			"*",
		)

		// 图片缓存
		if strings.HasPrefix(
			c.Request.URL.Path,
			"/images/",
		) {

			c.Writer.Header().Set(
				"Cache-Control",
				"public,max-age=31536000,immutable",
			)
		}

		c.Next()
	})
}

// 静态文件
func setupStatic(r *gin.Engine) {

	// WebP 图片目录
	r.Static(
		"/images",
		OutputDir,
	)

	// 前端页面
	r.StaticFile(
		"/",
		"./index.html",
	)

	r.StaticFile(
		"/app.js",
		"./app.js",
	)
}

// API
func setupAPI(r *gin.Engine) {

	r.GET(
		"/api/products",
		GetProducts,
	)
}
