export default {
  routes: [
    {
      method: "POST",
      path: "/events/:id/increment-view",
      handler: "event.incrementView",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/events/:id/comments",
      handler: "event.getComments",
      config: {
        auth: false,
      },
    },
    {
      method: "POST",
      path: "/events/:id/comments",
      handler: "event.addComment",
      config: {
        auth: false,
      },
    },
  ],
};
