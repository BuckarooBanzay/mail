#!/bin/bash

# setup
unset use_proxy
unset http_proxy
unset https_proxy
unset HTTP_PROXY
unset HTTPS_PROXY

# build
docker build . -t mail

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

# configure minetest
CFG=/tmp/minetest.conf
MTDIR=/tmp/mt
WORLDDIR=${MTDIR}/worlds/world

cat <<EOF > ${CFG}
 secure.http_mods = mail
 webmail.url = 127.0.0.1:8080
 webmail.key = myserverkey
EOF

mkdir -p ${WORLDDIR}
chmod 777 ${MTDIR} -R

# start minetest with mail mod
docker run --rm --name minetest \
	-v ${CFG}:/etc/minetest/minetest.conf:ro \
	-v ${MTDIR}:/var/lib/minetest/.minetest \
  -v $(pwd)/mail_mod:/var/lib/minetest/.minetest/worlds/world/worldmods/mail \
  -v $(pwd)/test_mod:/var/lib/minetest/.minetest/worlds/world/worldmods/mail_test \
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
sleep 10

# Execute calls agains mail-server
# https://jwt.io/
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJkc3QiLCJpYXQiOjE1MTYyMzkwMjJ9.7ik564LuatEhOFapNWIqSlYcST41cgmHGAuTnAowTu8"

curl -v -H "Authorization: ${TOKEN}" "http://127.0.0.1:8080/api/inbox"

echo "Test complete!"
