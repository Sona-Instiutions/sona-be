import type { Schema, Struct } from '@strapi/strapi';

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

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'content.bullet-item': ContentBulletItem;
    }
  }
}
