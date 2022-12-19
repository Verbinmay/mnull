const http = require("http");
const fs = require("fs");
//мы будем ждать, а потом ресолве, мс передается вместе с кейсом
const delay = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};
// функция принимает путь к файлу, возвращает промис,где мы считываем файил, если ошибка, то редчект
const readFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};
const server = http.createServer(
  //async ассинхронная функция,чтобы использовать await
  async (request, response) => {
    switch (request.url) {
      // await передаем путь и функцию, там она проверяется , есть ли ошибка, если нет, то возвразается
      //обработчик ошибок try catch , если вдруг у нас возвращается ошибка
      case "/home": {
        try {
          const data = await readFile("pages/about.html");
          response.write(data);
          response.end();
        } catch (err) {
          response.write("something err");
          response.end();
        }
        break;
      }
      // мы передаем 3 секунды в промис, ждем,получаем одобрение и идем дальше по коды программы
      case "/about": {
        await delay(3000);
        response.write("About course");
        response.end();
        break;
      }
      default: {
        response.write("404 not found");
        response.end();
      }
    }
  }
);

server.listen(3003);
