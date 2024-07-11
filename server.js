const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const Router = require('koa-router');

const app = new Koa();
const router = new Router;


app.use(koaBody({
  urlencoded: true,
  multipart: true,
}));

app.use((ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});



router.get("/data", async (ctx) => {
  console.log("запрос /data");
  ctx.response.body = JSON.stringify({ status: "ok" });
});
router.get("/error", async (ctx) => {
  ctx.response.status = 500;
  ctx.response.body = JSON.stringify({ status: "Internal Error" });
  console.log("запрос /error");
});
router.get("/loading", async (ctx) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 5000);
  });
  ctx.response.body = JSON.stringify({ status: "ok" });
  console.log("запрос /error");
});


app.use(router.routes())

const server = http.createServer(app.callback());
const port = 7071;
server.listen(port, (err) => {
    if (err) {
      console.log(err);
      return;
    }
  console.log('Server is listening to ' + port);
});