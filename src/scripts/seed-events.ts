import { Core } from '@strapi/strapi';
import { EVENT_TEMPLATES, DEFAULT_TEMPLATE } from './data/event-templates';

export async function seedEvents(strapi: Core.Strapi) {
  strapi.log.info('🌱 Starting event data enrichment...');

  try {
    // Fetch all events using Document Service
    const events = await strapi.documents('api::event.event').findMany({
      populate: ['categories', 'tags', 'comments']
    });

    strapi.log.info(`Found ${events.length} events to process.`);

    for (const event of events) {
      strapi.log.info(`\nProcessing event: "${event.title}" (DocumentID: ${event.documentId})`);

      // Find matching template based on keywords in title
      const template = EVENT_TEMPLATES.find(t => 
        t.keywords.some(keyword => event.title.toLowerCase().includes(keyword))
      ) || DEFAULT_TEMPLATE;

      const updateData: any = {};
      const isDummyEvent = event.title.toLowerCase().includes('dummy');

      // Update excerpt if missing, short, or it's a dummy event
      if (!event.excerpt || event.excerpt.length < 50 || isDummyEvent) {
        updateData.excerpt = template.excerpt;
        strapi.log.info(`- Updating excerpt (Markdown)`);
      }

      // Update content if missing, minimal, or it's a dummy event
      if (!event.content || event.content.length < 200 || isDummyEvent) {
        updateData.content = template.content;
        strapi.log.info(`- Updating content (Markdown)`);
      }

      // Update categories if missing
      if (!event.categories || event.categories.length === 0) {
        updateData.categories = template.categories;
        strapi.log.info(`- Adding categories: ${template.categories.map(c => c.name).join(', ')}`);
      }

      // Update tags if missing
      if (!event.tags || event.tags.length === 0) {
        updateData.tags = template.tags;
        strapi.log.info(`- Adding tags: ${template.tags.map(t => t.name).join(', ')}`);
      }

      // Update comments if missing or it's a dummy event
      if (!event.comments || event.comments.length === 0 || isDummyEvent) {
        updateData.comments = (template.comments || []).map(comment => ({
          ...comment,
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0 (Seed Script)',
          status: 'approved'
        }));
        strapi.log.info(`- Adding ${updateData.comments.length} dummy comments`);
      }

      // Fill in metadata if missing
      if (!event.metaTitle || isDummyEvent) {
        updateData.metaTitle = event.title.substring(0, 70);
        strapi.log.info(`- Setting metaTitle`);
      }
      if (!event.metaDescription || isDummyEvent) {
        updateData.metaDescription = (event.excerpt || template.excerpt).substring(0, 160);
        strapi.log.info(`- Setting metaDescription`);
      }

      // Fill in other fields
      if (!event.author || event.author === 'Admin User' || isDummyEvent) {
        updateData.author = 'SONA Editorial Team';
        strapi.log.info(`- Setting author`);
      }
      
      if (event.viewCount === 0 || event.viewCount === undefined || event.viewCount < 100 || isDummyEvent) {
        updateData.viewCount = Math.floor(Math.random() * 1000) + 500;
        strapi.log.info(`- Setting random viewCount`);
      }

      // Perform update if there's anything to change
      if (Object.keys(updateData).length > 0) {
        try {
          await strapi.documents('api::event.event').update({
            documentId: event.documentId,
            data: updateData
          });
          strapi.log.info(`✅ Successfully updated event ${event.documentId}`);
        } catch (updateError: any) {
          strapi.log.error(`❌ Failed to update event ${event.documentId}: ${updateError.message}`);
          if (updateError.details) {
            strapi.log.error(`Error details: ${JSON.stringify(updateError.details, null, 2)}`);
          }
        }
      } else {
        strapi.log.info(`⏭️ No updates needed for event ${event.documentId}`);
      }
    }

    strapi.log.info('\n✨ Event enrichment complete!');
  } catch (error) {
    strapi.log.error(`❌ Error during seeding: ${error}`);
  }
}

