import express, { Request, Response } from "express";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from "./types";
import { CreateCourseModel } from "./models/CreateCourseModel";
import { QueryCourseModel } from "./models/QueryCoursesModel";
import { CourseViewModel } from "./models/CourseViewModel";
import { URIParamsCourseIdModel } from "./models/URIParamsCourseIdModel";

export const app = express();
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

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,

  BAD_REQUEST_400: 400,
  NOT_FOUND_404: 404,
};

type CourseType = {
  id: number;
  title: string;
  studentsCount: number;
};

const db: { courses: CourseType[] } = {
  courses: [
    { id: 1, title: "front-end", studentsCount: 10 },
    { id: 2, title: "back-end", studentsCount: 10 },
    { id: 3, title: "JS", studentsCount: 10 },
    { id: 4, title: "CSS", studentsCount: 10 },
  ],
};

const getCourseViewModel = (dbCourse: CourseType):CourseViewModel => {
  return {id: dbCourse.id,
  title: dbCourse.title}
}

app.get(
  "/courses",
  (
    req: RequestWithQuery<QueryCourseModel>,
    res: Response<CourseViewModel[]>
  ) => {
    let foundCourse = db.courses;
    /*прикол в том, что если я запрошу курсы, то увижу и счётчик студентов, хотя в res в типе у меня отдельный тип, в котором нет счётчика, потому мы мапим ниже */

    //это все курсы, но если вдруг есть есть в куери тайтл, то фильтруй
    if (req.query.title) {
      foundCourse = foundCourse.filter(
        (c) => c.title.indexOf(req.query.title) > -1
      );
    }
    /* 
Так вот , чтобы обработать вясяки фильтры со ???, надо использовать в рекуесте куери as sring

fetch('http://localhost:3000/courses?title=end', {method: 'GET'})
.then(res => res.json())
.then(json => console.log(json))*/

    //!length -нет длинны
    /* if (!foundCourse.length) {
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    return;
  }*/
    res.json(
      foundCourse.map(getCourseViewModel)
    );
  }
);

// query parametr always string

app.get(
  "/courses/:id",
  (
    req: RequestWithParams<URIParamsCourseIdModel>,
    res: Response<CourseViewModel>
  ) => {
    const foundCourse = db.courses.find((c) => c.id === +req.params.id);
    /*Интересная хуйня, мы переводим параметр знаком из строки в число + 
    req это то, что мы получаем, посмотреть надо в params 

    fetch('http://localhost:3000/courses/3', {method: 'GET'})
.then(res => res.json())
.then(json => console.log(json))
    */

    if (!foundCourse) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    res.json(getCourseViewModel(foundCourse));
  }
);

app.post(
  "/courses",
  (req: RequestWithBody<CreateCourseModel>, res: Response<CourseViewModel>) => {
    //добавим проверку на наличие
    if (!req.body.title) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    const createdCourse: CourseType = {
      id: +new Date(),
      title: req.body.title,
      studentsCount: 0,
    };
    /* опять хреначим из даты число */
    db.courses.push(createdCourse);
    res
      .status(HTTP_STATUSES.CREATED_201)
      .json(getCourseViewModel(createdCourse));
    //статус креатед будет видно в нетворке в хеадерс
    /*
  fetch('http://localhost:3000/courses', {method: 'POST', body : JSON.stringify({title:'dba'}), headers :{
  'content-type' : 'application/json'}})
  .then(res => res.json())
  .then(json => console.log(json))
*/
  }
);

app.delete(
  "/courses/:id",
  (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
    db.courses = db.courses.filter((c) => c.id !== +req.params.id);
    /*
  fetch('http://localhost:3000/courses/1', {method: 'DELETE'})
.then(res => res.json())
.then(json => console.log(json))
сотрет , но вернет ошибку из-за данных реса, что они не в json
   */

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
);

app.put(
  "/courses/:id",
  (
    req: RequestWithParamsAndBody<URIParamsCourseIdModel, CreateCourseModel>,
    res
  ) => {
    if (!req.body.title) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }

    const foundCourse = db.courses.find((c) => c.id === +req.params.id);

    if (!foundCourse) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
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

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  }
);

app.delete("/__test__/data", (req, res) => {
  db.courses = [];
  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
