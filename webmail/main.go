package main

import (
	"flag"
	"fmt"
	"runtime"

	"webmail/api"
	"webmail/app"

	"github.com/sirupsen/logrus"
)

//go:generate sh -c "go run github.com/mjibson/esc -o vfs/static.go -prefix='static/' -pkg vfs static"

func main() {

	//parse Config
	cfg, err := app.ParseConfig(app.ConfigFile)
	if err != nil {
		panic(err)
	}

	//write back config with all values
	err = cfg.Save()
	if err != nil {
		panic(err)
	}

	var version bool
	var help bool
	var debug bool

	flag.BoolVar(&debug, "debug", false, "enable debug log")
	flag.BoolVar(&version, "version", false, "Show version")
	flag.BoolVar(&help, "help", false, "Show help and usage")
	flag.Parse()

	if help {
		flag.PrintDefaults()
		return
	}

	if version {
		fmt.Print("Webmail version: ")
		fmt.Println(app.Version)
		fmt.Print("OS: ")
		fmt.Println(runtime.GOOS)
		fmt.Print("Architecture: ")
		fmt.Println(runtime.GOARCH)
		return
	}

	if debug {
		logrus.SetLevel(logrus.DebugLevel)
	} else {
		logrus.SetLevel(logrus.InfoLevel)
	}

	ctx := app.Setup(cfg)

	api.Serve(ctx)
}
