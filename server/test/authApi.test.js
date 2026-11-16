const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const app = require("../app");

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, "127.0.0.1", resolve);
  });

  baseUrl = `http://127.0.0.1:${server.address().port}/api/auth`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

const withUserMethods = async (replacements, run) => {
  const originals = new Map(
    Object.keys(replacements).map((method) => [method, User[method]])
  );

  Object.assign(User, replacements);

  try {
    await run();
  } finally {
    for (const [method, implementation] of originals) {
      User[method] = implementation;
    }
  }
};

const request = async (path, data) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return { response, body: await response.json() };
};

test("registers users with a hashed password and safe response data", async () => {
  const password = "StrongPass123!";
  let savedUser;

  await withUserMethods(
    {
      findOne: (filter) => {
        assert.deepEqual(filter, { email: "student@example.com" });
        return {
          select: async (projection) => {
            assert.equal(projection, "_id");
            return null;
          },
        };
      },
      create: async (data) => {
        savedUser = data;
        return {
          _id: "507f1f77bcf86cd799439011",
          name: data.name,
          email: data.email,
          password: data.password,
          createdAt: "2026-01-01T00:00:00.000Z",
        };
      },
    },
    async () => {
      const { response, body } = await request("/register", {
        name: " Student Name ",
        email: " Student@Example.com ",
        password,
      });

      assert.equal(response.status, 201);
      assert.equal(body.success, true);
      assert.equal(body.data.name, "Student Name");
      assert.equal(body.data.email, "student@example.com");
      assert.equal("password" in body.data, false);
      assert.equal("password" in body, false);
    }
  );

  assert.notEqual(savedUser.password, password);
  assert.equal(await bcrypt.compare(password, savedUser.password), true);
});

test("rejects duplicate registrations and validates registration input", async () => {
  let createCalled = false;

  await withUserMethods(
    {
      findOne: () => ({
        select: async () => ({ _id: "existing-user" }),
      }),
      create: async () => {
        createCalled = true;
      },
    },
    async () => {
      const duplicate = await request("/register", {
        name: "Student Name",
        email: "student@example.com",
        password: "StrongPass123!",
      });
      assert.equal(duplicate.response.status, 400);
      assert.match(duplicate.body.message, /already exists/i);
      assert.equal(createCalled, false);
    }
  );

  const missingFields = await request("/register", {});
  assert.equal(missingFields.response.status, 400);

  const mismatchedPasswordFields = await request("/register", {
    name: "Student Name",
    email: "student@example.com",
    password: "StrongPass123!",
    role: "admin",
  });
  assert.equal(mismatchedPasswordFields.response.status, 400);

  const oversizedPassword = await request("/register", {
    name: "Student Name",
    email: "student@example.com",
    password: "é".repeat(37),
  });
  assert.equal(oversizedPassword.response.status, 400);
  assert.match(oversizedPassword.body.message, /72 UTF-8 bytes/i);
});

test("logs users in with valid credentials and rejects unknown or incorrect credentials", async () => {
  const password = "StrongPass123!";
  const user = {
    _id: "507f1f77bcf86cd799439011",
    name: "Student Name",
    email: "student@example.com",
    password: await bcrypt.hash(password, 4),
    createdAt: "2026-01-01T00:00:00.000Z",
  };
  let lookupResult = user;

  await withUserMethods(
    {
      findOne: (filter) => {
        assert.deepEqual(filter, { email: "student@example.com" });
        return {
          select: async (projection) => {
            assert.equal(projection, "+password");
            return lookupResult;
          },
        };
      },
    },
    async () => {
      const successfulLogin = await request("/login", {
        email: " Student@Example.com ",
        password,
      });

      assert.equal(successfulLogin.response.status, 200);
      assert.equal(successfulLogin.body.success, true);
      assert.equal(successfulLogin.body.data.email, "student@example.com");
      assert.equal("password" in successfulLogin.body.data, false);

      const incorrectPassword = await request("/login", {
        email: "student@example.com",
        password: "WrongPass123!",
      });
      assert.equal(incorrectPassword.response.status, 401);
      assert.equal(
        incorrectPassword.body.message,
        "Invalid email or password."
      );

      lookupResult = null;
      const unknownEmail = await request("/login", {
        email: "student@example.com",
        password,
      });
      assert.equal(unknownEmail.response.status, 401);
      assert.equal(unknownEmail.body.message, "Invalid email or password.");
    }
  );
});
