package app

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"sync"
)

var lock sync.Mutex

const ConfigFile = "webmail.json"

type Config struct {
	ConfigVersion int    `json:"configversion"`
	Port          int    `json:"port"`
	SecretKey     string `json:"secretkey"`
	Webdev        bool   `json:"webdev"`
}

func ParseConfig(filename string) (*Config, error) {

	cfg := Config{
		ConfigVersion: 1,
		Port:          8080,
		SecretKey:     RandStringRunes(16),
		Webdev:        false,
	}

	info, err := os.Stat(filename)
	if info != nil && err == nil {
		data, err := ioutil.ReadFile(filename)
		if err != nil {
			return nil, err
		}

		err = json.Unmarshal(data, &cfg)
		if err != nil {
			return nil, err
		}
	}

	return &cfg, nil
}

func (cfg *Config) Save() error {
	return WriteConfig(ConfigFile, cfg)
}

func WriteConfig(filename string, cfg *Config) error {
	lock.Lock()
	defer lock.Unlock()

	f, err := os.Create(filename)
	if err != nil {
		return err
	}

	defer f.Close()

	str, err := json.MarshalIndent(cfg, "", "	")
	if err != nil {
		return err
	}

	f.Write(str)

	return nil
}
