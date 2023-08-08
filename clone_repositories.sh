
#!/bin/bash

# Define an array of repository names
repositories=(
    "fretrontraining"
    "Basic-Crud-Application"
)


# Function to clone a repository and update submodules
clone_repository() {
  repo_name=$1
  git clone "git@github.com:AtulBhatia659/$repo_name.git"
  cd "$repo_name"
  git submodule update --init
  cd ..
}

# Loop through the array and clone repositories with submodule update
for repo in "${repositories[@]}"; do
  clone_repository "$repo"
done
