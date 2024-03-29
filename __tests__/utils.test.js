const faker = require("faker");

const { prepareSlackMsg } = require("../lib/utils");

describe("utils", () => {
  describe("prepareSlackMsg", () => {
    it("should prepare a default message", () => {
      const result = prepareSlackMsg({});

      expect(result).toHaveProperty("pretext");
      expect(result.pretext).toEqual("*Auth0 log alert*");
      expect(result).toHaveProperty("fallback");
      expect(result.fallback).toEqual("No description [type: undefined]");
      expect(result).toHaveProperty("color");
      expect(result.color).toEqual("#ff0000");
      expect(result).toHaveProperty("title");
      expect(result.title).toEqual("No description [type: undefined]");

      expect(result).not.toHaveProperty("title_link");
      expect(result).not.toHaveProperty("fields");
    });

    it("should include the log type", () => {
      const log = { data: { type: faker.random.word() } };
      const result = prepareSlackMsg(log);

      expect(result).toHaveProperty("fallback");
      expect(result.fallback).toEqual(
        `No description [type: ${log.data.type}]`
      );
      expect(result).toHaveProperty("title");
      expect(result.title).toEqual(`No description [type: ${log.data.type}]`);
    });

    it("should include the log description", () => {
      const log = { data: { description: faker.random.words(10) } };
      const result = prepareSlackMsg(log);

      expect(result).toHaveProperty("fallback");
      expect(result.fallback).toEqual(
        `${log.data.description} [type: undefined]`
      );
    });

    it("should include Client information if a Client ID is present", () => {
      const log = { data: { client_id: faker.random.word() } };
      const result = prepareSlackMsg(log);

      expect(result).toHaveProperty("fields");
      expect(result.fields).toHaveLength(1);
      expect(result.fields[0].title).toEqual("Client");
      expect(result.fields[0].value).toEqual(`None\n\`${log.data.client_id}\``);
    });

    it("should include a Client Name if Client ID and Name are present", () => {
      const log = {
        data: {
          client_name: faker.random.word(),
          client_id: faker.random.word(),
        },
      };
      const result = prepareSlackMsg(log);

      expect(result).toHaveProperty("fields");
      expect(result.fields[0].value).toEqual(
        `${log.data.client_name}\n\`${log.data.client_id}\``
      );
    });

    it("should include log to the log entry if an ID is present", () => {
      const log = { data: { log_id: faker.random.alphaNumeric(20) } };
      const result = prepareSlackMsg(log);

      expect(result).toHaveProperty("title_link");
      expect(result.title_link).toEqual(
        `https://manage.auth0.com/#/logs/${log.data.log_id}`
      );
    });
  });
});
