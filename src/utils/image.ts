import QRCode from 'qrcode';

/**
 * Image and Canvas Utilities
 */

export interface QRConfig {
  text: string;
  size: number;
  fgColor: string;
  bgColor: string;
  errorLevel: 'L' | 'M' | 'Q' | 'H';
  logoUrl?: string | null;
  logoSizePercent?: number;
}

/**
 * 生成二维码并渲染到指定的 Canvas 上
 */
export async function generateQRCode(canvas: HTMLCanvasElement, config: QRConfig): Promise<void> {
  if (!config.text) return;

  // 1. 生成基础二维码
  await QRCode.toCanvas(canvas, config.text, {
    width: config.size,
    margin: 2,
    color: {
      dark: config.fgColor,
      light: config.bgColor,
    },
    errorCorrectionLevel: config.errorLevel
  });

  const ctx = canvas.getContext('2d');
  if (ctx && config.logoUrl) {
    // 2. 加载并绘制 Logo
    const logoImg = new Image();
    logoImg.src = config.logoUrl;
    await new Promise((resolve) => {
      logoImg.onload = resolve;
      logoImg.onerror = resolve; // 防止加载失败阻塞
    });

    if (logoImg.complete && logoImg.naturalWidth > 0) {
      const logoSize = (config.size * (config.logoSizePercent || 20)) / 100;
      const logoPos = (config.size - logoSize) / 2;

      // 为 Logo 绘制白色背景边框
      ctx.fillStyle = config.bgColor;
      ctx.fillRect(logoPos - 2, logoPos - 2, logoSize + 4, logoSize + 4);

      ctx.drawImage(logoImg, logoPos, logoPos, logoSize, logoSize);
    }
  }
}

/**
 * 触发文件下载
 */
export function downloadDataUrl(dataUrl: string, fileName: string) {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = dataUrl;
  link.click();
}
