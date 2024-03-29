#!/bin/env Rscript
# Quick how-to  -----------------------------------------------------------


#' This is a script to run calculations on a server for RHoMIS 2.0. The script can be run in
#' two ways, you can run the script interactively (e.g. from Rstudio). Or you can run the
#' script from the command line. If running from the command line you will need to
#' enter the command:
#'
#' "Rscript path/to/file.R --arg1 firstargument --arg2 second argument ..."
#'
#' If you would like guidance on how to run this script from the command line, please
#' enter:
#'
#' "Rscript path/to/file.R --help"
#'
#' Some short documentation will appear, showing which arguments need to be passed and providing
#' a brief description. In both cases, "path/to/file.R" must reflect where the file is
#' located on your system


####################################################################################################################
####################################################################################################################
####################################################################################################################
####################################################################################################################
####################################################################################################################
# SETUP
####################################################################################################################
###################################################################################################################
####################################################################################################################
####################################################################################################################
####################################################################################################################

# Setup for interactive script running  -------------------------------------------------------------------

# Checking if R running from GUI
# if (interactive()) {
#   #renv::load()
#   # Loading environment variables
#
#   # Setting options for script run interactively.
#   # These should be set manually if you are running the script interactively
#
#   opt <- list()
#   opt$status <- "finalized"
#   opt$commandType <- "prices"
#   opt$projectName <- "second project 20th april"
#   opt$formName <- "test-form-1"
#   opt$dataBase <- "rhomis-data-dev"
#   opt$formVersion <- "version-xyz"
#   opt$numberOfResponses <- FALSE
#   opt$centralURL <- "https://central.rhomis.cgiar.org"
#   opt$centralEmail <- rstudioapi::askForPassword("User Email")
#   opt$centralPassword <- rstudioapi::askForPassword("User Password")
# }

# Setup for running from command line -------------------------------------
# Checking if script has been run from the command line
if (!interactive()) {
  # Directory setup in the .Rprofile
  # Identifying the file path to this script

  # Arguments passed to the script
  initial_options <- commandArgs(trailingOnly = FALSE)
  file_option <- initial_options[grep("--file", initial_options)]
  file_option <- gsub("--file=", "", file_option, fixed = T)

  project_path <- gsub("R/main.R", "", file_option, fixed = T)

  # Making sure scripts can deal with running from within the project directory
  if (grepl("home/", project_path == F) | project_path == "") {
    project_path <- paste0("./", project_path)
  }

  #' Ensures that all warnings are
  #' send to stdout rather than stderr
  sink(stdout(), type = "message")

  # Loading virtual environment
  # loading .env file

  library(optparse, warn.conflicts = F)
  #' Setting up options for calling this script from
  #' the terminal or the command line

  option_list <- list(
    optparse::make_option(
      opt_str = c("--commandType"),
      help = "The type of command you would like to execute",
    ),
    optparse::make_option(
      opt_str = c("--projectName"),
      help = "The name for the project you would like to process on ODK central",
    ),
    optparse::make_option(
      opt_str = c("--formName"),
      help = "The name of the form you would like to process on ODK central",
    ),
    optparse::make_option(
      opt_str = c("--formVersion"),
      help = "The version of the form you would like to process on ODK central",
    ),
    optparse::make_option(
      opt_str = c("--status"),
      help = 'Whether or not a form is in its "draft" or "finalized" state',
    ),
    optparse::make_option(
      opt_str = c("--dataBase"),
      help = "The database you would like to write to",
    ),
    optparse::make_option(
      opt_str = c("--numberOfResponses"),
      help = "The number of responses you would like to generate and submit to ODK central",
    ),
    optparse::make_option(
      opt_str = c("--centralURL"),
      help = "The URL of the ODK central server",
    ),
    optparse::make_option(
      opt_str = c("--centralEmail"),
      help = "Your ODK central email",
    ),
    optparse::make_option(
      opt_str = c("--centralPassword"),
      help = "Your ODK central password",
    )
  )

  # Extracting arguments
  opt_parser <- optparse::OptionParser(option_list = option_list)
  opt <- optparse::parse_args(opt_parser)

  if (length(opt) == 0) {
    optparse::print_help(opt_parser)
    stop("At least one argument must be supplied (input file)\n", call. = FALSE)
  }
}

####################################################################################################################
####################################################################################################################
####################################################################################################################
####################################################################################################################
####################################################################################################################
# EXECUTE SCRIPTS
####################################################################################################################
####################################################################################################################
####################################################################################################################
####################################################################################################################
####################################################################################################################
library(rhomis, warn.conflicts = F)
#print(opt)
# Getting the necessary functions
# source("./R/testRun.R")




if (opt$commandType == "test") {
  print("Running test")
  quit()
}

if (opt$status == "draft") {
  draft <- T
}

if (opt$status == "finalized") {
  draft <- F
}


if (opt$commandType == "raw-data") {
  tryCatch(

  # There should be an intermediate stage here where the prices
  # Are verified, but for demo purposes skipping.
    {
      invisible(


        extract_raw_data_server(
                central_url = opt$centralURL,
                central_email = opt$centralEmail,
                central_password = opt$centralPassword,
                project_name = opt$projectName,
                form_name = opt$formName,
                database = opt$dataBase,
                isDraft = draft
            ))

        write(warnings(), stdout())

    },error=function(err){
        print(err)
        write("failure", stdout())
    }

  )

}


if (opt$commandType == "units") {
  tryCatch(

  # There should be an intermediate stage here where the prices
  # Are verified, but for demo purposes skipping.
    {
      invisible(


        extract_units_and_conversions_server(
                central_url = opt$centralURL,
                central_email = opt$centralEmail,
                central_password = opt$centralPassword,
                project_name = opt$projectName,
                form_name = opt$formName,
                database = opt$dataBase,
                isDraft = draft
            ))

        write(warnings(), stdout())

    },error=function(err){
        print(err)
        write("failure", stdout())
    }

  )

}


if (opt$commandType == "prices") {

  tryCatch(

  # There should be an intermediate stage here where the prices
  # Are verified, but for demo purposes skipping.
    {


    invisible(
    calculate_prices_server(
                central_url = opt$centralURL,
                central_email = opt$centralEmail,
                central_password = opt$centralPassword,
                project_name = opt$projectName,
                form_name = opt$formName,
                database = opt$dataBase,
                isDraft = draft
            )
  )
  write(warnings(), stdout())

    },error=function(cond){

        write("failure:<br/>", stderr())
        stop(cond)
    }

  )



  }







if (opt$commandType == "indicators") {
   tryCatch(
  # There should be an intermediate stage here where the prices
  # Are verified, but for demo purposes skipping.
    {
      invisible(
        calculate_indicators_server(
                central_url = opt$centralURL,
                central_email = opt$centralEmail,
                central_password = opt$centralPassword,
                project_name = opt$projectName,
                form_name = opt$formName,
                database = opt$dataBase,
                isDraft = draft
            ))
        # write("success", stdout())


    },error=function(cond){
        write("failure", stdout())
    }

  )
}



if (opt$commandType == "generate") {

   tryCatch(

  # There should be an intermediate stage here where the prices
  # Are verified, but for demo purposes skipping.
    {
      invisible(generateData(
        central_url = opt$centralURL,
        central_email = opt$centralEmail,
        central_password = opt$centralPassword,
        project_name = opt$projectName,
        form_name = opt$formName,
        number_of_responses = opt$numberOfResponses,
        isDraft = draft
      ))
        write("success", stdout())

    },error=function(cond){
        write("failure", stdout())
    }

  )

}
