import sharp from 'sharp';

export async function removeBackground(buffer: Buffer, mimeType: string): Promise<Buffer> {
  const { FormData, Blob } = await import('node:buffer').then(() => globalThis);

  const blob = new Blob([buffer], { type: mimeType });
  const formData = new FormData();
  formData.append('image_file', blob, 'image.png');
  formData.append('size', 'auto');

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: {
      'X-Api-Key': process.env.REMOVEBG_API_KEY!,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('remove.bg error response:', errorText);
    throw new Error(`remove.bg API error: ${response.status} - ${errorText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function flipHorizontal(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer).flop().png().toBuffer();
}

export async function processImage(inputBuffer: Buffer, mimeType: string): Promise<Buffer> {
  const noBgBuffer = await removeBackground(inputBuffer, mimeType);
  const flippedBuffer = await flipHorizontal(noBgBuffer);
  return flippedBuffer;
}