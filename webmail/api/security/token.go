package security

import (
	"github.com/gbrlsnchs/jwt/v3"
)

type Token struct {
	jwt.Payload
	Username string `json:"username"`
}
