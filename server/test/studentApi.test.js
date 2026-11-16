const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");

const Student = require("../models/Student");
const app = require("../app");

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });

  baseUrl = `http://127.0.0.1:${server.address().port}/api/students`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

const withStudentMethod = async (method, implementation, run) => {
  const hadOwnMethod = Object.prototype.hasOwnProperty.call(Student, method);
  const originalMethod = Student[method];
  Student[method] = implementation;

  try {
    await run();
  } finally {
    if (hadOwnMethod) {
      Student[method] = originalMethod;
    } else {
      delete Student[method];
    }
  }
};

const request = async (path, method, body) => {
  const options = { method, headers: {} };

  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${baseUrl}${path}`, options);
  return { response, body: await response.json() };
};

test("supports the complete student CRUD lifecycle", async () => {
  const studentId = "507f1f77bcf86cd799439011";
  const createdStudent = {
    _id: studentId,
    name: "Rahul",
    email: "rahul@example.com",
    course: "BCA",
  };
  const updatedStudent = { ...createdStudent, course: "MCA" };

  await withStudentMethod("create", async (data) => {
    assert.deepEqual(data, {
      name: "Rahul",
      email: "rahul@example.com",
      course: "BCA",
    });
    return createdStudent;
  }, async () => {
    const { response, body } = await request("", "POST", {
      name: "Rahul",
      email: "rahul@example.com",
      course: "BCA",
    });

    assert.equal(response.status, 201);
    assert.equal(body.success, true);
    assert.deepEqual(body.data, createdStudent);
  });

  await withStudentMethod("find", async () => [createdStudent], async () => {
    const { response, body } = await request("", "GET");

    assert.equal(response.status, 200);
    assert.deepEqual(body.data, [createdStudent]);
  });

  await withStudentMethod("findById", async (id) => {
    assert.equal(id, studentId);
    return createdStudent;
  }, async () => {
    const { response, body } = await request(`/${studentId}`, "GET");

    assert.equal(response.status, 200);
    assert.deepEqual(body.data, createdStudent);
  });

  await withStudentMethod("findByIdAndUpdate", async (id, update, options) => {
    assert.equal(id, studentId);
    assert.deepEqual(update, { $set: { course: "MCA" } });
    assert.deepEqual(options, { new: true, runValidators: true });
    return updatedStudent;
  }, async () => {
    const { response, body } = await request(`/${studentId}`, "PUT", {
      course: "MCA",
    });

    assert.equal(response.status, 200);
    assert.deepEqual(body.data, updatedStudent);
  });

  await withStudentMethod("findByIdAndDelete", async (id) => {
    assert.equal(id, studentId);
    return updatedStudent;
  }, async () => {
    const { response, body } = await request(`/${studentId}`, "DELETE");

    assert.equal(response.status, 200);
    assert.equal(body.message, "Student deleted successfully.");
    assert.deepEqual(body.data, updatedStudent);
  });
});

test("returns controlled errors for invalid input, missing students, and database failures", async () => {
  const invalidId = await request("/not-an-object-id", "GET");
  assert.equal(invalidId.response.status, 400);
  assert.equal(invalidId.body.success, false);

  await withStudentMethod(
    "create",
    (data) => new Student(data).validate(),
    async () => {
      const missingFields = await request("", "POST", { name: "R" });
      assert.equal(missingFields.response.status, 400);
      assert.equal(missingFields.body.success, false);
      assert.match(missingFields.body.message, /required/i);
    }
  );

  await withStudentMethod("findById", async () => null, async () => {
    const missingStudent = await request(
      "/507f1f77bcf86cd799439011",
      "GET"
    );
    assert.equal(missingStudent.response.status, 404);
    assert.equal(missingStudent.body.message, "Student not found.");
  });

  await withStudentMethod(
    "find",
    async () => {
      throw new Error("database unavailable");
    },
    async () => {
      const failedRequest = await request("", "GET");
      assert.equal(failedRequest.response.status, 500);
      assert.equal(failedRequest.body.success, false);
      assert.equal(failedRequest.body.message, "Failed to retrieve students.");
    }
  );
});
