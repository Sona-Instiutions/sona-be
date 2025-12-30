import { Core } from '@strapi/strapi';
import {
  BLOG_TEMPLATES,
  DEFAULT_BLOG_TEMPLATE,
} from './data/blog-templates';

// Calculate read time based on content (average 200 words per minute)
function calculateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// Generate a URL-friendly slug from a title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
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

export async function seedBlogs(strapi: Core.Strapi) {
  strapi.log.info('🌱 Starting blog data seeding...');

  try {
    // Fetch all blogs using Document Service
    const existingBlogs = await strapi.documents('api::blog.blog').findMany({
      populate: ['categories', 'tags', 'comments'],
    });

    strapi.log.info(`Found ${existingBlogs.length} existing blogs.`);

    // If we have blogs but fewer than templates, delete and recreate
    const shouldRecreate = existingBlogs.length > 0 && existingBlogs.length < BLOG_TEMPLATES.length;
    
    if (shouldRecreate) {
      strapi.log.info(`\n🗑️  Deleting ${existingBlogs.length} existing blogs to recreate from templates...`);
      for (const blog of existingBlogs) {
        try {
          await strapi.documents('api::blog.blog').delete({
            documentId: blog.documentId,
          });
          strapi.log.info(`  ✓ Deleted: "${blog.title}"`);
        } catch (deleteError: any) {
          strapi.log.error(`  ✗ Failed to delete "${blog.title}": ${deleteError.message}`);
        }
      }
      strapi.log.info('✅ All existing blogs deleted.\n');
    }

    if (existingBlogs.length === 0 || shouldRecreate) {
      // Create new blogs from templates
      strapi.log.info('\n📝 Creating new blogs from templates...');
      
      for (let i = 0; i < BLOG_TEMPLATES.length; i++) {
        const template = BLOG_TEMPLATES[i];
        const publishedDate = getRandomPublishedDate();
        const readTime = template.readTime || calculateReadTime(template.content);

        const blogData: any = {
          title: template.title,
          slug: generateSlug(template.title),
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
        };

        // Add social links if available
        if (template.author.linkedin) {
          blogData.authorLinkedin = template.author.linkedin;
        }
        if (template.author.twitter) {
          blogData.authorTwitter = template.author.twitter;
        }

        try {
          const created = await strapi.documents('api::blog.blog').create({
            data: blogData,
          });
          strapi.log.info(
            `✅ Created blog: "${template.title}" (DocumentID: ${created.documentId})`
          );
        } catch (createError: any) {
          strapi.log.error(
            `❌ Failed to create blog "${template.title}": ${createError.message}`
          );
          if (createError.details) {
            strapi.log.error(
              `Error details: ${JSON.stringify(createError.details, null, 2)}`
            );
          }
        }
      }

      strapi.log.info('\n✨ Blog creation complete!');
    } else {
      // Enrich existing blogs
      strapi.log.info('\n🔄 Enriching existing blogs...');

      for (const blog of existingBlogs) {
        strapi.log.info(
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
        const isDummyBlog = true; // Force update to apply new templates

        // Update slug if missing or it's a dummy blog
        if (!blog.slug || isDummyBlog) {
          updateData.slug = generateSlug(blog.title);
          strapi.log.info(`- Setting slug: ${updateData.slug}`);
        }

        // Update excerpt if missing, short, or it's a dummy blog
        if (!blog.excerpt || blog.excerpt.length < 50 || isDummyBlog) {
          updateData.excerpt = template.excerpt;
          strapi.log.info(`- Updating excerpt`);
        }

        // Update content if missing, minimal, or it's a dummy blog
        if (!blog.content || blog.content.length < 200 || isDummyBlog) {
          updateData.content = template.content.trim();
          strapi.log.info(`- Updating content`);
        }

        // Update publishedDate if missing
        if (!blog.publishedDate || isDummyBlog) {
          updateData.publishedDate = getRandomPublishedDate();
          strapi.log.info(`- Setting publishedDate`);
        }

        // Update readTime if missing or needs recalculation
        if (!blog.readTime || isDummyBlog) {
          const content = blog.content || template.content;
          updateData.readTime = calculateReadTime(content);
          strapi.log.info(`- Setting readTime: ${updateData.readTime} minutes`);
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
          strapi.log.info(`- Setting author information`);
        }

        // Update featured flag (set some blogs as featured)
        if (blog.featured === undefined || isDummyBlog) {
          updateData.featured = template.featured;
          strapi.log.info(`- Setting featured: ${template.featured}`);
        }

        // Update viewCount if low or missing
        if (
          blog.viewCount === 0 ||
          blog.viewCount === undefined ||
          blog.viewCount < 100 ||
          isDummyBlog
        ) {
          updateData.viewCount = Math.floor(Math.random() * 5000) + 100;
          strapi.log.info(`- Setting viewCount: ${updateData.viewCount}`);
        }

        // Update categories if missing
        if (!blog.categories || blog.categories.length === 0) {
          updateData.categories = template.categories;
          strapi.log.info(
            `- Adding categories: ${template.categories.map((c) => c.name).join(', ')}`
          );
        }

        // Update tags if missing
        if (!blog.tags || blog.tags.length === 0) {
          updateData.tags = template.tags;
          strapi.log.info(
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
          strapi.log.info(`- Adding ${updateData.comments.length} comments`);
        }

        // Update metadata if missing
        if (!blog.metaTitle || isDummyBlog) {
          updateData.metaTitle =
            template.metaTitle || blog.title.substring(0, 70);
          strapi.log.info(`- Setting metaTitle`);
        }
        if (!blog.metaDescription || isDummyBlog) {
          updateData.metaDescription =
            template.metaDescription ||
            (blog.excerpt || template.excerpt).substring(0, 160);
          strapi.log.info(`- Setting metaDescription`);
        }

        // Perform update if there's anything to change
        if (Object.keys(updateData).length > 0) {
          try {
            await strapi.documents('api::blog.blog').update({
              documentId: blog.documentId,
              data: updateData,
            });
            strapi.log.info(`✅ Successfully updated blog ${blog.documentId}`);
          } catch (updateError: any) {
            strapi.log.error(
              `❌ Failed to update blog ${blog.documentId}: ${updateError.message}`
            );
            if (updateError.details) {
              strapi.log.error(
                `Error details: ${JSON.stringify(updateError.details, null, 2)}`
              );
            }
          }
        } else {
          strapi.log.info(`⏭️ No updates needed for blog ${blog.documentId}`);
        }
      }

      strapi.log.info('\n✨ Blog enrichment complete!');
    }
  } catch (error) {
    strapi.log.error(`❌ Error during seeding: ${error}`);
  }
}


