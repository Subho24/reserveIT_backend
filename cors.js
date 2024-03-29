const allowedOrigins = ["http://localhost:3000", "https://reserveit.se"];

const corsOptions = {
	origin: (origin, callback) => {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"), false);
		}
	},
	optionsSuccessStatus: 200,
	credentials: true,
};

module.exports = corsOptions;