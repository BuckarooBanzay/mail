#!/bin/bash

# build
docker build . -t mail

docker run --name mail --rm \
 -e WEBMAILKEY=myserverkey \
 -e WEBMAIL_DEBUG=true \
 --network host \
 mail &

function cleanup {
	# cleanup
	docker stop mail
}

trap cleanup EXIT

bash -c 'while !</dev/tcp/localhost/8080; do sleep 1; done;'

git clone https://github.com/minetest-mail/mail_mod.git

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
docker run --rm -i \
	-v ${CFG}:/etc/minetest/minetest.conf:ro \
	-v ${MTDIR}:/var/lib/minetest/.minetest \
  -v $(pwd)/mail_mod:/var/lib/minetest/.minetest/worlds/world/worldmods/mail \
  -v $(pwd)/test_mod:/var/lib/minetest/.minetest/worlds/world/worldmods/mail_test \
  --network host \
	registry.gitlab.com/minetest/minetest/server:5.2.0

test -f ${WORLDDIR}/integration_test.json && exit 0 || exit 1


echo "Test complete!"
