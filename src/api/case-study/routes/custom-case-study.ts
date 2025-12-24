export default {
  routes: [
    {
      method: 'POST',
      path: '/case-studies/:id/view',
      handler: 'case-study.incrementViewCount',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/case-studies/:id/comments',
      handler: 'case-study.addComment',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
