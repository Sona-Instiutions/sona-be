import { Core } from "@strapi/strapi";
import { CASE_STUDY_TEMPLATES, DEFAULT_CASE_STUDY_TEMPLATE } from "./data/case-study-templates";

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
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Generate a random date within the past 12 months
function getRandomDate(monthsBack = 12): string {
  const now = new Date();
  const pastDate = new Date(now);
  pastDate.setMonth(now.getMonth() - monthsBack);

  const randomTime = pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime());
  const randomDate = new Date(randomTime);

  return randomDate.toISOString().split("T")[0];
}

export async function seedCaseStudies(strapi: Core.Strapi) {
  strapi.log.info("🌱 Starting case study data seeding...");

  try {
    // Fetch all case studies using Document Service
    const existingCaseStudies = await strapi.documents("api::case-study.case-study").findMany({
      populate: ["categories", "tags", "comments"],
    });

    strapi.log.info(`Found ${existingCaseStudies.length} existing case studies.`);

    // If we have case studies but fewer than templates, delete and recreate
    const shouldRecreate = existingCaseStudies.length > 0 && existingCaseStudies.length < CASE_STUDY_TEMPLATES.length;

    if (shouldRecreate) {
      strapi.log.info(
        `\n🗑️  Deleting ${existingCaseStudies.length} existing case studies to recreate from templates...`
      );
      for (const caseStudy of existingCaseStudies) {
        try {
          await strapi.documents("api::case-study.case-study").delete({
            documentId: caseStudy.documentId,
          });
          strapi.log.info(`  ✓ Deleted: "${caseStudy.title}"`);
        } catch (deleteError: any) {
          strapi.log.error(`  ✗ Failed to delete "${caseStudy.title}": ${deleteError.message}`);
        }
      }
      strapi.log.info("✅ All existing case studies deleted.\n");
    }

    if (existingCaseStudies.length === 0 || shouldRecreate) {
      // Create new case studies from templates
      strapi.log.info("\n📝 Creating new case studies from templates...");

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
          projectDate, // Optional but good for dummy data
          readTime,
          author: template.author.name,
          authorRole: template.author.role,
          authorBio: template.author.bio,
          authorEmail: template.author.email,
          featured: template.featured,
          viewCount: Math.floor(Math.random() * 2000) + 50,
          metaTitle: template.metaTitle || template.title.substring(0, 70),
          metaDescription: template.metaDescription || template.excerpt.substring(0, 160),
          categories: template.categories,
          tags: template.tags,
          comments: template.comments.map((comment) => ({
            ...comment,
            ipAddress: "127.0.0.1",
            userAgent: "Mozilla/5.0 (Seed Script)",
            status: "approved",
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
          const created = await strapi.documents("api::case-study.case-study").create({
            data: caseStudyData,
          });
          strapi.log.info(`✅ Created case study: "${template.title}" (DocumentID: ${created.documentId})`);
        } catch (createError: any) {
          strapi.log.error(`❌ Failed to create case study "${template.title}": ${createError.message}`);
          if (createError.details) {
            strapi.log.error(`Error details: ${JSON.stringify(createError.details, null, 2)}`);
          }
        }
      }

      strapi.log.info("\n✨ Case study creation complete!");
    } else {
      // Enrich existing case studies
      strapi.log.info("\n🔄 Enriching existing case studies...");

      for (const caseStudy of existingCaseStudies) {
        strapi.log.info(`\nProcessing case study: "${caseStudy.title}" (DocumentID: ${caseStudy.documentId})`);

        // Find matching template based on keywords in title
        const template =
          CASE_STUDY_TEMPLATES.find((t) =>
            caseStudy.title.toLowerCase().includes(t.title.toLowerCase().split(" ")[0].toLowerCase())
          ) || DEFAULT_CASE_STUDY_TEMPLATE;

        const updateData: any = {};
        const isDummy =
          caseStudy.title.toLowerCase().includes("dummy") || caseStudy.title.toLowerCase().includes("test");

        // Update slug if missing or it's a dummy
        if (!caseStudy.slug || isDummy) {
          updateData.slug = generateSlug(caseStudy.title);
          strapi.log.info(`- Setting slug: ${updateData.slug}`);
        }

        // Update fields if missing or it's a dummy
        if (!caseStudy.excerpt || caseStudy.excerpt.length < 50 || isDummy) {
          updateData.excerpt = template.excerpt;
          strapi.log.info(`- Updating excerpt`);
        }

        if (!caseStudy.content || caseStudy.content.length < 200 || isDummy) {
          updateData.content = template.content.trim();
          strapi.log.info(`- Updating content`);
        }

        if (!caseStudy.publishedDate || isDummy) {
          updateData.publishedDate = getRandomDate(6);
          strapi.log.info(`- Setting publishedDate`);
        }

        if (!caseStudy.projectDate || isDummy) {
          updateData.projectDate = getRandomDate(18);
          strapi.log.info(`- Setting projectDate`);
        }

        if (!caseStudy.readTime || isDummy) {
          const content = caseStudy.content || template.content;
          updateData.readTime = calculateReadTime(content);
          strapi.log.info(`- Setting readTime: ${updateData.readTime} minutes`);
        }

        if (!caseStudy.author || caseStudy.author === "Admin User" || isDummy) {
          updateData.author = template.author.name;
          updateData.authorRole = template.author.role;
          updateData.authorBio = template.author.bio;
          updateData.authorEmail = template.author.email;
          if (template.author.linkedin) updateData.authorLinkedin = template.author.linkedin;
          if (template.author.twitter) updateData.authorTwitter = template.author.twitter;
          strapi.log.info(`- Setting author information`);
        }

        if (caseStudy.featured === undefined || isDummy) {
          updateData.featured = template.featured;
          strapi.log.info(`- Setting featured: ${template.featured}`);
        }

        if (!caseStudy.categories || caseStudy.categories.length === 0) {
          updateData.categories = template.categories;
          strapi.log.info(`- Adding categories`);
        }

        if (!caseStudy.tags || caseStudy.tags.length === 0) {
          updateData.tags = template.tags;
          strapi.log.info(`- Adding tags`);
        }

        // Perform update if there's anything to change
        if (Object.keys(updateData).length > 0) {
          try {
            await strapi.documents("api::case-study.case-study").update({
              documentId: caseStudy.documentId,
              data: updateData,
            });
            strapi.log.info(`✅ Successfully updated case study ${caseStudy.documentId}`);
          } catch (updateError: any) {
            strapi.log.error(`❌ Failed to update case study ${caseStudy.documentId}: ${updateError.message}`);
          }
        } else {
          strapi.log.info(`⏭️ No updates needed`);
        }
      }

      strapi.log.info("\n✨ Case study enrichment complete!");
    }
  } catch (error) {
    strapi.log.error(`❌ Error during seeding: ${error}`);
  }
}

