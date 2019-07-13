#!/bin/bash

# NOTE: removing +x mode can reveal credentials in circleci logs
set +x
set -eo pipefail

cp -a artifacts/*crx .
cp -a artifacts/*xpi .
#npm run test-e2e-${BROWSER}
npm run test-by-feature-chrome features/yoroi-transfer.feature
mv screenshots screenshots-${BROWSER}
mkdir screenshots
mv screenshots-${BROWSER} screenshots/${BROWSER}
