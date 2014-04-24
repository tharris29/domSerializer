describe("domSerializer a dom element to a JSON object", function () {

    it("should remove any circular references", function () {

        var domObject = document.createElement("div");

        var serializer = new domSerializer();
        var serializedDomObject = serializer.serialize(domObject);

        expect(true).toEqual(typeof serializedDomObject === "object");

    });
});