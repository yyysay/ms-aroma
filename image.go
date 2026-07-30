package main

import (
	"fmt"
	"image"
	"image/color"
	"os"
	"path/filepath"

	"github.com/chai2010/webp"
	"github.com/disintegration/imaging"
)

// 获取主体边界（自动裁剪白边）
func getBoundingBox(img image.Image, threshold uint8) image.Rectangle {

	bounds := img.Bounds()

	minX := bounds.Max.X
	minY := bounds.Max.Y

	maxX := bounds.Min.X
	maxY := bounds.Min.Y

	hasContent := false

	for y := bounds.Min.Y; y < bounds.Max.Y; y++ {
		for x := bounds.Min.X; x < bounds.Max.X; x++ {

			r, g, b, _ := img.At(x, y).RGBA()

			r8 := uint8(r >> 8)
			g8 := uint8(g >> 8)
			b8 := uint8(b >> 8)

			if r8 < threshold ||
				g8 < threshold ||
				b8 < threshold {

				if x < minX {
					minX = x
				}

				if x > maxX {
					maxX = x
				}

				if y < minY {
					minY = y
				}

				if y > maxY {
					maxY = y
				}

				hasContent = true
			}
		}
	}

	if !hasContent {
		return bounds
	}

	return image.Rect(minX, minY, maxX+1, maxY+1)
}

// 保存 WebP
func saveWebP(img image.Image, path string) error {

	file, err := os.Create(path)
	if err != nil {
		return err
	}

	defer file.Close()

	return webp.Encode(file, img, &webp.Options{
		Lossless: false,
		Quality:  WebPQuality,
	})
}

// 初始化图片
func InitImages() error {

	if err := EnsureDir(OutputDir); err != nil {
		return err
	}

	return ProcessImages()
}

// 批量处理图片
func ProcessImages() error {

	files, err := os.ReadDir(ImageDir)
	if err != nil {
		return err
	}

	fmt.Println("开始生成 WebP 图片...")

	for _, file := range files {

		if file.IsDir() {
			continue
		}

		inPath := filepath.Join(ImageDir, file.Name())

		outPath := filepath.Join(
			OutputDir,
			ChangeExt(file.Name(), ".webp"),
		)

		// 未变化直接跳过
		if !NeedRebuild(inPath, outPath) {
			continue
		}

		src, err := imaging.Open(inPath)
		if err != nil {
			continue
		}

		// 自动裁切
		rect := getBoundingBox(src, WhiteThreshold)

		cropped := imaging.Crop(src, rect)

		// 缩放
		resized := imaging.Fit(
			cropped,
			FitSize,
			FitSize,
			imaging.CatmullRom,
		)

		// 白底
		canvas := imaging.New(
			CanvasSize,
			CanvasSize,
			color.White,
		)

		x := (CanvasSize - resized.Bounds().Dx()) / 2
		y := (CanvasSize - resized.Bounds().Dy()) / 2

		final := imaging.Paste(
			canvas,
			resized,
			image.Pt(x, y),
		)

		if err := saveWebP(final, outPath); err != nil {
			continue
		}

		fmt.Println("✓", filepath.Base(outPath))
	}

	fmt.Println("图片处理完成")

	return nil
}

// 根据产品编码获取图片
func GetProductImageByCode(code string) string {

	code = SafeFileName(code)

	if code == "" {
		return DefaultImage
	}

	filename := code + ".webp"

	if FileExists(filepath.Join(OutputDir, filename)) {
		return "/images/" + filename
	}

	return DefaultImage
}
