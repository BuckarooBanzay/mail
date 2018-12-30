
TAG=registry.rudin.io/x86/minetest-webmail

build:
	docker build . -t $(TAG)

push:
	docker push $(TAG)


bundle:
	go get -u github.com/mjibson/esc
	${HOME}/go/bin/esc -o static.go -prefix="static/" static
