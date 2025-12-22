export default {
  async beforeCreate(event) {
    const { data } = event.params;

    // Only apply rule for replies
    if (!data.parent) return;

    // Count existing replies for this parent
    const existingReplies = await strapi.entityService.count(
      "api::comment.comment",
      {
        filters: {
          parent: data.parent,
        },
      }
    );

    if (existingReplies >= 1) {
      throw new Error(
        "Only one reply is allowed for a comment."
      );
    }
  },
};
