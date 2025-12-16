import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksAboutUs extends Struct.ComponentSchema {
  collectionName: 'components_blocks_aboutuses';
  info: {
    displayName: 'AboutUs';
  };
  attributes: {
    media: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    text: Schema.Attribute.Blocks;
    theme: Schema.Attribute.Enumeration<['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']> &
      Schema.Attribute.DefaultTo<'DARK'>;
    title: Schema.Attribute.String;
  };
}

export interface BlocksCallToAction extends Struct.ComponentSchema {
  collectionName: 'components_blocks_call_to_actions';
  info: {
    displayName: 'CallToAction';
  };
  attributes: {
    button: Schema.Attribute.Component<'elements.button', false>;
    description: Schema.Attribute.String;
    theme: Schema.Attribute.Enumeration<['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']> &
      Schema.Attribute.DefaultTo<'BRAND'>;
    title: Schema.Attribute.String;
  };
}

export interface BlocksCarousel extends Struct.ComponentSchema {
  collectionName: 'components_blocks_carousels';
  info: {
    displayName: 'Carousel';
  };
  attributes: {
    button: Schema.Attribute.Component<'elements.button', false>;
    card: Schema.Attribute.Component<'elements.short-text', true>;
    description: Schema.Attribute.Text;
    theme: Schema.Attribute.Enumeration<['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']> &
      Schema.Attribute.DefaultTo<'LIGHT'>;
    title: Schema.Attribute.String;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    displayName: 'Hero';
  };
  attributes: {
    description: Schema.Attribute.Text;
    media: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    primaryButton: Schema.Attribute.Component<'elements.button', false>;
    secondaryButton: Schema.Attribute.Component<'elements.button', false>;
    theme: Schema.Attribute.Enumeration<['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']> &
      Schema.Attribute.DefaultTo<'LIGHT'>;
    titleBottomHighlighted: Schema.Attribute.String;
    titleBottomUnhighlighted: Schema.Attribute.String;
    titleTopHighlighted: Schema.Attribute.String;
    titleTopUnhighlighted: Schema.Attribute.String;
  };
}

export interface BlocksProcessTable extends Struct.ComponentSchema {
  collectionName: 'components_blocks_process_tables';
  info: {
    displayName: 'ProcessTable';
  };
  attributes: {
    description: Schema.Attribute.Text;
    leftTable: Schema.Attribute.Enumeration<
      ['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']
    > &
      Schema.Attribute.DefaultTo<'NEUTRAL'>;
    rightTable: Schema.Attribute.Enumeration<
      ['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']
    > &
      Schema.Attribute.DefaultTo<'DARK'>;
    step: Schema.Attribute.Component<'process.step', true>;
    text: Schema.Attribute.Blocks;
    theme: Schema.Attribute.Enumeration<['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']> &
      Schema.Attribute.DefaultTo<'LIGHT'>;
    title: Schema.Attribute.String;
  };
}

export interface BlocksTeam extends Struct.ComponentSchema {
  collectionName: 'components_blocks_teams';
  info: {
    displayName: 'Team';
  };
  attributes: {
    teamMembers: Schema.Attribute.Relation<
      'oneToMany',
      'api::team-member.team-member'
    >;
    theme: Schema.Attribute.Enumeration<['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']> &
      Schema.Attribute.DefaultTo<'LIGHT'>;
    title: Schema.Attribute.String;
  };
}

export interface BlocksTeamPreview extends Struct.ComponentSchema {
  collectionName: 'components_blocks_team_previews';
  info: {
    displayName: 'TeamPreview';
  };
  attributes: {
    button: Schema.Attribute.Component<'elements.button', false>;
    description: Schema.Attribute.Text;
    team_members: Schema.Attribute.Relation<
      'oneToMany',
      'api::team-member.team-member'
    >;
    theme: Schema.Attribute.Enumeration<['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']> &
      Schema.Attribute.DefaultTo<'DARK'>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsButton extends Struct.ComponentSchema {
  collectionName: 'components_elements_buttons';
  info: {
    displayName: 'Button';
  };
  attributes: {
    link: Schema.Attribute.String;
    shape: Schema.Attribute.Enumeration<['ROUNDED', 'RECTANGULAR']>;
    style: Schema.Attribute.Enumeration<['FILLED', 'OUTLINED']>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsShortText extends Struct.ComponentSchema {
  collectionName: 'components_elements_short_texts';
  info: {
    displayName: 'ShortText';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

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

export interface ProcessStep extends Struct.ComponentSchema {
  collectionName: 'components_process_steps';
  info: {
    displayName: 'Step';
  };
  attributes: {
    description: Schema.Attribute.Text;
    symbol: Schema.Attribute.Media<'images' | 'files'>;
    title: Schema.Attribute.String;
  };
}

export interface SeoSeo extends Struct.ComponentSchema {
  collectionName: 'components_seo_seos';
  info: {
    displayName: 'SEO';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text;
    metaImage: Schema.Attribute.Media<'images' | 'files'>;
    metaTitle: Schema.Attribute.String;
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
      'blocks.about-us': BlocksAboutUs;
      'blocks.call-to-action': BlocksCallToAction;
      'blocks.carousel': BlocksCarousel;
      'blocks.hero': BlocksHero;
      'blocks.process-table': BlocksProcessTable;
      'blocks.team': BlocksTeam;
      'blocks.team-preview': BlocksTeamPreview;
      'elements.button': ElementsButton;
      'elements.short-text': ElementsShortText;
      'faq.question-block': FaqQuestionBlock;
      'faq.topic-question-block': FaqTopicQuestionBlock;
      'process.process-step': ProcessProcessStep;
      'process.step': ProcessStep;
      'seo.seo': SeoSeo;
      'service.service-block': ServiceServiceBlock;
      'service.service-text-pair': ServiceServiceTextPair;
      'why-atlatl.grid-block': WhyAtlatlGridBlock;
    }
  }
}
