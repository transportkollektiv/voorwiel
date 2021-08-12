# voorwiel

frontend application for [cykel](https://github.com/stadtulm/cykel) - view, login and rent bikes


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference for Vue](https://cli.vuejs.org/config/) and the configuration files at `config/`. The used configuration is set at build time by using `NODE_ENV=production` (or `development`, `staging`).  
For staging and production you may also set `NPM_CONFIG_PRODUCTION=true`.

### Using Docker
```
docker build --build-arg environment=production -t voorwiel .
docker run -p 8080:80 voorwiel
```
You may create a config file as described above with an environment of your choice (e.g. config/config.myenv.js) and provide the environment to the docker build as described.

### Serving
voorwiel is a single page application with client site routing. Because of this, your webserver also needs to serve `index.html` on URLs that normally 404. 

For nginx, you could do this with:
```
location / {
    try_files $uri $uri/ /index.html;
}
```
