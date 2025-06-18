// //
// // Wrapper around a jest's test, supply data for
// // the request, status code and expected
// //
// // Makes life easier rather than having to retype everything
// // over and over.
// //
// async function teste2e(msg, url, req, statuscode, expected) {
//   test(msg, async () => {
//     let response = await fetch(url, req);
//     let actual = await response.json();

//     expect(response.status).toBe(statuscode);
//     expect(actual).toEqual(expected);
//   });
// }

// //
// // Expected object that is used by jsonplaceholder
// //
// const expectedobj = {
//   userId: 1,
//   id: 1,
//   title:
//     "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
//   body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
// };

// //
// // Call using `teste2e` where they fetch the data
// // Supply the test message, url, request object,
// // statuscode and expected object
// //
// teste2e(
//   "Example one",
//   "https://jsonplaceholder.typicode.com/posts/1",
//   {},
//   200,
//   expectedobj
// );

// SeniorLearn Bulletin System E2E Tests
// Base configuration
const BASE_URL = "http://localhost:5143";

// Test data
const testUsers = {
  member: {
    username: "testmember",
    password: "user123",
    email: "test@example.com",
    firstName: "Test",
    lastName: "Member",
  },
  admin: {
    username: "Admin",
    password: "user123",
  },
};

// Helper function to create authenticated request headers
function createAuthRequest(method, token, body = null) {
  const request = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  if (body) {
    request.body = JSON.stringify(body);
  }
  return request;
}

// Helper function for unauthenticated requests
function createRequest(method, body = null) {
  const request = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (body) {
    request.body = JSON.stringify(body);
  }
  return request;
}

// Helper function to register a user
async function registerUser(userData) {
  const response = await fetch(
    `${BASE_URL}/api/auth/register`,
    createRequest("POST", userData)
  );

  if (response.status === 201) {
    const result = await response.json();
    return {
      success: true,
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
    };
  }

  return {
    success: false,
    status: response.status,
  };
}

// Helper function to sign in a user
async function signInUser(username, password) {
  const signInData = { username, password };
  const response = await fetch(
    `${BASE_URL}/api/auth/sign-in`,
    createRequest("POST", signInData)
  );

  if (response.status === 200) {
    const result = await response.json();
    return {
      success: true,
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
    };
  }

  return {
    success: false,
    status: response.status,
  };
}

// Helper function to get or create a user session
async function setupUser(userData) {
  // Try to register first
  const registerResult = await registerUser(userData);

  if (registerResult.success) {
    return {
      accessToken: registerResult.accessToken,
      refreshToken: registerResult.refreshToken,
    };
  }

  // If registration fails (user might already exist), try signing in
  const signInResult = await signInUser(userData.username, userData.password);

  if (signInResult.success) {
    return {
      accessToken: signInResult.accessToken,
      refreshToken: signInResult.refreshToken,
    };
  }

  throw new Error(
    `Failed to setup user: Register status ${registerResult.status}, Sign-in status ${signInResult.status}`
  );
}

// Helper function to get an existing official bulletin ID
async function getOfficialBulletinId() {
  const response = await fetch(
    `${BASE_URL}/api/bulletins/official`,
    createRequest("GET")
  );
  const result = await response.json();
  return result.data.length > 0 ? result.data[result.data.length - 1].id : null;
}

// Helper function to get an existing member bulletin ID
async function getMemberBulletinId(token) {
  const response = await fetch(
    `${BASE_URL}/api/bulletins/member`,
    createAuthRequest("GET", token)
  );
  const result = await response.json();
  return result.data.length > 0 ? result.data[result.data.length - 1].id : null;
}

describe("SeniorLearn Bulletin System E2E Tests", () => {
  // ========== AUTHENTICATION FLOW TESTS ==========
  describe("Authentication Flow", () => {
    test("Member Registration", async () => {
      const response = await fetch(
        `${BASE_URL}/api/auth/register`,
        createRequest("POST", testUsers.member)
      );
      expect(response.status).toBe(201);
      const result = await response.json();
      expect(result.data).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
          expiresIn: expect.any(Number),
          role: expect.any(String),
        })
      );
    });

    test("Member Sign-in", async () => {
      const signInData = {
        username: testUsers.member.username,
        password: testUsers.member.password,
      };
      const response = await fetch(
        `${BASE_URL}/api/auth/sign-in`,
        createRequest("POST", signInData)
      );
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.data).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
          expiresIn: expect.any(Number),
          role: expect.any(String),
        })
      );
    });

    test("Admin Sign-in", async () => {
      const signInData = {
        username: testUsers.admin.username,
        password: testUsers.admin.password,
      };
      const response = await fetch(
        `${BASE_URL}/api/auth/sign-in`,
        createRequest("POST", signInData)
      );
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.data).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
          expiresIn: expect.any(Number),
          role: expect.any(String),
        })
      );
    });

    test("Token Refresh", async () => {
      const { refreshToken } = await setupUser(testUsers.member);
      const refreshData = {
        refreshToken: refreshToken,
      };
      const response = await fetch(
        `${BASE_URL}/api/auth/refresh-token`,
        createRequest("POST", refreshData)
      );
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.data).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
          expiresIn: expect.any(Number),
          role: expect.any(String),
        })
      );
    });
  });

  // ========== ANONYMOUS USER TESTS ==========
  describe("Anonymous User Access", () => {
    test("Anonymous can view official bulletins", async () => {
      const response = await fetch(
        `${BASE_URL}/api/bulletins/official`,
        createRequest("GET")
      );
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            createdById: expect.any(String),
            createdByUsername: expect.any(String),
            createdAt: expect.any(String),
          }),
        ])
      );
    });

    test("Anonymous can view specific official bulletin", async () => {
      const officialBulletinId = await getOfficialBulletinId();
      const response = await fetch(
        `${BASE_URL}/api/bulletins/official/${officialBulletinId}`,
        createRequest("GET")
      );
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.data).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          createdById: expect.any(String),
          createdByUsername: expect.any(String),
          createdAt: expect.any(String),
          content: expect.any(String),
        })
      );
    });

    test("Anonymous cannot view member bulletins", async () => {
      const response = await fetch(
        `${BASE_URL}/api/bulletins/member`,
        createRequest("GET")
      );
      expect(response.status).toBe(401);
    });

    test("Anonymous cannot access profile", async () => {
      const response = await fetch(
        `${BASE_URL}/api/profile`,
        createRequest("GET")
      );
      expect(response.status).toBe(401);
    });
  });

  // ========== MEMBER USER JOURNEY ==========
  describe("Member User Complete Journey", () => {
    test("Member can view official bulletins", async () => {
      const { accessToken } = await setupUser(testUsers.member);
      const response = await fetch(
        `${BASE_URL}/api/bulletins/official`,
        createAuthRequest("GET", accessToken)
      );
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            title: expect.any(String),
            createdById: expect.any(String),
            createdByUsername: expect.any(String),
            createdAt: expect.any(String),
          }),
        ])
      );
    });

    test("Member can view member bulletins", async () => {
      const { accessToken } = await setupUser(testUsers.member);
      const response = await fetch(
        `${BASE_URL}/api/bulletins/member`,
        createAuthRequest("GET", accessToken)
      );
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            category: expect.stringMatching(/Interest|Event|Update/),
            id: expect.any(String),
            title: expect.any(String),
            createdById: expect.any(String),
            createdByUsername: expect.any(String),
            createdAt: expect.any(String),
          }),
        ])
      );
    });

    test("Member can create Interest bulletin", async () => {
      const { accessToken } = await setupUser(testUsers.member);
      const newBulletin = {
        title: "Test Interest Bulletin",
        content: "This is a test bulletin for interests",
        category: "Interest",
      };
      const response = await fetch(
        `${BASE_URL}/api/bulletins/member`,
        createAuthRequest("POST", accessToken, newBulletin)
      );
      expect(response.status).toBe(201);
      const result = await response.json();
      expect(result.data).toEqual(
        expect.objectContaining({
          category: "Interest",
          id: expect.any(String),
          title: expect.any(String),
          createdById: expect.any(String),
          createdByUsername: expect.any(String),
          createdAt: expect.any(String),
        })
      );
    });

    test("Member can create Event bulletin", async () => {
      const { accessToken } = await setupUser(testUsers.member);
      const newBulletin = {
        title: "Test Event Bulletin",
        content: "This is a test bulletin for events",
        category: "Event",
      };
      const response = await fetch(
        `${BASE_URL}/api/bulletins/member`,
        createAuthRequest("POST", accessToken, newBulletin)
      );
      expect(response.status).toBe(201);
      const result = await response.json();
      expect(result.data).toEqual(
        expect.objectContaining({
          category: "Event",
          id: expect.any(String),
          title: expect.any(String),
          createdById: expect.any(String),
          createdByUsername: expect.any(String),
          createdAt: expect.any(String),
        })
      );
    });

    test("Member can create Update bulletin", async () => {
      const { accessToken } = await setupUser(testUsers.member);
      const newBulletin = {
        title: "Test Update Bulletin",
        content: "This is a test bulletin for updates",
        category: "Update",
      };
      const response = await fetch(
        `${BASE_URL}/api/bulletins/member`,
        createAuthRequest("POST", accessToken, newBulletin)
      );
      expect(response.status).toBe(201);
      const result = await response.json();
      expect(result.data).toEqual(
        expect.objectContaining({
          category: "Update",
          id: expect.any(String),
          title: expect.any(String),
          createdById: expect.any(String),
          createdByUsername: expect.any(String),
          createdAt: expect.any(String),
        })
      );
    });

    test("Member can view and edit own bulletin", async () => {
      const { accessToken } = await setupUser(testUsers.member);

      // Create a bulletin first
      const newBulletin = {
        title: "Test Interest Bulletin",
        content: "This is a test bulletin for interests",
        category: "Interest",
      };
      const createResponse = await fetch(
        `${BASE_URL}/api/bulletins/member`,
        createAuthRequest("POST", accessToken, newBulletin)
      );
      const createResult = await createResponse.json();
      const bulletinId = createResult.data.id;

      // View the bulletin
      const viewResponse = await fetch(
        `${BASE_URL}/api/bulletins/member/${bulletinId}`,
        createAuthRequest("GET", accessToken)
      );
      expect(viewResponse.status).toBe(200);
      const viewResult = await viewResponse.json();
      expect(viewResult.data).toEqual(
        expect.objectContaining({
          id: bulletinId,
          title: "Test Interest Bulletin",
          content: "This is a test bulletin for interests",
          category: "Interest",
        })
      );

      // Edit the bulletin
      const editResponse = await fetch(
        `${BASE_URL}/api/bulletins/member/${bulletinId}`,
        createAuthRequest("PUT", accessToken, {
          title: "Updated Interest Bulletin",
          content: "This bulletin has been updated",
          category: "Interest",
        })
      );
      expect(editResponse.status).toBe(200);
      const editResult = await editResponse.json();
      expect(editResult.data).toEqual(
        expect.objectContaining({
          id: bulletinId,
          title: "Updated Interest Bulletin",
          content: "This bulletin has been updated",
          category: "Interest",
        })
      );
    });
  });

  // ========== PROFILE MANAGEMENT TESTS ==========
  describe("Profile Management Journey", () => {
    test("Member can retrieve profile", async () => {
      const { accessToken } = await setupUser(testUsers.member);
      const response = await fetch(
        `${BASE_URL}/api/profile`,
        createAuthRequest("GET", accessToken)
      );
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.data).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          username: expect.any(String),
          firstName: expect.any(String),
          lastName: expect.any(String),
          email: expect.any(String),
          role: "Member",
          membershipDate: expect.any(String),
          myBulletins: expect.arrayContaining([
            expect.objectContaining({
              category: expect.stringMatching(/Interest|Event|Update/),
              id: expect.any(String),
              title: expect.any(String),
              createdById: expect.any(String),
              createdByUsername: expect.any(String),
              createdAt: expect.any(String),
            }),
          ]),
        })
      );
    });

    test("Member can update profile", async () => {
      const { accessToken } = await setupUser(testUsers.member);
      const response = await fetch(
        `${BASE_URL}/api/profile`,
        createAuthRequest("PUT", accessToken, {
          firstName: "Updated",
          lastName: "User",
          email: "updated@example.com",
        })
      );
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.data).toEqual(
        expect.objectContaining({
          firstName: "Updated",
          lastName: "User",
          email: "updated@example.com",
          role: "Member",
        })
      );
    });

    test("Member can get profile settings", async () => {
      const { accessToken } = await setupUser(testUsers.member);
      const response = await fetch(
        `${BASE_URL}/api/profile/settings`,
        createAuthRequest("GET", accessToken)
      );
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.data).toEqual(
        expect.objectContaining({
          fontSize: expect.any(Number),
          darkMode: expect.any(Boolean),
          enableNotifications: expect.any(Boolean),
        })
      );
    });

    test("Member can update profile settings", async () => {
      const { accessToken } = await setupUser(testUsers.member);
      const response = await fetch(
        `${BASE_URL}/api/profile/settings`,
        createAuthRequest("PUT", accessToken, {
          fontSize: 16,
          darkMode: true,
          enableNotifications: false,
        })
      );
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.data).toEqual(
        expect.objectContaining({
          fontSize: 16,
          darkMode: true,
          enableNotifications: false,
        })
      );
    });
  });

  // ========== ADMIN USER JOURNEY ==========
  describe("Admin User Journey", () => {
    test("Admin can create and edit official bulletin", async () => {
      const adminAuthResult = await signInUser(
        testUsers.admin.username,
        testUsers.admin.password
      );
      const adminToken = adminAuthResult.accessToken;

      // Create official bulletin
      const createResponse = await fetch(
        `${BASE_URL}/api/bulletins/official`,
        createAuthRequest("POST", adminToken, {
          title: "Official Announcement",
          content: "This is an official bulletin from SeniorLearn",
        })
      );
      expect(createResponse.status).toBe(201);
      const createResult = await createResponse.json();
      expect(createResult.data).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          createdById: expect.any(String),
          createdByUsername: expect.any(String),
          createdAt: expect.any(String),
        })
      );
      const bulletinId = createResult.data.id;

      // Edit official bulletin
      const editResponse = await fetch(
        `${BASE_URL}/api/bulletins/official/${bulletinId}`,
        createAuthRequest("PUT", adminToken, {
          title: "Updated Official Announcement",
          content: "This official bulletin has been updated",
        })
      );
      expect(editResponse.status).toBe(200);
      const editResult = await editResponse.json();
      expect(editResult.data).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: "Updated Official Announcement",
          content: "This official bulletin has been updated",
        })
      );
    });

    test("Admin can moderate member bulletin", async () => {
      const { accessToken: memberToken } = await setupUser(testUsers.member);

      const adminAuthResult = await signInUser(
        testUsers.admin.username,
        testUsers.admin.password
      );
      const adminToken = adminAuthResult.accessToken;

      // Create a member bulletin first
      const newBulletin = {
        title: "Member Bulletin for Moderation",
        content: "This bulletin will be moderated",
        category: "Interest",
      };
      const createResponse = await fetch(
        `${BASE_URL}/api/bulletins/member`,
        createAuthRequest("POST", memberToken, newBulletin)
      );
      const createResult = await createResponse.json();
      const bulletinId = createResult.data.id;

      // Admin moderates the bulletin
      const moderateResponse = await fetch(
        `${BASE_URL}/api/bulletins/member/${bulletinId}`,
        createAuthRequest("PUT", adminToken, {
          title: "Moderated Interest Bulletin",
          content: "This content has been moderated by admin",
          category: "Interest",
        })
      );
      expect(moderateResponse.status).toBe(200);
      const moderateResult = await moderateResponse.json();
      expect(moderateResult.data).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: "Moderated Interest Bulletin",
          content: "This content has been moderated by admin",
        })
      );
    });
  });

  // ========== INPUT VALIDATION TESTS ==========
  describe("Input Validation Tests", () => {
    test("Bulletin creation fails without title", async () => {
      const { accessToken } = await setupUser(testUsers.member);
      const response = await fetch(
        `${BASE_URL}/api/bulletins/member`,
        createAuthRequest("POST", accessToken, {
          content: "Content without title",
          category: "Interest",
        })
      );
      expect(response.status).toBe(400);
    });

    test("Bulletin creation fails without content", async () => {
      const { accessToken } = await setupUser(testUsers.member);
      const response = await fetch(
        `${BASE_URL}/api/bulletins/member`,
        createAuthRequest("POST", accessToken, {
          title: "Title without content",
          category: "Interest",
        })
      );
      expect(response.status).toBe(400);
    });

    test("Bulletin creation fails with invalid category", async () => {
      const { accessToken } = await setupUser(testUsers.member);
      const response = await fetch(
        `${BASE_URL}/api/bulletins/member`,
        createAuthRequest("POST", accessToken, {
          title: "Test Title",
          content: "Test Content",
          category: "InvalidCategory",
        })
      );
      expect(response.status).toBe(400);
    });
  });

  // ========== AUTHORIZATION TESTS ==========
  describe("Authorization Tests", () => {
    test("Member cannot edit other member's bulletin", async () => {
      const { accessToken: memberToken } = await setupUser(testUsers.member);
      const existingBulletinId = await getMemberBulletinId(memberToken);
      const response = await fetch(
        `${BASE_URL}/api/bulletins/member/${existingBulletinId}`,
        createAuthRequest("PUT", memberToken, {
          title: "Unauthorized Edit",
          content: "This should not be allowed",
          category: "Interest",
        })
      );
      expect(response.status).toBe(404);
    });

    test("Member cannot create official bulletin", async () => {
      const { accessToken } = await setupUser(testUsers.member);
      const response = await fetch(
        `${BASE_URL}/api/bulletins/official`,
        createAuthRequest("POST", accessToken, {
          title: "Unauthorized Official Bulletin",
          content: "Members should not be able to create this",
        })
      );
      expect(response.status).toBe(403);
    });
  });

  // ========== ERROR HANDLING TESTS ==========
  describe("Error Handling Tests", () => {
    test("Returns 404 for non-existent bulletin", async () => {
      const { accessToken } = await setupUser(testUsers.member);
      const response = await fetch(
        `${BASE_URL}/api/bulletins/member/non-existent-id`,
        createAuthRequest("GET", accessToken)
      );
      expect(response.status).toBe(404);
    });

    test("Returns 401 for expired/invalid token", async () => {
      const response = await fetch(
        `${BASE_URL}/api/profile`,
        createAuthRequest("GET", "invalid-token")
      );
      expect(response.status).toBe(401);
    });
  });

  // ========== CLEANUP TESTS ==========
  describe("Cleanup", () => {
    test("Member can delete own bulletin and sign out", async () => {
      const { accessToken, refreshToken } = await setupUser(testUsers.member);

      // Create a bulletin to delete
      const createResponse = await fetch(
        `${BASE_URL}/api/bulletins/member`,
        createAuthRequest("POST", accessToken, {
          title: "Bulletin to Delete",
          content: "This bulletin will be deleted",
          category: "Interest",
        })
      );
      const createResult = await createResponse.json();
      const bulletinId = createResult.data.id;

      // Delete the bulletin
      const deleteResponse = await fetch(
        `${BASE_URL}/api/bulletins/member/${bulletinId}`,
        createAuthRequest("DELETE", accessToken)
      );
      expect(deleteResponse.status).toBe(204);

      // Sign out
      const signOutResponse = await fetch(
        `${BASE_URL}/api/auth/sign-out`,
        createAuthRequest("POST", accessToken, {
          refreshToken: refreshToken,
        })
      );
      expect(signOutResponse.status).toBe(200);
    });

    test("Admin can delete official bulletin and sign out", async () => {
      const adminAuthResult = await signInUser(
        testUsers.admin.username,
        testUsers.admin.password
      );
      const adminToken = adminAuthResult.accessToken;
      const adminRefreshToken = adminAuthResult.refreshToken;

      // Create official bulletin to delete
      const createResponse = await fetch(
        `${BASE_URL}/api/bulletins/official`,
        createAuthRequest("POST", adminToken, {
          title: "Official Bulletin to Delete",
          content: "This official bulletin will be deleted",
        })
      );
      const createResult = await createResponse.json();
      const bulletinId = createResult.data.id;

      // Delete official bulletin
      const deleteResponse = await fetch(
        `${BASE_URL}/api/bulletins/official/${bulletinId}`,
        createAuthRequest("DELETE", adminToken)
      );
      expect(deleteResponse.status).toBe(204);

      // Admin sign out
      const signOutResponse = await fetch(
        `${BASE_URL}/api/auth/sign-out`,
        createAuthRequest("POST", adminToken, {
          refreshToken: adminRefreshToken,
        })
      );
      expect(signOutResponse.status).toBe(200);
    });
  });
});
