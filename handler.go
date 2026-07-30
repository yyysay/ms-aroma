package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetProducts 返回商品列表
func GetProducts(c *gin.Context) {

	products, err := ReadProducts(ProductFile)

	if err != nil {

		log.Printf("❌ 读取失败: %v\n", err)

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})

		return

	}

	resp := ProductsResponse{

		Products:  products,
		UpdatedAt: GetFileModifyTime(ProductFile),
	}

	c.JSON(http.StatusOK, resp)

}
