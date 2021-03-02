# Snipsnap Templates

## To Do

- [ ] Features
  - [ ] Backend integration
  - [ ] Make `message` in `prompts` optional with fallback message?
  - [ ] Default value for `variable` in prompts?
- [ ] Refactoring
  - [ ] move `getDirStructure` and `buildDirStructure` from `utils` since these functions are not utils, they are core functions
  - [ ] remove passing `onNameCopy` and `onContentCopy` to `getDirStructure` since they are the same now
  - [ ] move registration of helpers to separate file
  - [ ] handle all possible errors so extension wouldn't crash silently
  - [ ] move extension to TypeScript?
  - [ ] add test cases for all possible scenarios
  - [ ] move all possible values to constants, e.g. `prompts`, `prompts.message` and `prompts.variable`
- [ ] Flow
  - [ ] set up ESLint config
  - [ ] set up Prettier?
  - [ ] set up MarkdownLint?
  - [ ] set up Husky in order to run checks before creating a commit
  - [ ] set up Conventional Commits
  - [ ] set up Conventional Changelog
  - [ ] set up repository in order to:
    - [ ] get at least one approve in order to merge Pull Request
    - [ ] run checks (ESLint, Prettier, Jest, Coverage) for every Pull Request in order to merge Pull Request
    - [ ] prevent ability to push to master branch
    - [ ] show difference in bundle size in Pull Request?
- [ ] Update dependencies to latest versions?
