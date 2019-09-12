#!/bin/bash

# NOTE: removing +x mode can reveal credentials in circleci logs
set +x
set -eo pipefail

GITHUB_PAT="${GITHUB_PAT}"
REPO_SLUG="${CIRCLE_PROJECT_REPONAME}"
PR_NUMBER="${CIRCLE_PR_NUMBER}"
PR_BASE_BRANCH="${CIRCLE_PR_BASE_BRANCH}"
BRANCH="${CIRCLE_BRANCH}"

export AWS_ACCESS_KEY_ID="${ARTIFACTS_KEY}"
export AWS_SECRET_ACCESS_KEY="${ARTIFACTS_SECRET}"
export AWS_REGION="${ARTIFACTS_REGION}"
S3_BUCKET="${ARTIFACTS_BUCKET}"
S3_ENDPOINT="https://${S3_BUCKET}.s3.amazonaws.com"

if [ ! -z "${PR_NUMBER}" ]
then
  OBJECT_KEY_BASEPATH="artifacts/${browser}/${PR_NUMBER}-${GIT_SHORT_COMMIT}"
else
  OBJECT_KEY_BASEPATH="artifacts/${browser}/${BRANCH}"
fi

aws s3 sync --only-show-errors artifacts "s3://${S3_BUCKET}/${OBJECT_KEY_BASEPATH}"

#echo "TODO: release on GH releases page"
