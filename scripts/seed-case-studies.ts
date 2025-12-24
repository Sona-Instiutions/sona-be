import strapi from '@strapi/strapi';
import {
  CASE_STUDY_TEMPLATES,
  DEFAULT_CASE_STUDY_TEMPLATE,
} from './data/case-study-templates';

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

// Generate a random date within the past 12 months
function getRandomDate(monthsBack = 12): string {
  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setMonth(now.getMonth() - monthsBack);
  
  const randomTime =
    pastDate.getTime() +
    Math.random() * (now.getTime() - pastDate.getTime());
  const randomDate = new Date(randomTime);
  
  return randomDate.toISOString().split('T')[0];
}

async function seedCaseStudies() {
  console.log('🌱 Starting case study data seeding...');

  let app;
  try {
    // Bootstrap Strapi
    app = await strapi.createStrapi({ distDir: './dist' }).load();

    // Fetch all case studies using Document Service
    const existingCaseStudies = await app.documents('api::case-study.case-study').findMany({
      populate: ['categories', 'tags', 'comments'],
    });

    console.log(`Found ${existingCaseStudies.length} existing case studies.`);

    // If we have case studies but fewer than templates, delete and recreate
    const shouldRecreate = existingCaseStudies.length > 0 && existingCaseStudies.length < CASE_STUDY_TEMPLATES.length;
    
    if (shouldRecreate) {
      console.log(`\n🗑️  Deleting ${existingCaseStudies.length} existing case studies to recreate from templates...`);
      for (const caseStudy of existingCaseStudies) {
        try {
          await app.documents('api::case-study.case-study').delete({
            documentId: caseStudy.documentId,
          });
          console.log(`  ✓ Deleted: "${caseStudy.title}"`);
        } catch (deleteError: any) {
          console.error(`  ✗ Failed to delete "${caseStudy.title}":`, deleteError.message);
        }
      }
      console.log('✅ All existing case studies deleted.\n');
    }

    if (existingCaseStudies.length === 0 || shouldRecreate) {
      // Create new case studies from templates
      console.log('\n📝 Creating new case studies from templates...');
      
      for (const template of CASE_STUDY_TEMPLATES) {
        const publishedDate = getRandomDate(6);
        const projectDate = getRandomDate(18); // Project finished earlier
        const readTime = template.readTime || calculateReadTime(template.content);

        const caseStudyData: any = {
          title: template.title,
          slug: generateSlug(template.title),
          excerpt: template.excerpt,
          content: template.content.trim(),
          publishedDate, // Optional but good for dummy data
          projectDate,   // Optional but good for dummy data
          readTime,
          author: template.author.name,
          authorRole: template.author.role,
          authorBio: template.author.bio,
          authorEmail: template.author.email,
          featured: template.featured,
          viewCount: Math.floor(Math.random() * 2000) + 50,
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
            publishedAt: getRandomDate(1),
          })),
        };

        // Add social links if available
        if (template.author.linkedin) {
          caseStudyData.authorLinkedin = template.author.linkedin;
        }
        if (template.author.twitter) {
          caseStudyData.authorTwitter = template.author.twitter;
        }

        try {
          const created = await app.documents('api::case-study.case-study').create({
            data: caseStudyData,
          });
          console.log(
            `✅ Created case study: "${template.title}" (DocumentID: ${created.documentId})`
          );
        } catch (createError: any) {
          console.error(
            `❌ Failed to create case study "${template.title}":`,
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

      console.log('\n✨ Case study creation complete!');
    } else {
      // Enrich existing case studies
      console.log('\n🔄 Enriching existing case studies...');

      for (const caseStudy of existingCaseStudies) {
        console.log(
          `\nProcessing case study: "${caseStudy.title}" (DocumentID: ${caseStudy.documentId})`
        );

        // Find matching template based on keywords in title
        const template =
          CASE_STUDY_TEMPLATES.find((t) =>
            caseStudy.title.toLowerCase().includes(t.title.toLowerCase().split(' ')[0].toLowerCase())
          ) || DEFAULT_CASE_STUDY_TEMPLATE;

        const updateData: any = {};
        const isDummy =
          caseStudy.title.toLowerCase().includes('dummy') ||
          caseStudy.title.toLowerCase().includes('test');

        // Update slug if missing or it's a dummy
        if (!caseStudy.slug || isDummy) {
          updateData.slug = generateSlug(caseStudy.title);
          console.log(`- Setting slug: ${updateData.slug}`);
        }

        // Update fields if missing or it's a dummy
        if (!caseStudy.excerpt || caseStudy.excerpt.length < 50 || isDummy) {
          updateData.excerpt = template.excerpt;
          console.log(`- Updating excerpt`);
        }

        if (!caseStudy.content || caseStudy.content.length < 200 || isDummy) {
          updateData.content = template.content.trim();
          console.log(`- Updating content`);
        }

        if (!caseStudy.publishedDate || isDummy) {
          updateData.publishedDate = getRandomDate(6);
          console.log(`- Setting publishedDate`);
        }

        if (!caseStudy.projectDate || isDummy) {
          updateData.projectDate = getRandomDate(18);
          console.log(`- Setting projectDate`);
        }

        if (!caseStudy.readTime || isDummy) {
          const content = caseStudy.content || template.content;
          updateData.readTime = calculateReadTime(content);
          console.log(`- Setting readTime: ${updateData.readTime} minutes`);
        }

        if (!caseStudy.author || caseStudy.author === 'Admin User' || isDummy) {
          updateData.author = template.author.name;
          updateData.authorRole = template.author.role;
          updateData.authorBio = template.author.bio;
          updateData.authorEmail = template.author.email;
          if (template.author.linkedin) updateData.authorLinkedin = template.author.linkedin;
          if (template.author.twitter) updateData.authorTwitter = template.author.twitter;
          console.log(`- Setting author information`);
        }

        if (caseStudy.featured === undefined || isDummy) {
          updateData.featured = template.featured;
          console.log(`- Setting featured: ${template.featured}`);
        }

        if (!caseStudy.categories || caseStudy.categories.length === 0) {
          updateData.categories = template.categories;
          console.log(`- Adding categories`);
        }

        if (!caseStudy.tags || caseStudy.tags.length === 0) {
          updateData.tags = template.tags;
          console.log(`- Adding tags`);
        }

        // Perform update if there's anything to change
        if (Object.keys(updateData).length > 0) {
          try {
            await app.documents('api::case-study.case-study').update({
              documentId: caseStudy.documentId,
              data: updateData,
            });
            console.log(`✅ Successfully updated case study ${caseStudy.documentId}`);
          } catch (updateError: any) {
            console.error(
              `❌ Failed to update case study ${caseStudy.documentId}:`,
              updateError.message
            );
          }
        } else {
          console.log(`⏭️ No updates needed`);
        }
      }

      console.log('\n✨ Case study enrichment complete!');
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

seedCaseStudies();

