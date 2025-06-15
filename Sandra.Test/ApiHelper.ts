type FetchOptions = RequestInit;

type BodyValidator = (actualBody: any) => void;

export function testApi(
  msg: string,
  url: string,
  reqOptions: FetchOptions = {},
  expectedStatus: number,
  expectedBody: object | BodyValidator
) {
  test(msg, async () => {
    const response = await fetch(url, reqOptions);
    expect(response.status).toBe(expectedStatus);

    const actualBody = await response.json();

    console.log("Status:", response.status);
    console.log("Body:", actualBody);

    if (typeof expectedBody === "function") {
      // Custom validator function
      expectedBody(actualBody);
    } else {
      // Deep equality check
      expect(actualBody).toEqual(expectedBody);
    }
  });
}

// runApiTest performs the API fetch and validations without wrapping in a `test()`
export async function runApiTest(
  url: string,
  reqOptions: FetchOptions = {},
  expectedStatus: number,
  expectedBody: object | BodyValidator
): Promise<void> {
  const response = await fetch(url, reqOptions);
  const actualBody = await response.json();

  console.log("Status:", response.status);
  console.log("Body:", actualBody);

  expect(response.status).toBe(expectedStatus);

  if (typeof expectedBody === "function") {
    expectedBody(actualBody);
  } else {
    expect(actualBody).toEqual(expectedBody);
  }
}
