import type { Schema, Struct } from '@strapi/strapi';

export interface FaqQuestionBlock extends Struct.ComponentSchema {
  collectionName: 'components_faq_question_blocks';
  info: {
    displayName: 'Question Block';
  };
  attributes: {
    answer: Schema.Attribute.RichText & Schema.Attribute.Required;
    question: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface FaqTopicQuestionBlock extends Struct.ComponentSchema {
  collectionName: 'components_faq_topic_question_blocks';
  info: {
    displayName: 'Topic Question Block';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    questionblocks: Schema.Attribute.Component<'faq.question-block', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface ProcessProcessStep extends Struct.ComponentSchema {
  collectionName: 'components_process_process_steps';
  info: {
    displayName: 'Process Step';
    icon: 'arrowRight';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    symbol: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

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

export interface WhyAtlatlGridBlock extends Struct.ComponentSchema {
  collectionName: 'components_why_atlatl_grid_blocks';
  info: {
    displayName: 'Grid Block';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    media: Schema.Attribute.Media<'files' | 'videos' | 'images'> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'faq.question-block': FaqQuestionBlock;
      'faq.topic-question-block': FaqTopicQuestionBlock;
      'process.process-step': ProcessProcessStep;
      'service.service-block': ServiceServiceBlock;
      'service.service-text-pair': ServiceServiceTextPair;
      'why-atlatl.grid-block': WhyAtlatlGridBlock;
    }
  }
}
