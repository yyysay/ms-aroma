package main

import (
	"os"
	"path/filepath"
	"strings"
)

// FileExists 判断文件是否存在
func FileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}

// EnsureDir 创建目录（不存在时）
func EnsureDir(dir string) error {
	return os.MkdirAll(dir, 0755)
}

// ChangeExt 修改文件扩展名
// abc.jpg -> abc.webp
func ChangeExt(filename, ext string) string {
	name := strings.TrimSuffix(filename, filepath.Ext(filename))
	return name + ext
}

// NeedRebuild 判断目标文件是否需要重新生成
//
// 返回 true 表示：
//
//	目标不存在
//	或者源文件比目标更新
func NeedRebuild(srcFile, dstFile string) bool {

	dstInfo, err := os.Stat(dstFile)
	if os.IsNotExist(err) {
		return true
	}

	srcInfo, err := os.Stat(srcFile)
	if err != nil {
		return true
	}

	return srcInfo.ModTime().After(dstInfo.ModTime())
}

// SafeFileName 去除前后空格
func SafeFileName(name string) string {
	return strings.TrimSpace(name)
}

func GetFileModifyTime(path string) string {

	info, err := os.Stat(path)

	if err != nil {
		return ""
	}

	return info.ModTime().
		Format("2006-01-02")

}
