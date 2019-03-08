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