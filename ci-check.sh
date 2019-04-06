#!/bin/sh

# Copyright 2019, Chaitanya Prakash N <chaitanyaprakash.n@gmail.com>
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
set -e

DIR_TO_MONITOR="df-webhook"
NUM_CHANGES=`git diff --name-only master...${TRAVIS_COMMIT} | grep -v *.md | cut -d '/' -f 1 | grep $DIR_TO_MONITOR | wc -l`

if [[ $NUM_CHANGES -eq 1 ]]
then
  echo "$DIR_TO_MONITOR changed. Continuing with the CI process."
else
  echo "No changes detected in $DIR_TO_MONITOR. Aborting CI."
  travis_terminate 0
fi
