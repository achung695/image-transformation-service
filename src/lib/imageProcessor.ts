import sharp from 'sharp';

export async function removeBackground(buffer: Buffer): Promise<Buffer> {
  const jpegBuffer = await sharp(buffer).jpeg().toBuffer();
  
  const blob = new Blob([Buffer.from(jpegBuffer).buffer as ArrayBuffer], { type: 'image/jpeg' });
  const formData = new FormData();
  formData.append('image_file', blob, 'image.jpg');
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

export async function processImage(inputBuffer: Buffer): Promise<Buffer> {
  const noBgBuffer = await removeBackground(inputBuffer);
  const flippedBuffer = await flipHorizontal(noBgBuffer);
  return flippedBuffer;
}
