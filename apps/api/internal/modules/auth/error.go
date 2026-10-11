package auth

import "errors"

var (
	ErrEmailExists = errors.New("email already exists")

	ErrInvalidCredentials = errors.New(
		"email hoặc mật khẩu không chính xác",
	)
)
