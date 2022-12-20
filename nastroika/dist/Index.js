"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.get("/courses", (req, res) => {
    res.json([
        { id: 1, title: "Front-End" },
        { id: 2, title: "Back-End" },
        { id: 3, title: "JS" },
        { id: 4, title: "CSS" },
    ]);
});
app.get("/courses/:id", (req, res) => {
    const foundCourse = [
        { id: 1, title: "Front-End" },
        { id: 2, title: "Back-End" },
        { id: 3, title: "JS" },
        { id: 4, title: "CSS" },
        //Интересная хуйня, мы переводим параметр знаком из строки в число +
        // req это то, что мы получаем, посмотреть надо в params 
    ].find(c => c.id === +req.params.id);
    if (!foundCourse) {
        res.sendStatus(404);
        return;
    }
    res.json(foundCourse);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
