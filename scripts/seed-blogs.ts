import strapi from '@strapi/strapi';
import {
  BLOG_TEMPLATES,
  DEFAULT_BLOG_TEMPLATE,
  BlogTemplate,
} from './data/blog-templates';

// Calculate read time based on content (average 200 words per minute)
function calculateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Generate a random date within the past 6 months
function getRandomPublishedDate(): string {
  const now = new Date();
  const sixMonthsAgo = new Date(now);
  sixMonthsAgo.setMonth(now.getMonth() - 6);
  
  const randomTime =
    sixMonthsAgo.getTime() +
    Math.random() * (now.getTime() - sixMonthsAgo.getTime());
  const randomDate = new Date(randomTime);
  
  return randomDate.toISOString().split('T')[0];
}

async function seedBlogs() {
  console.log('🌱 Starting blog data seeding...');

  let app;
  try {
    // Bootstrap Strapi
    app = await strapi.createStrapi({ distDir: './dist' }).load();

    // Fetch all blogs using Document Service
    const existingBlogs = await app.documents('api::blog.blog').findMany({
      populate: ['categories', 'tags', 'comments'],
    });

    console.log(`Found ${existingBlogs.length} existing blogs.`);

    if (existingBlogs.length === 0) {
      // Create new blogs from templates
      console.log('\n📝 Creating new blogs from templates...');
      
      for (let i = 0; i < BLOG_TEMPLATES.length; i++) {
        const template = BLOG_TEMPLATES[i];
        const publishedDate = getRandomPublishedDate();
        const readTime = template.readTime || calculateReadTime(template.content);

        const blogData: any = {
          title: template.title,
          excerpt: template.excerpt,
          content: template.content.trim(),
          publishedDate,
          readTime,
          author: template.author.name,
          authorRole: template.author.role,
          authorBio: template.author.bio,
          authorEmail: template.author.email,
          featured: template.featured,
          viewCount: Math.floor(Math.random() * 5000) + 100,
          metaTitle: template.metaTitle || template.title.substring(0, 70),
          metaDescription:
            template.metaDescription ||
            template.excerpt.substring(0, 160),
          categories: template.categories,
          tags: template.tags,
          comments: template.comments.map((comment) => ({
            ...comment,
            ipAddress: '127.0.0.1',
            userAgent: 'Mozilla/5.0 (Seed Script)',
            status: 'approved',
            likes: comment.likes || Math.floor(Math.random() * 30),
          })),
          publishedAt: publishedDate,
        };

        // Add social links if available
        if (template.author.linkedin) {
          blogData.authorLinkedin = template.author.linkedin;
        }
        if (template.author.twitter) {
          blogData.authorTwitter = template.author.twitter;
        }

        try {
          const created = await app.documents('api::blog.blog').create({
            data: blogData,
          });
          console.log(
            `✅ Created blog: "${template.title}" (DocumentID: ${created.documentId})`
          );
        } catch (createError: any) {
          console.error(
            `❌ Failed to create blog "${template.title}":`,
            createError.message
          );
          if (createError.details) {
            console.error(
              'Error details:',
              JSON.stringify(createError.details, null, 2)
            );
          }
        }
      }

      console.log('\n✨ Blog creation complete!');
    } else {
      // Enrich existing blogs
      console.log('\n🔄 Enriching existing blogs...');

      for (const blog of existingBlogs) {
        console.log(
          `\nProcessing blog: "${blog.title}" (DocumentID: ${blog.documentId})`
        );

        // Find matching template based on keywords in title
        const template =
          BLOG_TEMPLATES.find((t) =>
            t.keywords.some((keyword) =>
              blog.title.toLowerCase().includes(keyword.toLowerCase())
            )
          ) || DEFAULT_BLOG_TEMPLATE;

        const updateData: any = {};
        const isDummyBlog =
          blog.title.toLowerCase().includes('dummy') ||
          blog.title.toLowerCase().includes('test');

        // Update excerpt if missing, short, or it's a dummy blog
        if (!blog.excerpt || blog.excerpt.length < 50 || isDummyBlog) {
          updateData.excerpt = template.excerpt;
          console.log(`- Updating excerpt`);
        }

        // Update content if missing, minimal, or it's a dummy blog
        if (!blog.content || blog.content.length < 200 || isDummyBlog) {
          updateData.content = template.content.trim();
          console.log(`- Updating content`);
        }

        // Update publishedDate if missing
        if (!blog.publishedDate || isDummyBlog) {
          updateData.publishedDate = getRandomPublishedDate();
          console.log(`- Setting publishedDate`);
        }

        // Update readTime if missing or needs recalculation
        if (!blog.readTime || isDummyBlog) {
          const content = blog.content || template.content;
          updateData.readTime = calculateReadTime(content);
          console.log(`- Setting readTime: ${updateData.readTime} minutes`);
        }

        // Update author information if missing
        if (!blog.author || blog.author === 'Admin User' || isDummyBlog) {
          updateData.author = template.author.name;
          updateData.authorRole = template.author.role;
          updateData.authorBio = template.author.bio;
          updateData.authorEmail = template.author.email;
          if (template.author.linkedin) {
            updateData.authorLinkedin = template.author.linkedin;
          }
          if (template.author.twitter) {
            updateData.authorTwitter = template.author.twitter;
          }
          console.log(`- Setting author information`);
        }

        // Update featured flag (set some blogs as featured)
        if (blog.featured === undefined || isDummyBlog) {
          updateData.featured = template.featured;
          console.log(`- Setting featured: ${template.featured}`);
        }

        // Update viewCount if low or missing
        if (
          blog.viewCount === 0 ||
          blog.viewCount === undefined ||
          blog.viewCount < 100 ||
          isDummyBlog
        ) {
          updateData.viewCount = Math.floor(Math.random() * 5000) + 100;
          console.log(`- Setting viewCount: ${updateData.viewCount}`);
        }

        // Update categories if missing
        if (!blog.categories || blog.categories.length === 0) {
          updateData.categories = template.categories;
          console.log(
            `- Adding categories: ${template.categories.map((c) => c.name).join(', ')}`
          );
        }

        // Update tags if missing
        if (!blog.tags || blog.tags.length === 0) {
          updateData.tags = template.tags;
          console.log(
            `- Adding tags: ${template.tags.map((t) => t.name).join(', ')}`
          );
        }

        // Update comments if missing or it's a dummy blog
        if (!blog.comments || blog.comments.length === 0 || isDummyBlog) {
          updateData.comments = (template.comments || []).map((comment) => ({
            ...comment,
            ipAddress: '127.0.0.1',
            userAgent: 'Mozilla/5.0 (Seed Script)',
            status: 'approved',
            likes: comment.likes || Math.floor(Math.random() * 30),
          }));
          console.log(`- Adding ${updateData.comments.length} comments`);
        }

        // Update metadata if missing
        if (!blog.metaTitle || isDummyBlog) {
          updateData.metaTitle =
            template.metaTitle || blog.title.substring(0, 70);
          console.log(`- Setting metaTitle`);
        }
        if (!blog.metaDescription || isDummyBlog) {
          updateData.metaDescription =
            template.metaDescription ||
            (blog.excerpt || template.excerpt).substring(0, 160);
          console.log(`- Setting metaDescription`);
        }

        // Perform update if there's anything to change
        if (Object.keys(updateData).length > 0) {
          try {
            await app.documents('api::blog.blog').update({
              documentId: blog.documentId,
              data: updateData,
            });
            console.log(`✅ Successfully updated blog ${blog.documentId}`);
          } catch (updateError: any) {
            console.error(
              `❌ Failed to update blog ${blog.documentId}:`,
              updateError.message
            );
            if (updateError.details) {
              console.error(
                'Error details:',
                JSON.stringify(updateError.details, null, 2)
              );
            }
          }
        } else {
          console.log(`⏭️ No updates needed for blog ${blog.documentId}`);
        }
      }

      console.log('\n✨ Blog enrichment complete!');
    }
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    if (app) {
      await app.destroy();
    }
    process.exit(0);
  }
}

seedBlogs();

