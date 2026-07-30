package main

import (
	"fmt"
	"log"
)

func main() {

	// 初始化图片处理
	if err := InitImages(); err != nil {
		log.Fatalf(
			"图片初始化失败: %v",
			err,
		)
	}

	// 创建路由
	r := NewRouter()

	fmt.Println(
		"🚀 服务已开启！访问：http://localhost:8080",
	)

	// 启动服务
	if err := r.Run(ServerAddr); err != nil {
		log.Fatal(err)
	}
}
