// Main exports
export { MessageBuilder } from './builders/MessageBuilder';
export { ColorUtils } from './utils/ColorUtils';
export { MigrationUtils } from './utils/MigrationUtils';

// Type exports
export type {
  ComponentConfig,
  TextOptions,
  SectionOptions,
  ContainerOptions,
  SeparatorOptions,
  ButtonOptions,
  ThumbnailOptions,
  MediaItem,
  FileOptions,
  SelectMenuOptions,
  MessageBuilderOptions,
  EmbedMigrationOptions,
  ColorConversion,
  ValidationResult,
  ComponentLimits,
  StringSelectMenuOptions,
  UserSelectMenuOptions,
  RoleSelectMenuOptions,
  ChannelSelectMenuOptions,
  MentionableSelectMenuOptions,
  BaseSelectMenuOptions,
  SectionAccessory,
  ButtonAccessory,
  ThumbnailAccessory
} from './types';

// Re-export commonly used Discord.js types for convenience
export type {
  ButtonStyle,
  SeparatorSpacingSize,
  ComponentType,
  APIAllowedMentions
} from 'discord.js';

// Default export for convenience
import { MessageBuilder } from './builders/MessageBuilder';
export default MessageBuilder; 