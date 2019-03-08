workflow "Run Tests" {
  on = "push"
  resolves = ["Format", "Lint", "Test", "Build"]
}

action "Install" {
  uses = "actions/npm@master"
  runs = "yarn"
}

action "Format" {
  uses = "actions/npm@master"
  needs = "Install"
  runs = "yarn format"
}

action "Lint" {
  uses = "actions/npm@master"
  needs = "Install"
  runs = "yarn lint"
}

action "Test" {
  uses = "actions/npm@master"
  needs = "Install"
  runs = "yarn test"
}

action "Build" {
  uses = "actions/npm@master"
  needs = "Install"
  runs = "yarn build"
}

workflow "Publish to NPM" {
  on = "repository_dispatch"
  resolves = ["Publish"]
}

action "Filter Publish Action" {
  uses = "actions/bin/filter@master"
  args = "action publish"
}

action "Publish Install" {
  uses = "actions/npm@master"
  needs = ["Filter Publish Action"]
  runs = "yarn"
}

action "Publish Test" {
  uses = "actions/npm@master"
  needs = ["Publish Install"]
  runs = "yarn test"
}

action "Publish" {
  uses = "actions/npm@master"
  needs = ["Publish Test"]
  runs = "yarn publish"
  secrets = ["NPM_AUTH_TOKEN"]
}
