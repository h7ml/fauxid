export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);
      const path = url.pathname;

      // 映射路径到静态资源
      let assetPath = path;

      // 处理根路径，返回index.html
      if (path === '/' || path === '') {
        assetPath = '/index.html';
      }
      // 如果路径没有扩展名且不是静态资源，假定它是一个路由，返回相应的HTML
      else if (!path.includes('.') && !path.startsWith('/_next/')) {
        assetPath = `${path}.html`;
        // 如果路径末尾有/，则返回index.html
        if (path.endsWith('/')) {
          assetPath = `${path}index.html`;
        }
      }

      // 尝试获取静态资源
      return env.ASSETS.fetch(new Request(
        new URL(assetPath, request.url).toString(),
        request
      ));

    } catch (error) {
      // 如果出错，返回404页面
      return new Response(`<!DOCTYPE html>
        <html>
          <head>
            <title>404 - Page Not Found</title>
          </head>
          <body>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
          </body>
        </html>`,
        {
          status: 404,
          headers: { "Content-Type": "text/html" }
        }
      );
    }
  }
}; 
