import strapi from '@strapi/strapi';
import { EVENT_TEMPLATES, DEFAULT_TEMPLATE } from './data/event-templates';

async function seedEvents() {
  console.log('🌱 Starting event data enrichment...');

  let app;
  try {
    // Bootstrap Strapi
    app = await strapi.createStrapi({ distDir: './dist' }).load();
    
    // Fetch all events using Document Service
    const events = await app.documents('api::event.event').findMany({
      populate: ['categories', 'tags', 'comments']
    });

    console.log(`Found ${events.length} events to process.`);

    for (const event of events) {
      console.log(`\nProcessing event: "${event.title}" (DocumentID: ${event.documentId})`);

      // Find matching template based on keywords in title
      const template = EVENT_TEMPLATES.find(t => 
        t.keywords.some(keyword => event.title.toLowerCase().includes(keyword))
      ) || DEFAULT_TEMPLATE;

      const updateData: any = {};
      const isDummyEvent = event.title.toLowerCase().includes('dummy');

      // Update excerpt if missing, short, or it's a dummy event
      if (!event.excerpt || event.excerpt.length < 50 || isDummyEvent) {
        updateData.excerpt = template.excerpt;
        console.log(`- Updating excerpt (Markdown)`);
      }

      // Update content if missing, minimal, or it's a dummy event
      if (!event.content || event.content.length < 200 || isDummyEvent) {
        updateData.content = template.content;
        console.log(`- Updating content (Markdown)`);
      }

      // Update categories if missing
      if (!event.categories || event.categories.length === 0) {
        updateData.categories = template.categories;
        console.log(`- Adding categories: ${template.categories.map(c => c.name).join(', ')}`);
      }

      // Update tags if missing
      if (!event.tags || event.tags.length === 0) {
        updateData.tags = template.tags;
        console.log(`- Adding tags: ${template.tags.map(t => t.name).join(', ')}`);
      }

      // Update comments if missing or it's a dummy event
      if (!event.comments || event.comments.length === 0 || isDummyEvent) {
        updateData.comments = (template.comments || []).map(comment => ({
          ...comment,
          ipAddress: '127.0.0.1',
          userAgent: 'Mozilla/5.0 (Seed Script)',
          status: 'approved'
        }));
        console.log(`- Adding ${updateData.comments.length} dummy comments`);
      }

      // Fill in metadata if missing
      if (!event.metaTitle || isDummyEvent) {
        updateData.metaTitle = event.title.substring(0, 70);
        console.log(`- Setting metaTitle`);
      }
      if (!event.metaDescription || isDummyEvent) {
        updateData.metaDescription = (event.excerpt || template.excerpt).substring(0, 160);
        console.log(`- Setting metaDescription`);
      }

      // Fill in other fields
      if (!event.author || event.author === 'Admin User' || isDummyEvent) {
        updateData.author = 'SONA Editorial Team';
        console.log(`- Setting author`);
      }
      
      if (event.viewCount === 0 || event.viewCount === undefined || event.viewCount < 100 || isDummyEvent) {
        updateData.viewCount = Math.floor(Math.random() * 1000) + 500;
        console.log(`- Setting random viewCount`);
      }

      // Perform update if there's anything to change
      if (Object.keys(updateData).length > 0) {
        try {
          await app.documents('api::event.event').update({
            documentId: event.documentId,
            data: updateData
          });
          console.log(`✅ Successfully updated event ${event.documentId}`);
        } catch (updateError: any) {
          console.error(`❌ Failed to update event ${event.documentId}:`, updateError.message);
          if (updateError.details) {
            console.error('Error details:', JSON.stringify(updateError.details, null, 2));
          }
        }
      } else {
        console.log(`⏭️ No updates needed for event ${event.documentId}`);
      }
    }

    console.log('\n✨ Event enrichment complete!');
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

seedEvents();
