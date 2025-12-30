export default {
  routes: [
    {
      method: "POST",
      path: "/blogs/:id/increment-view",
      handler: "blog.incrementView",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/blogs/:id/comments",
      handler: "blog.getComments",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/blogs/:id/comments",
      handler: "blog.addComment",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/blogs/suggestions",
      handler: "blog.suggestions",
      config: {
        auth: false,
      },
    },
  ],
};


