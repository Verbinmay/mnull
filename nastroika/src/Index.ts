import express from "express";

const app = express();
const port = 3000;
/* это чтобы принимать body от клиента */
const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

/*
fetch('http://localhost:3000/courses', {method: 'POST', body : JSON.stringify({title:'dba'}), headers :{
    'content-type' : 'application/json'
}})
.then(res => res.json())
.then(json => console.log(json)) */

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
    foundCourse = foundCourse.filter(
      (c) => c.title.indexOf(req.query.title as string) > -1
    );
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

app.post("/courses", (req, res) => {
  //добавим проверку на наличие
  if (!req.body.title) {
    res.sendStatus(400);
    return;
  }

  const createdCourse = {
    id: +new Date(),
    title: req.body.title,
  };
  /* опять хреначим из даты число */
  db.courses.push(createdCourse);
  res.status(201).json(createdCourse);
  //статус креатед будет видно в нетворке в хеадерс
  /*
  fetch('http://localhost:3000/courses', {method: 'POST', body : JSON.stringify({title:'dba'}), headers :{
  'content-type' : 'application/json'}})
  .then(res => res.json())
  .then(json => console.log(json))
*/
});

app.delete("/courses/:id", (req, res) => {
  db.courses = db.courses.filter((c) => c.id !== +req.params.id);
  /*
  fetch('http://localhost:3000/courses/1', {method: 'DELETE'})
.then(res => res.json())
.then(json => console.log(json))
сотрет , но вернет ошибку из-за данных реса, что они не в json
   */

  res.sendStatus(204);
});

app.put("/courses/:id", (req, res) => {
  if (!req.body.title) {
    res.sendStatus(404);
    return;
  }

  const foundCourse = db.courses.find((c) => c.id === +req.params.id);

  if (!foundCourse) {
    res.sendStatus(404);
    return;
  }

  foundCourse.title = req.body.title;

/* 
ругается, но делает 

fetch('http://localhost:3000/courses/1', {method: 'PUT', body : JSON.stringify({title:'dba'}), headers :{
    'content-type' : 'application/json'
}})
.then(res => res.json())
.then(json => console.log(json))
*/

  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
