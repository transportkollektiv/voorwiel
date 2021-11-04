# voorwiel

frontend application for [cykel](https://github.com/transportkollektiv/cykel) - view, login and rent bikes


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

### Serving
voorwiel is a single page application with client site routing. Because of this, your webserver also needs to serve `index.html` on URLs that normally 404. 

For nginx, you could do this with:
```
location / {
    try_files $uri $uri/ /index.html;
}
```
