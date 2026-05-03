const { app } = require("@azure/functions");

app.http("optionsHandler", {
    methods: ["OPTIONS"],
    authLevel: "anonymous",
    route: "{*any}",
    handler: async (request, context) => {
        context.log("OPTIONS handled by function");

        return {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:8080",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        };
    }
});
