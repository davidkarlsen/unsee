package store_test

import (
	"testing"

	"github.com/cloudflare/unsee/models"
	"github.com/cloudflare/unsee/store"
)

type silenceTest struct {
	silences  map[string]models.UnseeSilence
	silenceId string
	found     bool
}

var silenceTests = []silenceTest{
	silenceTest{
		silences: map[string]models.UnseeSilence{
			"1": models.UnseeSilence{},
		},
		silenceId: "1",
		found:     true,
	},
	silenceTest{
		silences: map[string]models.UnseeSilence{
			"1": models.UnseeSilence{},
			"2": models.UnseeSilence{},
			"3": models.UnseeSilence{},
		},
		silenceId: "2",
		found:     true,
	},
	silenceTest{
		silences:  map[string]models.UnseeSilence{},
		silenceId: "1",
		found:     false,
	},
	silenceTest{
		silences: map[string]models.UnseeSilence{
			"2": models.UnseeSilence{},
			"3": models.UnseeSilence{},
		},
		silenceId: "1",
		found:     false,
	},
}

func TestSilences(t *testing.T) {
	for _, testCase := range silenceTests {
		store.Store.SetSilences(testCase.silences)
		silence := store.Store.GetSilence(testCase.silenceId)
		found := silence != nil
		if found != testCase.found {
			t.Errorf("GetSilence('%s') returned %v, %v was expected", testCase.silenceId, found, testCase.found)
		}
	}
}
