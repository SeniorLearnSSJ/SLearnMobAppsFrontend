import { testApi } from "./ApiHelper";
import { runApiTest } from "./ApiHelper";

function buildUrl(base: string, params: Record<string, string | number> = {}) {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return url.toString();
}


const BASE_URL1 = "http://localhost:5143/api/auth/register";

testApi(
  "Register creates new user",
  `${BASE_URL1}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "foofoo20",
      password: "barbar",
      firstName: "Foofoo",
      lastName: "Barbar",
      email: "foo@gmail.com",
    }),
  },
  201,
  (body) => {
    console.log("Response body received in test:", body);
    expect(body).toMatchObject({
      success: true,
      message: expect.any(String),
      data: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        expiresIn: expect.any(Number),
        role: expect.any(String),
      },
    });
  }
); 

const BASE_URL = "http://localhost:5143/api/auth/sign-in";
const BASE_URL2 = "http://localhost:5143/api/auth/sign-out";

const BASE_URL3 = "http://localhost:5143/api/bulletins/member";

/* let validToken: string | null = null;

beforeAll(async () => {
  // Call your sign-in API to get a fresh token
  const response = await fetch("http://localhost:5143/api/auth/sign-in", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "User101", password: "user123" }),
  });

  const data = await response.json();

  // Save the access token for later use
  validToken = data.data.accessToken;
}); */

testApi(
  "Sign in allows sign in",
  `${BASE_URL}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "User101", password: "user123" }),
  },
  200,
  (body) => {
    expect(body).toMatchObject({
      success: true,
      message: expect.any(String), // Accept any string here
      data: {
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
        expiresIn: expect.any(Number),
        role: expect.any(String),
      },
    });
  }
);

//let validToken: string;
describe("Auth tests need token", () => {
  let validToken: string;
  beforeAll(async () => {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "User101", password: "user123" }),
    });

    const data = await response.json();
    validToken = data.data.accessToken;
    console.log("valid", validToken);
  });

  test("Successful signout1", async () => {
    await fetch(`${BASE_URL2}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
      body: JSON.stringify({ refreshToken: "dummy token" }),
    });
  });

  test("Successful member bulletin list fetch", async () => {
    await runApiTest(
      BASE_URL3,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${validToken}`,
        },
      },
      200,
      (body) => {
        expect(body).toMatchObject({
          success: true,

          //message: expect.any(String || null),
          data: expect.any(Array),
        });
        expect(body.message === null || typeof body.message === "string").toBe(
          true
        );

        if (body.data.length > 0) {
          const item = body.data[0];
          expect(item).toMatchObject({
            id: expect.any(String),
            title: expect.any(String),

            //content: expect.any(String),
            createdById: expect.any(String),
            createdByUsername: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            category: expect.any(String),
          });
          expect(
            item.content === null || typeof item.content === "string"
          ).toBe(true);
        }
      }
    );
  });

  test("Successful member bulletin post", async () => {
    await runApiTest(
      BASE_URL3,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${validToken}`,
        },
        body: JSON.stringify({
          title: "MyTitle",
          content: "MyContent",
          category: "Interest",
        }),
      },

      201,
      (body) => {
        expect(body).toMatchObject({
          success: true,

          data: {
            title: "MyTitle",
            content: "MyContent",
            category: "Interest",
            id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            createdById: expect.any(String),
            createdByUsername: expect.any(String),
          },
        });
      }
    );
  });

  test("Successful member bulletin fetch by ID", async () => {
    const res = await fetch(`${BASE_URL3}`, {
      headers: { Authorization: `Bearer ${validToken}` },
    });
    const listBody = await res.json();
    const firstId = listBody.data?.[0]?.id;
    expect(typeof firstId).toBe("string");

    await runApiTest(
      `${BASE_URL3}/${firstId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${validToken}`,
        },
      },
      200,
      (body) => {
        expect(body).toMatchObject({
          success: true,

          //message: expect.any(String || null),
          //data: expect.any(Array),
        });

        expect(typeof body.data).toBe("object");
        expect(body.message === null || typeof body.message === "string").toBe(
          true
        );

        if (body.data.length > 0) {
          for (const item of body.data) {
            expect(item).toMatchObject({
              id: firstId,
              title: expect.any(String),

              content: expect.any(String),
              createdById: expect.any(String),
              createdByUsername: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              category: expect.any(String),
            });
            expect(
              item.content === null || typeof item.content === "string"
            ).toBe(true);
          }
        }
      }
    );
  });

  test("Successful edit/put member bulletin by ID", async () => {
    const res = await fetch(`${BASE_URL3}`, {
      headers: { Authorization: `Bearer ${validToken}` },
    });
    const listBody = await res.json();
    const firstId = listBody.data?.[0]?.id;
    expect(typeof firstId).toBe("string");

    await runApiTest(
      `${BASE_URL3}/${firstId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${validToken}`,
        },
        body: JSON.stringify({
          title: "MyTitle",
          content: "MyContent",
          category: "Interest",
        }),
      },
      200,
      (body) => {
        expect(body).toMatchObject({
          success: true,

          //message: expect.any(String || null),
          //data: expect.any(Array),
        });

        expect(typeof body.data).toBe("object");
        expect(body.message === null || typeof body.message === "string").toBe(
          true
        );

        //if (body.data.length > 0) {

        //for (const item of body.data)
        {
          expect(body.data).toMatchObject({
            id: firstId,
            title: "MyTitle",

            content: "MyContent",
            createdById: expect.any(String),
            createdByUsername: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            category: "Interest",
          });

          //expect(
          //item.content === null || typeof item.content === "string"
          //).toBe(true);
        }
      }
    );
  });

  async function runApiTest(
    url: string,
    reqOptions: RequestInit,
    expectedStatus: number,
    validateBody: (body: any) => void
  ): Promise<void> {
    const response = await fetch(url, reqOptions);
    const text = await response.text();

    let actualBody: any = null;
    if (text) {
      try {
        actualBody = JSON.parse(text);
      } catch {
        actualBody = text;
      }
    }

    console.log(response.status);
    console.log(actualBody);
    expect(response.status).toBe(expectedStatus);
    validateBody(actualBody);
  }

  test("Successful delete member bulletin by ID", async () => {
    const res = await fetch(`${BASE_URL3}`, {
      headers: { Authorization: `Bearer ${validToken}` },
    });
    const listBody = await res.json();
    const firstId = listBody.data?.[0]?.id;
    expect(typeof firstId).toBe("string");

    await runApiTest(
      `${BASE_URL3}/${firstId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${validToken}`,
        },
      },
      204,
      (body) => {
        const isEmptyBody =
          body === undefined ||
          body === null ||
          (typeof body === "object" && Object.keys(body).length === 0) ||
          (typeof body === "string" && body.trim() === "");

        expect(isEmptyBody).toBe(true);
      }
    );
  });
});

/* 

  test("Successful member bulletin post by ID", async () => {
    const listResponse = await fetch(`${BASE_URL3}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
    });
    const listBody = await listResponse.json();
    const firstIBulletin = listBody.data[0];

    const firstId = firstIBulletin.id;
    console.log(firstIBulletin.id);

    await runApiTest(
      `${BASE_URL3}/${firstId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${validToken}`,
        },
      },

      200,
      (body) => {
        expect(body.success).toBe(true);
        expect(body.data).toMatchObject(firstIBulletin);
      }
    );
  });
}); */

/*         if (body.data.length > 0) {


          expect 
          const item = body.data[0];
          expect(item).toMatchObject({
            id: expect.any(String),
            title: expect.any(String),

            //content: expect.any(String),
            createdById: expect.any(String),
            createdByUsername: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            category: expect.any(String),
          });
          expect(
            item.content === null || typeof item.content === "string"
          ).toBe(true);
        }
      }
    );
 */

/*   testApi(
    "GET returns member bulletin array",
    `${BASE_URL3}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${validToken}`,
      },
    },
    200,
    (body) => {
      expect(body).toMatchObject({
        success: true,
        message: expect.any(String),
        data: expect.any(Array),
      });

      if (body.data.length > 0) {
        const item = body.data[0];
        expect(item).toMatchObject({
          id: expect.any(String),
          title: expect.any(String),
          content: expect.any(String),
          createdById: expect.any(String),
          createdByUserName: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          category: expect.any(String),
        });
        
      }
    }
  ); */

/* 
  testApi(
      "Signout",
      BASE_URL2,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${validToken}`,
        },
        body: JSON.stringify({ refreshToken: "dummy token" }),
      },
      200,
      (body) => {
        expect(body).toMatchObject({
          success: true,
          message: expect.any(String),
          data: true,
        });
 */

/*   });
});
 */
