/**
 * Seed script for populating institution banners.
 * This script can be run to create sample institution data with banners for development.
 *
 * Usage: npx ts-node scripts/seed-institution-banners.ts
 */

interface InstitutionSeedData {
  name: string;
  bannerTitle: string;
  bannerSubtitle?: string;
  bannerImagePath?: string; // Path to local image file
}

/**
 * Sample institution data for development and testing.
 * Add more institutions as needed for testing different banner scenarios.
 */
const SEED_INSTITUTIONS: InstitutionSeedData[] = [
  {
    name: "SONA Tech School",
    bannerTitle: "Welcome to SONA TECH SCHOOL",
    bannerSubtitle: "Pioneering Technology Education for Tomorrow's Digital Leaders",
    bannerImagePath: "public/uploads/banners/tech-school-banner.jpg",
  },
  {
    name: "SONA Business School",
    bannerTitle: "Welcome to SONA BUSINESS SCHOOL",
    bannerSubtitle: "Developing Future Business Leaders with Global Perspective",
    bannerImagePath: "public/uploads/banners/business-school-banner.jpg",
  },
  {
    name: "SONA Finishing School",
    bannerTitle: "Welcome to SONA FINISHING SCHOOL",
    bannerSubtitle: "Excellence in Professional Development and Etiquette",
    bannerImagePath: "public/uploads/banners/finishing-school-banner.jpg",
  },
  {
    name: "AI Consultancy",
    bannerTitle: "Welcome to AI CONSULTANCY",
    bannerSubtitle: "Cutting-Edge AI Solutions for Modern Enterprises",
    bannerImagePath: "public/uploads/banners/ai-consultancy-banner.jpg",
  },
  {
    name: "Contract to Hire",
    bannerTitle: "Welcome to CONTRACT TO HIRE",
    bannerSubtitle: "Building Tomorrow's Workforce Through Strategic Partnerships",
    bannerImagePath: "public/uploads/banners/contract-to-hire-banner.jpg",
  },
];

/**
 * Main seed function.
 * This would be called when running the seed script.
 */
export async function seedInstitutionBanners() {
  console.log("🌱 Starting institution banner seed...");

  try {
    // Check if Strapi is available
    const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337";
    const response = await fetch(`${strapiUrl}/api/health`, {
      method: "GET",
    }).catch(() => null);

    if (!response || !response.ok) {
      console.error("❌ Strapi server not available at", strapiUrl, "- Make sure Strapi is running");
      process.exit(1);
    }

    console.log("✅ Strapi server is running");
    console.log(
      "📝 To complete banner seeding, you need to:\n" +
        "1. Manually upload banner images to Strapi media library\n" +
        "2. Note the media IDs from Strapi admin panel\n" +
        "3. Create institutions via API with the following template:\n"
    );

    // Print API examples for creating institutions
    SEED_INSTITUTIONS.forEach((institution, index) => {
      const curl = `
curl -X POST http://localhost:1337/api/institutions \\
  -H "Content-Type: application/json" \\
  -d '{
    "data": {
      "name": "${institution.name}",
      "bannerTitle": "${institution.bannerTitle}",
      "bannerSubtitle": "${institution.bannerSubtitle || ""}",
      "bannerImage": <MEDIA_ID>
    }
  }'
`;

      console.log(`\n📌 Institution ${index + 1}: ${institution.name}`);
      console.log(curl);
    });

    console.log("\n💡 Tip: Get MEDIA_ID by uploading images in Strapi Media Library and noting the numeric ID.");
    console.log("✅ Seed instructions complete!");
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
}

// Run seed if this script is executed directly
if (require.main === module) {
  seedInstitutionBanners();
}

export default seedInstitutionBanners;

