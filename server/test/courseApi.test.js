const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");

const Course = require("../models/Course");
const app = require("../app");

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });

  baseUrl = `http://127.0.0.1:${server.address().port}/api/courses`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

const withCourseMethod = async (method, implementation, run) => {
  const hadOwnMethod = Object.prototype.hasOwnProperty.call(Course, method);
  const originalMethod = Course[method];
  Course[method] = implementation;

  try {
    await run();
  } finally {
    if (hadOwnMethod) {
      Course[method] = originalMethod;
    } else {
      delete Course[method];
    }
  }
};

const request = async (path, method, data) => {
  const options = { method, headers: {} };

  if (data !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${baseUrl}${path}`, options);
  return { response, body: await response.json() };
};

test("supports the complete course CRUD lifecycle", async () => {
  const courseId = "507f1f77bcf86cd799439011";
  const createdCourse = {
    _id: courseId,
    title: "Web Technologies",
    code: "WT101",
    credits: 4,
    department: "Computer Science",
    active: true,
  };
  const updatedCourse = { ...createdCourse, credits: 5 };

  await withCourseMethod("create", async (data) => {
    assert.deepEqual(data, {
      title: "Web Technologies",
      code: "WT101",
      credits: 4,
      department: "Computer Science",
      active: true,
    });
    return createdCourse;
  }, async () => {
    const { response, body } = await request("", "POST", {
      title: "Web Technologies",
      code: "WT101",
      credits: 4,
      department: "Computer Science",
      active: true,
    });

    assert.equal(response.status, 201);
    assert.equal(body.success, true);
    assert.deepEqual(body.data, createdCourse);
  });

  await withCourseMethod("find", async () => [createdCourse], async () => {
    const { response, body } = await request("", "GET");

    assert.equal(response.status, 200);
    assert.deepEqual(body.data, [createdCourse]);
  });

  await withCourseMethod("findById", async (id) => {
    assert.equal(id, courseId);
    return createdCourse;
  }, async () => {
    const { response, body } = await request(`/${courseId}`, "GET");

    assert.equal(response.status, 200);
    assert.deepEqual(body.data, createdCourse);
  });

  await withCourseMethod(
    "findByIdAndUpdate",
    async (id, update, options) => {
      assert.equal(id, courseId);
      assert.deepEqual(update, { $set: { credits: 5 } });
      assert.deepEqual(options, { new: true, runValidators: true });
      return updatedCourse;
    },
    async () => {
      const { response, body } = await request(`/${courseId}`, "PUT", {
        credits: 5,
      });

      assert.equal(response.status, 200);
      assert.deepEqual(body.data, updatedCourse);
    }
  );

  await withCourseMethod("findByIdAndDelete", async (id) => {
    assert.equal(id, courseId);
    return updatedCourse;
  }, async () => {
    const { response, body } = await request(`/${courseId}`, "DELETE");

    assert.equal(response.status, 200);
    assert.equal(body.message, "Course deleted successfully.");
    assert.deepEqual(body.data, updatedCourse);
  });
});

test("validates course data and returns controlled API errors", async () => {
  const course = new Course({
    title: "  Web Technologies ",
    code: " wt101 ",
    credits: 4,
    department: " Computer Science ",
  });
  await course.validate();
  assert.equal(course.title, "Web Technologies");
  assert.equal(course.code, "WT101");
  assert.equal(course.active, true);

  const invalidCourse = new Course({
    title: "x",
    code: "bad code",
    credits: 1.5,
    department: "C",
  });
  await assert.rejects(invalidCourse.validate(), { name: "ValidationError" });

  const invalidId = await request("/invalid-id", "GET");
  assert.equal(invalidId.response.status, 400);

  await withCourseMethod(
    "create",
    (data) => new Course(data).validate(),
    async () => {
      const missingFields = await request("", "POST", { title: "DBMS" });
      assert.equal(missingFields.response.status, 400);
      assert.equal(missingFields.body.success, false);
    }
  );

  await withCourseMethod("findById", async () => null, async () => {
    const missingCourse = await request(
      "/507f1f77bcf86cd799439011",
      "GET"
    );
    assert.equal(missingCourse.response.status, 404);
    assert.equal(missingCourse.body.message, "Course not found.");
  });

  await withCourseMethod(
    "create",
    async () => {
      const error = new Error("duplicate key");
      error.code = 11000;
      throw error;
    },
    async () => {
      const duplicateCode = await request("", "POST", {
        title: "Web Technologies",
        code: "WT101",
        credits: 4,
        department: "Computer Science",
      });
      assert.equal(duplicateCode.response.status, 400);
      assert.match(duplicateCode.body.message, /code already exists/i);
    }
  );

  await withCourseMethod(
    "find",
    async () => {
      throw new Error("database unavailable");
    },
    async () => {
      const failedRequest = await request("", "GET");
      assert.equal(failedRequest.response.status, 500);
      assert.equal(failedRequest.body.message, "Failed to retrieve courses.");
    }
  );
});
