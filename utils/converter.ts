
/**
 * Converts a PNG file into a multi-resolution ICO Blob.
 * This function creates an ICO file containing multiple versions of the source image
 * based on the provided sizes, preserving transparency.
 *
 * @param pngFile The source PNG file.
 * @param sizes An array of numbers representing the desired dimensions (e.g., [16, 32, 64]).
 * @returns A promise that resolves to a Blob in 'image/x-icon' format.
 */
export async function convertPngToIco(pngFile: File, sizes: number[]): Promise<Blob> {
  const imageEntries: { data: ArrayBuffer; width: number; height: number }[] = [];

  const image = new Image();
  const objectUrl = URL.createObjectURL(pngFile);
  
  // Load the image from the file object
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = (err) => reject(err);
    image.src = objectUrl;
  });
  URL.revokeObjectURL(objectUrl);

  // Generate PNG data for each required size
  for (const size of sizes) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get 2D context from canvas.');
    }
    
    // Clear canvas and draw the resized image
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(image, 0, 0, size, size);

    const pngBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!pngBlob) {
      throw new Error(`Failed to create PNG blob for size ${size}x${size}.`);
    }

    const data = await pngBlob.arrayBuffer();
    imageEntries.push({ data, width: size, height: size });
  }

  // ICO file structure constants
  const imageCount = imageEntries.length;
  const headerSize = 6;
  const directoryEntrySize = 16;
  const directorySize = headerSize + imageCount * directoryEntrySize;

  // Calculate total file size
  const totalFileSize = directorySize + imageEntries.reduce((acc, entry) => acc + entry.data.byteLength, 0);

  const buffer = new ArrayBuffer(totalFileSize);
  const view = new DataView(buffer);

  // ICONDIR Header (6 bytes)
  view.setUint16(0, 0, true); // Reserved, must be 0
  view.setUint16(2, 1, true); // Type, 1 for ICO
  view.setUint16(4, imageCount, true); // Number of images

  let dataOffset = directorySize;

  // ICONDIRENTRY for each image (16 bytes each)
  for (let i = 0; i < imageCount; i++) {
    const entry = imageEntries[i];
    const entryOffset = headerSize + i * directoryEntrySize;
    
    // For ICO format, 256 pixels is represented by 0.
    const width = entry.width >= 256 ? 0 : entry.width;
    const height = entry.height >= 256 ? 0 : entry.height;

    view.setUint8(entryOffset + 0, width); // Image width
    view.setUint8(entryOffset + 1, height); // Image height
    view.setUint8(entryOffset + 2, 0); // Color Palette count (0 for true color)
    view.setUint8(entryOffset + 3, 0); // Reserved
    view.setUint16(entryOffset + 4, 1, true); // Color Planes
    view.setUint16(entryOffset + 6, 32, true); // Bits Per Pixel (32 for RGBA)
    view.setUint32(entryOffset + 8, entry.data.byteLength, true); // Size of image data in bytes
    view.setUint32(entryOffset + 12, dataOffset, true); // Offset of image data from start of file

    // Copy the actual PNG image data into the buffer
    const imageData = new Uint8Array(entry.data);
    const bufferView = new Uint8Array(buffer, dataOffset);
    bufferView.set(imageData);

    dataOffset += entry.data.byteLength;
  }

  return new Blob([buffer], { type: 'image/x-icon' });
}