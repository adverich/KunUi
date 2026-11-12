import { createApp } from 'vue'
import './styles/style.css'
import App from './App.vue'
import router from './plugins/router'
import { kunTheme } from './theme/kunTheme.js'

// El playground no usa `app.use(KunUI)`; reponemos el theme persistido a mano
// (en una app consumidora esto lo hace `install`).
kunTheme.restore()

createApp(App)
    .use(router)
    .mount('#app')
