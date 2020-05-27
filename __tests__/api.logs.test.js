const apiLogs = require("../api/logs");

let reqStatus;
const resMock = {
  status: (code) => (reqStatus = code),
  end: (text) => text,
};

const headers = { authorization: "__test_valid_token__" };

describe("api", () => {
  describe("logs", () => {
    beforeEach(() => {
      reqStatus = undefined;
      process.env.AUTH0_LOG_STREAM_TOKEN = undefined;
    });

    it("should fail if no body was sent", async () => {
      await apiLogs({ body: null, headers: {} }, resMock);
      expect(reqStatus).toEqual(400);
    });

    it("should fail if body is not an array", async () => {
      await apiLogs({ body: {}, headers: {} }, resMock);
      expect(reqStatus).toEqual(400);
    });

    it("should fail if env requires a token but request does not", async () => {
      process.env.AUTH0_LOG_STREAM_TOKEN = "__test_valid_token__";
      await apiLogs({ body: [], headers: {} }, resMock);
      expect(reqStatus).toEqual(401);
    });

    it("should fail if the token sent does not match env", async () => {
      process.env.AUTH0_LOG_STREAM_TOKEN = "__test_valid_token__";
      await apiLogs(
        { body: [], headers: { authorization: "__test_invalid_token__" } },
        resMock
      );
      expect(reqStatus).toEqual(401);
    });

    it("should succeed with no action if body is empty", async () => {
      process.env.AUTH0_LOG_STREAM_TOKEN = "__test_valid_token__";
      await apiLogs({ body: [], headers }, resMock);

      expect(reqStatus).toEqual(204);
    });

    it("should succeed with no action if body does not contain a failed log", async () => {
      process.env.AUTH0_LOG_STREAM_TOKEN = "__test_valid_token__";
      const body = [{ data: { type: "x" } }];
      await apiLogs({ body, headers }, resMock);

      expect(reqStatus).toEqual(204);
    });
  });
});
