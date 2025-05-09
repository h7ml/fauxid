export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const nextUrl = url.pathname + url.search;

      // 获取静态资源
      if (/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf|eot)$/.test(url.pathname)) {
        return env.ASSETS.fetch(request);
      }

      // 服务器渲染请求
      return env.NEXT_SERVER.fetch(new Request(nextUrl, request));
    } catch (err) {
      return new Response(err.stack || err, { status: 500 });
    }
  }
}; 
