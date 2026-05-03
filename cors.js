const { app } = require("@azure/functions");

app.http("corsHandler", {
    methods: ["OPTIONS"],
    authLevel: "anonymous",
    route: "{*any}",
    handler: async () => {
        return {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        };
    }
});
