import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export function getMediaUrl(key: string | null) {
  if (!key) return null;
  return `${process.env.NEXT_PUBLIC_APP_URL}/api/s3/media?key=${encodeURIComponent(key)}`;
}
