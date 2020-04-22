let request = require("supertest");

describe("Load Freschissimo and check example config", function () {
  var server;

  beforeEach(function () {
    server = require("../index");
  });

  it("responds to /freschissimo", function testConfiguration(done) {
    request(server).get("/freschissimo").expect(200, done);
  });
});
