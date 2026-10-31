#!/usr/bin/env bash
set -e

# WOLF Outdoor Batangas City - AWS S3 & CloudFront Deployment Script
# Usage:
#   ./scripts/deploy-aws.sh <s3-bucket-name> [cloudfront-distribution-id]
# Or set environment variables:
#   export S3_BUCKET="wolf-outdoor-batangas"
#   export CLOUDFRONT_DIST_ID="E12345EXAMPLE"
#   ./scripts/deploy-aws.sh

BUCKET="${1:-$S3_BUCKET}"
DIST_ID="${2:-$CLOUDFRONT_DIST_ID}"

echo "=========================================================="
echo "  WOLF Outdoor Batangas City - AWS Deployment Pipeline   "
echo "=========================================================="

if [ -z "$BUCKET" ]; then
  echo "Error: Target AWS S3 Bucket not specified."
  echo "Usage: ./scripts/deploy-aws.sh <s3-bucket-name> [cloudfront-distribution-id]"
  echo "Or set: export S3_BUCKET=\"your-bucket-name\""
  exit 1
fi

if ! command -v aws &> /dev/null; then
  echo "Error: AWS CLI is not installed or not in PATH."
  echo "Please install AWS CLI and configure credentials via 'aws configure'."
  exit 1
fi

echo "==> Step 1: Running type checks & building production bundle..."
npm run build

echo "==> Step 2: Uploading hashed static assets with 1-year immutable cache..."
aws s3 sync dist/assets "s3://${BUCKET}/assets" \
  --delete \
  --cache-control "public, max-age=31536000, immutable"

echo "==> Step 3: Uploading remaining static files (HTML, favicon, robots.txt) with no-cache..."
aws s3 sync dist/ "s3://${BUCKET}" \
  --exclude "assets/*" \
  --delete \
  --cache-control "public, max-age=0, must-revalidate"

echo "==> S3 Sync completed successfully to s3://${BUCKET}."

if [ -n "$DIST_ID" ]; then
  echo "==> Step 4: Invalidating CloudFront edge cache for distribution: ${DIST_ID}..."
  aws cloudfront create-invalidation \
    --distribution-id "$DIST_ID" \
    --paths "/*"
  echo "==> CloudFront invalidation requested successfully."
fi

echo "=========================================================="
echo "  Deployment Complete! WOLF Outdoor is live on AWS.      "
echo "=========================================================="
