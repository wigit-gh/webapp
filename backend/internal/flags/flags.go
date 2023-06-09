package flags

import (
	"flag"
	"fmt"
	"os"

	"github.com/wigit-ng/webapp/backend/internal/logger"
)

// usage prints out a usage message when wrong flags or values are passed to the program.
func usage() {
	fmt.Fprintf(os.Stderr, `
This executable runs the WIG!T Web Application backend.

Usage:

  wwapp_be [flags] [arguments]

Supported flags are:

`[1:])
	flag.PrintDefaults()
	os.Exit(1)
}

// Parse sets up the flags for the build executable.
func Parse() (string, *os.File) {
	// use our usage function to display usage message if any error occurs during parsing.
	flag.Usage = usage

	// set the expected flags and default value.
	env := flag.String("env", "dev", `Specifies the run environment. Value is either "dev" or "prod"`)

	// Parse all command line flags.
	flag.Parse()

	// Configure global logger with specified environment.
	logFile := logger.ConfigureLogger(*env)
	if *env == "prod" && logFile != nil {
		logger.SetGinLogToFile(logFile)
	}

	return *env, logFile
}
