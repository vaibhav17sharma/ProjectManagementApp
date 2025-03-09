import { type SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "project-management-app",
      region: "ap-south-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        environment: {
          DATABASE_URL: process.env.DATABASE_URL!,
          AUTH_SECRET: process.env.AUTH_SECRET!,
          NEXT_AUTH_URL: process.env.NEXT_AUTH_URL!,
          ADMINS: process.env.ADMINS!,
        }, 
        customDomain: {
          domainName: "taskmanagement.vaibdev.com",
          domainAlias: "www.taskmanagement.vaibdev.com",
        },
        timeout: 30,
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;