import type { Schema, Struct } from '@strapi/strapi';

export interface ServiceServiceBlock extends Struct.ComponentSchema {
  collectionName: 'components_service_service_blocks';
  info: {
    displayName: 'Service Block';
    icon: 'briefcase';
  };
  attributes: {
    keywords: Schema.Attribute.Component<'service.service-text-pair', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 3;
          min: 1;
        },
        number
      >;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ServiceServiceTextPair extends Struct.ComponentSchema {
  collectionName: 'components_service_service_text_pairs';
  info: {
    displayName: 'Service Keyword';
    icon: 'attachment';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'service.service-block': ServiceServiceBlock;
      'service.service-text-pair': ServiceServiceTextPair;
    }
  }
}
