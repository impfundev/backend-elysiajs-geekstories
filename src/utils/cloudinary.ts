import { Cloudinary } from "@cloudinary/url-gen";
import { limitFill } from "@cloudinary/url-gen/actions/resize";
import { avif } from "@cloudinary/url-gen/qualifiers/format";
import { format } from "@cloudinary/url-gen/actions/delivery";

const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}`;

export const cloudinary_client = new Cloudinary({
  cloud: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  },
});

export function getPublicIdFromUrl(url: string): string | null {
  const regex = /upload\/(?:v\d+\/)?(.+)/;
  const match = url.match(regex);

  if (!match || match.length < 2) {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    const publicIdWithExtension = parts[1].split("?")[0];
    return publicIdWithExtension;
  }

  const publicIdWithExtension = match[1].split("?")[0];
  return publicIdWithExtension;
}

export function getTransformedUrl(
  publicId: string,
  width: number,
  height?: number
): string {
  let resizer = limitFill().width(width);
  if (height) resizer = resizer.height(height);
  return cloudinary_client
    .image(publicId)
    .resize(resizer)
    .delivery(format(avif()))
    .quality(60)
    .toURL();
}

export function proxyCloudinaryUrl(originalUrl: string): string {
  if (!originalUrl || !originalUrl.startsWith(CLOUDINARY_BASE_URL)) {
    return originalUrl;
  }
  return originalUrl.replace(CLOUDINARY_BASE_URL, "/cld-proxy");
}

export function getImageData(
  image: string | undefined,
  width: number,
  height?: number
) {
  let imageUrl: string | undefined;
  let imageSrcset: string | undefined;

  if (image) {
    const publicId = getPublicIdFromUrl(image);

    if (publicId) {
      const widths = [320, 480, 640, 768, 1024, 1280];
      imageSrcset = widths
        .map((w) => `${getTransformedUrl(publicId, w)} ${w}w`)
        .join(", ");
      imageUrl = getTransformedUrl(publicId, width, height);
    } else {
      imageUrl = image;
    }

    imageUrl = proxyCloudinaryUrl(imageUrl);
  }

  return {
    imageUrl,
    imageSrcset,
  };
}
