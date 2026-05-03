const { app } = require("@azure/functions");
const { corsHeaders } = require("./cors");

app.http("optionsHandler", {
    methods: ["OPTIONS"],
    authLevel: "anonymous",
    route: "{*any}",
    handler: async () => {
        return {
            status: 204,
            headers: corsHeaders()
        };
    }
});
