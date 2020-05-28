jest.mock("got");

const apiLogs = require("../api/logs");

const resMock = {
  status: jest.fn((code) => code),
  end: jest.fn((body) => body),
};

const headers = { authorization: "__test_valid_token__" };

describe("api", () => {
  describe("logs", () => {
    beforeEach(() => {
      process.env.AUTH0_LOG_STREAM_TOKEN = undefined;
    });

    it("should fail if no body was sent", async () => {
      await apiLogs({ body: null, headers: {} }, resMock);
      expect(resMock.status.mock.calls).toHaveLength(1);
      expect(resMock.status.mock.calls[0][0]).toEqual(400);
      expect(resMock.end.mock.calls).toHaveLength(1);
      expect(resMock.end.mock.calls[0][0]).toBeUndefined();
    });

    it("should fail if body is not an array", async () => {
      await apiLogs({ body: {}, headers: {} }, resMock);
      expect(resMock.status.mock.calls).toHaveLength(1);
      expect(resMock.status.mock.calls[0][0]).toEqual(400);
      expect(resMock.end.mock.calls).toHaveLength(1);
      expect(resMock.end.mock.calls[0][0]).toBeUndefined();
    });

    it("should fail if env requires a token but request does not", async () => {
      process.env.AUTH0_LOG_STREAM_TOKEN = "__test_valid_token__";
      await apiLogs({ body: [], headers: {} }, resMock);
      expect(resMock.status.mock.calls).toHaveLength(1);
      expect(resMock.status.mock.calls[0][0]).toEqual(401);
      expect(resMock.end.mock.calls).toHaveLength(1);
      expect(resMock.end.mock.calls[0][0]).toBeUndefined();
    });

    it("should fail if the token sent does not match env", async () => {
      process.env.AUTH0_LOG_STREAM_TOKEN = "__test_valid_token__";
      await apiLogs(
        { body: [], headers: { authorization: "__test_invalid_token__" } },
        resMock
      );
      expect(resMock.status.mock.calls).toHaveLength(1);
      expect(resMock.status.mock.calls[0][0]).toEqual(401);
      expect(resMock.end.mock.calls).toHaveLength(1);
      expect(resMock.end.mock.calls[0][0]).toBeUndefined();
    });

    it("should succeed with no action if body is empty", async () => {
      process.env.AUTH0_LOG_STREAM_TOKEN = "__test_valid_token__";
      await apiLogs({ body: [], headers }, resMock);

      expect(resMock.status.mock.calls).toHaveLength(1);
      expect(resMock.status.mock.calls[0][0]).toEqual(204);
      expect(resMock.end.mock.calls).toHaveLength(1);
      expect(resMock.end.mock.calls[0][0]).toBeUndefined();
    });

    it("should succeed with no action if body does not contain a failed log", async () => {
      process.env.AUTH0_LOG_STREAM_TOKEN = "__test_valid_token__";
      const body = [{ data: { type: "x" } }];
      await apiLogs({ body, headers }, resMock);

      expect(resMock.status.mock.calls).toHaveLength(1);
      expect(resMock.status.mock.calls[0][0]).toEqual(204);
      expect(resMock.end.mock.calls).toHaveLength(1);
      expect(resMock.end.mock.calls[0][0]).toBeUndefined();
    });

    it("should call the Slack URL with a specific paylod", async () => {
      process.env.AUTH0_LOG_STREAM_TOKEN = "__test_valid_token__";
      process.env.SLACK_WEBHOOK_URL = "__test_webhook_url__";
      const body = [{ data: { type: "f" } }];
      await apiLogs({ body, headers }, resMock);

      expect(resMock.status.mock.calls).toHaveLength(1);
      expect(resMock.status.mock.calls[0][0]).toEqual(200);
      expect(resMock.end.mock.calls).toHaveLength(1);
      expect(resMock.end.mock.calls[0][0].url).toEqual("__test_webhook_url__");
      expect(resMock.end.mock.calls[0][0].opts.json.attachments).toHaveLength(
        1
      );
    });
  });
});
