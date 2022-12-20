"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
const db = {
    courses: [
        { id: 1, title: "front-end" },
        { id: 2, title: "back-end" },
        { id: 3, title: "JS" },
        { id: 4, title: "CSS" },
    ],
};
app.get("/courses", (req, res) => {
    let foundCourse = db.courses;
    //это все курсы, но если вдруг есть есть в куери тайтл, то фильтруй
    if (req.query.title) {
        foundCourse = foundCourse.filter((c) => c.title.indexOf(req.query.title) > -1);
    }
    /*
  Так вот , чтобы обработать вясяки фильтры со ???, надо использовать в рекуесте куери as sring
  
  fetch('http://localhost:3000/courses?title=end', {method: 'GET'})
  .then(res => res.json())
  .then(json => console.log(json))*/
    //!length -нет длинны
    if (!foundCourse.length) {
        res.sendStatus(404);
        return;
    }
    res.json(foundCourse);
});
app.get("/courses/:id", (req, res) => {
    const foundCourse = db.courses.find((c) => c.id === +req.params.id);
    /*Интересная хуйня, мы переводим параметр знаком из строки в число +
      req это то, что мы получаем, посмотреть надо в params
  
      fetch('http://localhost:3000/courses/3', {method: 'GET'})
  .then(res => res.json())
  .then(json => console.log(json))
      */
    if (!foundCourse) {
        res.sendStatus(404);
        return;
    }
    res.json(foundCourse);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
