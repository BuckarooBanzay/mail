import routes from './routes.js';
import Nav from './nav.js';

m.route(document.getElementById("app"), "/login", routes);
m.mount(document.getElementById("nav"), Nav);
