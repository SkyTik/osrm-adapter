import pino from "pino";

const isDevelopment: boolean = Bun.env.NODE_ENV === "development";

const prettyConfig: { transport: { options: { colorize: boolean }; target: string } } = {
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
};

const logger = isDevelopment ? pino(prettyConfig) : pino({ base: undefined });

export default logger;
