# Change Log

All notable changes to the "templator" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [0.3.2] - 01-03-21, Skipping picking

- add skipping picking template if there is only one
- add an error message if there are no templates found

## [0.3.1] - 01-03-21, The Renamer

BREAKING CHANGES:

- renamed `snipsnap-templator` folder to `templates`
- renamed `.snipsnap-templator.config.json` to `.snipsnap.json`
- renamed `Run Templator` to `Create from Template`
- renamed extension to `Snipsnap Templates`
- renamed `variableName` in `prompts` to `variable`

## [0.3.0] - 26-02-21, Monk

BREAKING CHANGES:

- templates folder changes from .vscode/snipsnap/templates to .vscode/snipsnap-templator
- files now should lay right in the root of template folder, no need to create one more "template" folder inside template folder :smile:

## [0.2.0] - 16-02-21, One Patch Man

- added support for deeply nested template structures

Basic local flow is on track! :tada:

## [0.1.3] - 16-02-21, Beggar

- added user-defined prompts

## [0.1.2] - 16-02-21, Mustache power

- added Mustache lib for handling prompts
- reorganized extensions structure
- some @TODO notes

## [0.1.1] - 12-02-21, Take care

- added basic error handlers
- improved user prompts UX

## [0.1.0] - 12-02-21, Aquadisco

- Added core functionality

## [0.0.1] - 12-02-21, So it begins

- Boilerplate
