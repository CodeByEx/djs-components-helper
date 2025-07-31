import type {
  TextDisplayBuilder,
  SectionBuilder,
  ContainerBuilder,
  SeparatorBuilder,
  MediaGalleryBuilder,
  FileBuilder,
  ButtonBuilder,
  UserSelectMenuBuilder,
  RoleSelectMenuBuilder,
  MentionableSelectMenuBuilder,
  StringSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  ActionRowBuilder,
  ButtonStyle,
  SeparatorSpacingSize,
  APIAllowedMentions
} from 'discord.js';

// Base component configuration
export interface ComponentConfig {
  type: 'text' | 'button' | 'select' | 'section' | 'container' | 'separator' | 'media' | 'file';
  [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// Specific component configurations
export interface TextComponentConfig extends ComponentConfig {
  type: 'text';
  content: string;
  id?: number;
}

export interface ButtonComponentConfig extends ComponentConfig {
  type: 'button';
  customId: string;
  label: string;
  style: ButtonStyle | 'primary' | 'secondary' | 'success' | 'danger' | 'link';
  url?: string;
  emoji?: string;
  disabled?: boolean;
  id?: number;
}

export interface SelectComponentConfig extends ComponentConfig {
  type: 'select';
  customId: string;
  selectType: 'string' | 'user' | 'role' | 'channel' | 'mentionable';
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
  disabled?: boolean;
  id?: number;
  options?: Array<{
    label: string;
    value: string;
    description?: string;
    emoji?: string;
    default?: boolean;
  }>;
  channelTypes?: number[];
}

export interface SeparatorComponentConfig extends ComponentConfig {
  type: 'separator';
  divider?: boolean;
  spacing?: SeparatorSpacingSize;
  id?: number;
}

export interface SectionComponentConfig extends ComponentConfig {
  type: 'section';
  text: string | string[];
  accessory?: SectionAccessory;
  id?: number;
}

// Text display options
export interface TextOptions {
  id?: number;
  allowedMentions?: APIAllowedMentions;
}

// Accessory types for sections
export interface ButtonAccessory {
  type: 'button';
  customId: string;
  label: string;
  style: ButtonStyle | 'primary' | 'secondary' | 'success' | 'danger' | 'link';
  url?: string;
  emoji?: string;
  disabled?: boolean;
  id?: number;
}

export interface ThumbnailAccessory {
  type: 'thumbnail';
  url: string;
  description?: string;
  spoiler?: boolean;
  id?: number;
}

export type SectionAccessory = ButtonAccessory | ThumbnailAccessory;

// Section options
export interface SectionOptions {
  text: string | string[];
  accessory?: SectionAccessory;
  id?: number;
}

// Container options
export interface ContainerOptions {
  accentColor?: number;
  children: ComponentConfig[];
  spoiler?: boolean;
  id?: number;
}

// Separator options
export interface SeparatorOptions {
  divider?: boolean;
  spacing?: SeparatorSpacingSize;
  id?: number;
}

// Button options
export interface ButtonOptions {
  customId: string;
  label: string;
  style: ButtonStyle | 'primary' | 'secondary' | 'success' | 'danger' | 'link';
  url?: string;
  emoji?: string;
  disabled?: boolean;
  id?: number;
}

// Thumbnail options
export interface ThumbnailOptions {
  url: string;
  description?: string;
  spoiler?: boolean;
  id?: number;
}

// Media gallery item
export interface MediaItem {
  url: string;
  description?: string;
  spoiler?: boolean;
}

// File options
export interface FileOptions {
  url: string;
  spoiler?: boolean;
  id?: number;
}

// Select menu base options
export interface BaseSelectMenuOptions {
  customId: string;
  placeholder?: string;
  minValues?: number;
  maxValues?: number;
  disabled?: boolean;
  id?: number;
}

// String select menu options
export interface StringSelectMenuOptions extends BaseSelectMenuOptions {
  type: 'string';
  options: {
    label: string;
    value: string;
    description?: string;
    emoji?: string;
    default?: boolean;
  }[];
}

// User select menu options
export interface UserSelectMenuOptions extends BaseSelectMenuOptions {
  type: 'user';
}

// Role select menu options
export interface RoleSelectMenuOptions extends BaseSelectMenuOptions {
  type: 'role';
}

// Channel select menu options
export interface ChannelSelectMenuOptions extends BaseSelectMenuOptions {
  type: 'channel';
  channelTypes?: number[];
}

// Mentionable select menu options
export interface MentionableSelectMenuOptions extends BaseSelectMenuOptions {
  type: 'mentionable';
}

// Union type for all select menu options
export type SelectMenuOptions = 
  | StringSelectMenuOptions
  | UserSelectMenuOptions
  | RoleSelectMenuOptions
  | ChannelSelectMenuOptions
  | MentionableSelectMenuOptions;

// Message builder options
export interface MessageBuilderOptions {
  maxComponents?: number;
  maxTextLength?: number;
}

// Migration helper types
export interface EmbedMigrationOptions {
  title?: string;
  description?: string;
  color?: string | number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  thumbnail?: string;
  image?: string;
  footer?: {
    text: string;
    iconURL?: string;
  };
  timestamp?: Date | string;
}

// Color utilities
export interface ColorConversion {
  hex: string;
  int: number;
  rgb: [number, number, number];
}

// Component builder result
export type ComponentBuilder = 
  | TextDisplayBuilder
  | SectionBuilder
  | ContainerBuilder
  | SeparatorBuilder
  | MediaGalleryBuilder
  | FileBuilder
  | ButtonBuilder
  | ActionRowBuilder
  | UserSelectMenuBuilder
  | RoleSelectMenuBuilder
  | MentionableSelectMenuBuilder
  | StringSelectMenuBuilder
  | ChannelSelectMenuBuilder;

// Validation result
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Component limits
export interface ComponentLimits {
  maxComponents: number;
  maxTextLength: number;
  maxSelectOptions: number;
  maxMediaItems: number;
} 