package lib

import "strconv"

func FormatUserID(userID int64) string {
	return strconv.FormatInt(userID, 10)
}
