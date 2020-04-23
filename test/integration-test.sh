#!/bin/bash

# prerequisites
jq --version || exit 1
curl --version || exit 1

# ensure proper current directory
CWD=$(dirname $0)
cd ${CWD}

# setup
unset use_proxy
unset http_proxy
unset https_proxy
unset HTTP_PROXY
unset HTTPS_PROXY

# build
docker build .. -t mail

# run mail-server
docker run --name mail --rm \
 -e WEBMAILKEY=myserverkey \
 -e WEBMAIL_DEBUG=true \
 --network host \
 mail &

# wait for startup
bash -c 'while !</dev/tcp/localhost/8080; do sleep 1; done;'

# clone mod-part
git clone https://github.com/minetest-mail/mail_mod.git

# start minetest with mail mod
docker run --rm --name minetest \
  -u root:root \
	-v $(pwd)/minetest.conf:/etc/minetest/minetest.conf:ro \
  -v $(pwd)/world.mt:/root/.minetest/worlds/world/world.mt \
  -v $(pwd)/auth.sqlite:/root/.minetest/worlds/world/auth.sqlite \
  -v $(pwd)/mail_mod:/root/.minetest/worlds/world/worldmods/mail \
  -v $(pwd)/test_mod:/root/.minetest/worlds/world/worldmods/mail_test \
  -e use_proxy=false \
  -e http_proxy= \
  -e HTTP_PROXY= \
  --network host \
	registry.gitlab.com/minetest/minetest/server:5.2.0 &

# prepare cleanup
function cleanup {
	# cleanup
	docker stop mail
  docker stop minetest
}

trap cleanup EXIT

# wait for startup
sleep 2

# Execute calls agains mail-server

LOGIN_DATA='{"username":"test","password":"enter"}'
RES=$(curl --data "${LOGIN_DATA}" -H "Content-Type: application/json" "http://127.0.0.1:8080/api/login")
echo Login response: $RES
SUCCESS=$(echo $RES | jq -r .success)

test "$SUCCESS" == "true" || exit 1

TOKEN=$(echo $RES | jq -r .token)

echo "Test complete!"
