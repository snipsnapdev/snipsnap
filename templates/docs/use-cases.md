### Kubernetes

Optimize the routine you usually have when you copy-pasting yaml files of deployments/pods/certificate etc. from project to project. Create flexible templates that you can recreate easily with a matter of clicks.

For example you can create a `{{toKebabCase appName}}.yaml` file with the following content for your deployment
```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{toKebabCase appName}}-deployment
  labels:
    app: {{toKebabCase appName}}
spec:
  replicas: 3
  selector:
    matchLabels:
      app: {{toKebabCase appName}}
  template:
    metadata:
      labels:
        app: {{toKebabCase appName}}
    spec:
      containers:
      - name: {{toKebabCase appName}}
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```
Then set a user prompt as `appName` in Cloud UI and you ready to use it.

### CI/CD

Github Actions, Drone CI, Circle CI, Gitlab all use YAML files to define your build process. It could be very annoying to copy and paste those YAML files from one microservice to another and then there is a big chance of errors if you forget to rename some important parts. Instead, create a template(s).Example:

``.drone.yml``
```yaml
kind: pipeline
name: default

steps:
  - name: build
    image: plugins/docker
    settings:
      repo: registry.example.com/{{toKebabCase appName}}-prod
      registry: registry.example.com
      username:
        from_secret: docker_username
      password:
        from_secret: docker_password
      build_args:
        - NODE_ENV=production
    when:
      branch: master
      event: push

  - name: deploy
    image: peloton/drone-k8s-deployment
    settings:
      insecure: false
      deployment_names: {{toKebabCase appName}}-prod
      container_names: {{toKebabCase appName}}-prod
      namespaces: {{toKebabCase appName}}-prod
      docker_image: registry.pixelpoint.io/snipsnap-api-prod:latest
      date_label: deployment.drone.io/date-deployed
      url:
        from_secret: kubernetes_url
      token:
        from_secret: kubernetes_token
    when:
      branch: master
      event: push

```

Add ``appName`` as a prompt in Cloud UI and you good to go. Next time you will try to create that template user will be asked to type App Name that will be automatically inserted in the kebab-case to a generated drone.yaml file

### Docker 

Despite Docker syntax is simple, you probably always start a new project set up by copying Dockerfiles from previously created based on best practices configurations and the fact that it worked previously. Also you could have different versions of Dockerfiles per environemnt like Dockerfile.test, Dockerfile.prod, [Dockerfile.dev](http://dockerfile.dev). As well as you can have docker-compose file with a generic configuration and services such as postgres/ or redis. Snipsnap could wrap all of those files as a template, ask for user prompts and replace variables defined in handlebars template with user's input.

### React

If you use React, you often need to create a separate CSS file for each component. But also there some popular folder structures that recommend you to create a separate folder for each component, then create index.js, Component.js, Component.css files. It's boring and it's routine. Using Snipsnap you can create all of those folder/files as a template, use user prompts, and case conversion helpers in order to recreate the same file structures with some changes over and over again.

### Vue

Create a template for your Vue components with default `<template>`, `<script>`, `<style>` sections. Add user prompts to this to automaticaly fill all information. Share it with the team and keep the structure consistent from file to file.

### Graphql

Common graphql server folder structure propose to have multiple files per domain. Like this:
```
├── package.json
└── src
    ├── books
    │   ├── Book.js
    │   ├── data.js
    │   ├── index.js
    │   ├── resolvers.js
    │   └── typeDef.js
    └── index.js
```
All files inside books folder at the beginning will have some generic boilerplate structure. Create it as a template and recreate the folder and all files just with one click.

### Webinars

Snipsnap Templates could help you run webinars or workshops. Prepare in advance all boilerplate code that you will showcase, and then easily recreate it with a single click from your extension.
Focus your listeners on important stuff instead of spending time typping boilerplate code and creating manually files. After webinar you can share some of those code templates with your audience so they can easily go over the same steps.

### Node.js
When you do some REST service with Express or Koa you have to create manually files for different endpoints with some boilerplate code, often you also break down it by folders and add test files. Wrap it with Code Template and save time recreating similar constructions in the future.

### Tailwind
If you move some tailwind components from one project to another, wrap it as a template, or add Tailwin UI components as templates that you can easily recreate from extension.

### Starters
You can add a lot of different folders and files to every Code Template within Snipsnap. If you have some starters for new plugin or extension for your popular framework, you can use Snipsnap to avoid recreating all those file structure over and over again.
