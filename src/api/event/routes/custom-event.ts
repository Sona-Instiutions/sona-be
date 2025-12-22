export default {
  routes: [
    {
      method: 'POST',
      path: '/events/:id/increment-view',
      handler: 'event.incrementView',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};

