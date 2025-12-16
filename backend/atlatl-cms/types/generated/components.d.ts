import type { Schema, Struct } from '@strapi/strapi';

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

export interface BlocksCardRow extends Struct.ComponentSchema {
  collectionName: 'components_blocks_card_rows';
  info: {
    displayName: 'CardRow';
  };
  attributes: {
    card: Schema.Attribute.Component<'elements.card', true>;
    themeBottom: Schema.Attribute.Enumeration<
      ['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']
    >;
    themeTop: Schema.Attribute.Enumeration<
      ['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']
    >;
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

export interface BlocksCenteredMedia extends Struct.ComponentSchema {
  collectionName: 'components_blocks_centered_medias';
  info: {
    displayName: 'CenteredMedia';
  };
  attributes: {
    media: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    themeBottom: Schema.Attribute.Enumeration<
      ['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']
    > &
      Schema.Attribute.DefaultTo<'LIGHT'>;
    themeTop: Schema.Attribute.Enumeration<
      ['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']
    > &
      Schema.Attribute.DefaultTo<'LIGHT'>;
  };
}

export interface BlocksDefinition extends Struct.ComponentSchema {
  collectionName: 'components_blocks_definitions';
  info: {
    displayName: 'Definition';
  };
  attributes: {
    description: Schema.Attribute.Text;
    headword: Schema.Attribute.String;
    illustration: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    partOfSpeech: Schema.Attribute.String;
    pronunciation: Schema.Attribute.String;
    theme: Schema.Attribute.Enumeration<['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']> &
      Schema.Attribute.DefaultTo<'DARK'>;
    title: Schema.Attribute.String;
  };
}

export interface BlocksDynamicParagraph extends Struct.ComponentSchema {
  collectionName: 'components_blocks_dynamic_paragraphs';
  info: {
    displayName: 'DynamicParagraph';
  };
  attributes: {
    button: Schema.Attribute.Component<'elements.button', false>;
    Content: Schema.Attribute.Component<
      'elements.dynamic-paragraph-content',
      true
    >;
    media: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    theme: Schema.Attribute.Enumeration<['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']> &
      Schema.Attribute.DefaultTo<'LIGHT'>;
    title: Schema.Attribute.String;
  };
}

export interface BlocksFaq extends Struct.ComponentSchema {
  collectionName: 'components_blocks_faqs';
  info: {
    displayName: 'FAQ';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    theme: Schema.Attribute.Enumeration<['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']> &
      Schema.Attribute.DefaultTo<'LIGHT'>;
    title: Schema.Attribute.String;
    topic: Schema.Attribute.Component<'faq.topic-question-block', true>;
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

export interface BlocksMediaListSplit extends Struct.ComponentSchema {
  collectionName: 'components_blocks_media_list_splits';
  info: {
    displayName: 'MediaListSplit';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    item: Schema.Attribute.Component<'elements.item', true>;
    media: Schema.Attribute.Media<'images' | 'files' | 'videos', true>;
    theme: Schema.Attribute.Enumeration<['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']>;
    title: Schema.Attribute.String;
  };
}

export interface BlocksMediaTextSplit extends Struct.ComponentSchema {
  collectionName: 'components_blocks_media_text_splits';
  info: {
    displayName: 'MediaTextSplit';
  };
  attributes: {
    row: Schema.Attribute.Component<'elements.media-text-split-row', true>;
    theme: Schema.Attribute.Enumeration<['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']> &
      Schema.Attribute.DefaultTo<'NEUTRAL'>;
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

export interface BlocksTitleMediaText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_title_media_texts';
  info: {
    displayName: 'TitleMediaText';
  };
  attributes: {
    media: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    text: Schema.Attribute.RichText;
    theme: Schema.Attribute.Enumeration<['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']> &
      Schema.Attribute.DefaultTo<'LIGHT'>;
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

export interface ElementsCard extends Struct.ComponentSchema {
  collectionName: 'components_elements_cards';
  info: {
    displayName: 'Card';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    media: Schema.Attribute.Media<'files' | 'videos' | 'images'>;
    theme: Schema.Attribute.Enumeration<['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']> &
      Schema.Attribute.DefaultTo<'DARK'>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsDynamicParagraphContent
  extends Struct.ComponentSchema {
  collectionName: 'components_elements_dynamic_paragraph_contents';
  info: {
    displayName: 'DynamicParagraphContent';
  };
  attributes: {
    paragraph: Schema.Attribute.Blocks;
    title: Schema.Attribute.String;
  };
}

export interface ElementsItem extends Struct.ComponentSchema {
  collectionName: 'components_elements_items';
  info: {
    displayName: 'Item';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    media: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    theme: Schema.Attribute.Enumeration<['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']>;
    title: Schema.Attribute.String;
  };
}

export interface ElementsMediaTextSplitRow extends Struct.ComponentSchema {
  collectionName: 'components_elements_media_text_split_rows';
  info: {
    displayName: 'MediaTextSplitRow';
  };
  attributes: {
    description: Schema.Attribute.Blocks;
    media: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    mediaFirst: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    theme: Schema.Attribute.Enumeration<['LIGHT', 'DARK', 'NEUTRAL', 'BRAND']> &
      Schema.Attribute.DefaultTo<'DARK'>;
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
      'blocks.call-to-action': BlocksCallToAction;
      'blocks.card-row': BlocksCardRow;
      'blocks.carousel': BlocksCarousel;
      'blocks.centered-media': BlocksCenteredMedia;
      'blocks.definition': BlocksDefinition;
      'blocks.dynamic-paragraph': BlocksDynamicParagraph;
      'blocks.faq': BlocksFaq;
      'blocks.hero': BlocksHero;
      'blocks.media-list-split': BlocksMediaListSplit;
      'blocks.media-text-split': BlocksMediaTextSplit;
      'blocks.process-table': BlocksProcessTable;
      'blocks.team': BlocksTeam;
      'blocks.team-preview': BlocksTeamPreview;
      'blocks.title-media-text': BlocksTitleMediaText;
      'elements.button': ElementsButton;
      'elements.card': ElementsCard;
      'elements.dynamic-paragraph-content': ElementsDynamicParagraphContent;
      'elements.item': ElementsItem;
      'elements.media-text-split-row': ElementsMediaTextSplitRow;
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
