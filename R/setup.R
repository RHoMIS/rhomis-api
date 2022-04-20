cran_packages_to_install <- c("optparse", "tibble", "dplyr", "readr")
github_packages_to_install <- c("l-gorman/rhomis-R-package")

installed_packages <- utils::installed.packages()[, 1]
if ("devtools" %in% installed_packages == F) {
    install.packages("devtools")
}

for (cran_package in cran_packages_to_install) {
    if (cran_package %in% installed_packages == F) {
        install.packages(cran_package)
    }
}

devtools::install_github(github_packages_to_install, force = T)