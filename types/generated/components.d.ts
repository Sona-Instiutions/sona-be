import type { Schema, Struct } from '@strapi/strapi';

export interface ContentAchievementItem extends Struct.ComponentSchema {
  collectionName: 'components_content_achievement_items';
  info: {
    displayName: 'Achievement Item';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    order: Schema.Attribute.Integer;
    statistic: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 25;
      }>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface ContentBulletItem extends Struct.ComponentSchema {
  collectionName: 'components_content_bullet_items';
  info: {
    description: 'Bullet point with markdown content and icon reference';
    displayName: 'Bullet Item';
    icon: 'bulletList';
  };
  attributes: {
    icon: Schema.Attribute.Relation<'oneToOne', 'api::icon-badge.icon-badge'> &
      Schema.Attribute.Required;
    text: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface ContentCampusGalleryColumn extends Struct.ComponentSchema {
  collectionName: 'components_content_campus_gallery_columns';
  info: {
    description: 'Column containing exactly two gallery images';
    displayName: 'Campus Gallery Column';
    icon: 'columns';
  };
  attributes: {
    images: Schema.Attribute.Component<'content.campus-gallery-image', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 2;
          min: 2;
        },
        number
      >;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
  };
}

export interface ContentCampusGalleryImage extends Struct.ComponentSchema {
  collectionName: 'components_content_campus_gallery_images';
  info: {
    description: 'Image tile used in the campus gallery collage';
    displayName: 'Campus Gallery Image';
    icon: 'images';
  };
  attributes: {
    altText: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    layoutVariant: Schema.Attribute.Enumeration<['square', 'tall', 'wide']> &
      Schema.Attribute.DefaultTo<'square'>;
  };
}

export interface ContentPartnershipItem extends Struct.ComponentSchema {
  collectionName: 'components_content_partnership_items';
  info: {
    description: '';
    displayName: 'Partnership Item';
    icon: 'handshake';
  };
  attributes: {
    backgroundColor: Schema.Attribute.String;
    companyLogo: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    companyName: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContentRecognitionItem extends Struct.ComponentSchema {
  collectionName: 'components_content_recognition_items';
  info: {
    description: 'Recognition card highlighting awards and certifications';
    displayName: 'Recognition Item';
    icon: 'award';
  };
  attributes: {
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
    icon: Schema.Attribute.Relation<'oneToOne', 'api::icon-badge.icon-badge'> &
      Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 120;
      }>;
  };
}

export interface ContentTestimonialItem extends Struct.ComponentSchema {
  collectionName: 'components_content_testimonial_items';
  info: {
    description: '';
    displayName: 'Testimonial Item';
    icon: 'quote';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'>;
    company: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
    role: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContentValuePropositionItem extends Struct.ComponentSchema {
  collectionName: 'components_content_value_proposition_items';
  info: {
    description: 'Value proposition card with icon, description, and optional order';
    displayName: 'Value Proposition Item';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.RichText & Schema.Attribute.Required;
    icon: Schema.Attribute.Relation<'oneToOne', 'api::icon-badge.icon-badge'> &
      Schema.Attribute.Required;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    titleColor: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 50;
      }> &
      Schema.Attribute.DefaultTo<'#fbbf24'>;
  };
}

export interface SectionsProgramSection extends Struct.ComponentSchema {
  collectionName: 'components_sections_program_sections';
  info: {
    description: 'Section within a program';
    displayName: 'Program Section';
    icon: 'layer-group';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    icon: Schema.Attribute.Relation<'oneToOne', 'api::icon-badge.icon-badge'>;
    learnMoreIsExternal: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    learnMoreText: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 100;
      }> &
      Schema.Attribute.DefaultTo<'Learn More'>;
    learnMoreUrl: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    order: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 255;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.achievement-item': ContentAchievementItem;
      'content.bullet-item': ContentBulletItem;
      'content.campus-gallery-column': ContentCampusGalleryColumn;
      'content.campus-gallery-image': ContentCampusGalleryImage;
      'content.partnership-item': ContentPartnershipItem;
      'content.recognition-item': ContentRecognitionItem;
      'content.testimonial-item': ContentTestimonialItem;
      'content.value-proposition-item': ContentValuePropositionItem;
      'sections.program-section': SectionsProgramSection;
    }
  }
}
