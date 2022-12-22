import request from "supertest";
import { app, HTTP_STATUSES } from "../../src/Index";

describe("/course", () => {
  beforeAll(async () => {
    await request(app).delete("/__test__/data");
  });

  it("should return 200 and enmty array", async () => {
    await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, []);
  });

  it("should return 404 for not existing course", async () => {
    await request(app).get("/courses/999").expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("Shouldnt create course with correct input data", async () => {
    await request(app)
      .post("/courses")
      .send({ title: "" })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, []);
  });

  let createdCourse: any = null;

  it("Should create course with correct input data", async () => {
    const createResponse = await request(app)
      .post("/courses")
      .send({ title: "New course" })
      .expect(HTTP_STATUSES.CREATED_201);

    createdCourse = createResponse.body;

    expect(createdCourse).toEqual({
      id: expect.any(Number),
      title: "New course",
    });

    await request(app)
      .get("/courses")
      .expect(HTTP_STATUSES.OK_200, [createdCourse]);
  });

  let createdCourse2: any = null;
  it("create one more course", async () => {
    const createResponse = await request(app)
      .post("/courses")
      .send({ title: "New course 222" })
      .expect(HTTP_STATUSES.CREATED_201);

    createdCourse2 = createResponse.body;

    expect(createdCourse2).toEqual({
      id: expect.any(Number),
      title: "New course 222",
    });

    await request(app)
      .get("/courses")
      .expect(HTTP_STATUSES.OK_200, [createdCourse, createdCourse2]);
  });

  it("Shouldnt update course with correct input data", async () => {
    await request(app)
      .put("/courses/" + createdCourse.id)
      .send({ title: "" })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    await request(app)
      .get("/courses/" + createdCourse.id)
      .expect(HTTP_STATUSES.OK_200, createdCourse);
  });

  it("Shouldnt update course that not exist", async () => {
    await request(app)
      .put("/courses/" + -100)
      .send({ title: "GOOD" })
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it("Should update with correct input model", async () => {
    await request(app)
      .put("/courses/" + createdCourse.id)
      .send({ title: "GOOD" })
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get("/courses/" + createdCourse.id)
      .expect(HTTP_STATUSES.OK_200, { ...createdCourse, title: "GOOD" });
    // интересная херня с копией обьекта , но тайтл другой

    await request(app)
      .get("/courses/" + createdCourse2.id)
      .expect(HTTP_STATUSES.OK_200, createdCourse2);
  });

  it("Should delete both courses", async () => {
    await request(app)
      .delete("/courses/" + createdCourse.id)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get("/courses/" + createdCourse.id)
      .expect(HTTP_STATUSES.NOT_FOUND_404);

    await request(app)
      .delete("/courses/" + createdCourse2.id)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get("/courses/" + createdCourse2.id)
      .expect(HTTP_STATUSES.NOT_FOUND_404);

    await request(app).get("/courses").expect(HTTP_STATUSES.OK_200, []);
  });
});
