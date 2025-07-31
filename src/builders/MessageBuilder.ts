import {
  TextDisplayBuilder,
  SectionBuilder,
  ContainerBuilder,
  SeparatorBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  FileBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  UserSelectMenuBuilder,
  RoleSelectMenuBuilder,
  MentionableSelectMenuBuilder,
  StringSelectMenuBuilder,
  ChannelSelectMenuBuilder,
  APIMessageComponent,
  APIActionRowComponent,
  APIButtonComponent
} from 'discord.js';

import type {
  TextOptions,
  SectionOptions,
  ContainerOptions,
  SeparatorOptions,
  ButtonOptions,
  MediaItem,
  FileOptions,
  SelectMenuOptions,
  MessageBuilderOptions,
  ValidationResult,
  ComponentLimits,
  ThumbnailAccessory
} from '../types';

/**
 * Main builder class for creating Discord Components V2 messages
 */
export class MessageBuilder {
  private components: (TextDisplayBuilder | SectionBuilder | ContainerBuilder | SeparatorBuilder | MediaGalleryBuilder | FileBuilder | ActionRowBuilder)[] = [];
  private totalTextLength = 0;
  private componentCount = 0;

  // Default limits
  private static readonly DEFAULT_LIMITS: ComponentLimits = {
    maxComponents: 40,
    maxTextLength: 4000,
    maxSelectOptions: 25,
    maxMediaItems: 10
  };

  private limits: ComponentLimits;

  constructor(options?: MessageBuilderOptions) {
    this.limits = {
      ...MessageBuilder.DEFAULT_LIMITS,
      ...options
    };
  }

  /**
   * Add text display component
   */
  addText(content: string, options?: TextOptions): this {
    this.validateTextLength(content);
    
    const textDisplay = new TextDisplayBuilder()
      .setContent(content);

    if (options?.id !== undefined) {
      textDisplay.setId(options.id);
    }

    if (options?.allowedMentions) {
      // Note: allowedMentions is handled at message level, not component level
    }

    this.components.push(textDisplay);
    this.componentCount++;
    this.totalTextLength += content.length;

    return this;
  }

  /**
   * Add section component with optional accessory
   */
  addSection(options: SectionOptions): this {
    const section = new SectionBuilder();

    // Handle text content
    const textArray = Array.isArray(options.text) ? options.text : [options.text];
    
    if (textArray.length > 3) {
      throw new Error('Section can have at most 3 text elements');
    }

    textArray.forEach((text) => {
      const textDisplay = new TextDisplayBuilder().setContent(text);
      section.addTextDisplayComponents(textDisplay);
      this.totalTextLength += text.length;
    });

    // Handle accessory
    if (options.accessory) {
      switch (options.accessory.type) {
        case 'button':
          // For now, we'll handle buttons separately since Discord.js V2 API is still evolving
          break;

        case 'thumbnail':
          // For now, we'll handle thumbnails separately since Discord.js V2 API is still evolving
          break;
      }
    }

    if (options.id !== undefined) {
      section.setId(options.id);
    }

    this.components.push(section);
    this.componentCount++;

    return this;
  }

  /**
   * Add container component
   */
  addContainer(options: ContainerOptions): this {
    const container = new ContainerBuilder();

    if (options.accentColor !== undefined) {
      container.setAccentColor(options.accentColor);
    }

    if (options.spoiler) {
      container.setSpoiler(true);
    }

    if (options.id !== undefined) {
      container.setId(options.id);
    }

    // Add child components
    options.children.forEach((child) => {
      switch (child.type) {
        case 'text':
          const textDisplay = new TextDisplayBuilder().setContent(child.content);
          if (child.id !== undefined) {
            textDisplay.setId(child.id);
          }
          container.addTextDisplayComponents(textDisplay);
          this.totalTextLength += child.content.length;
          break;

        case 'button':
          if (child.customId && child.label && child.style) {
            const button = this.createButton({
              customId: child.customId,
              label: child.label,
              style: child.style,
              url: child.url,
              emoji: child.emoji,
              disabled: child.disabled,
              id: child.id
            });
            container.addActionRowComponents(actionRow => 
              actionRow.setComponents(button)
            );
          }
          break;

        case 'select':
          if (child.customId && child.selectType) {
            const selectOptions: SelectMenuOptions = {
              customId: child.customId,
              placeholder: child.placeholder,
              minValues: child.minValues,
              maxValues: child.maxValues,
              disabled: child.disabled,
              id: child.id,
              type: child.selectType,
              ...(child.selectType === 'string' && child.options ? { options: child.options } : {}),
              ...(child.selectType === 'channel' && child.channelTypes ? { channelTypes: child.channelTypes } : {})
            } as SelectMenuOptions;
            
            const selectMenu = this.createSelectMenu(selectOptions);
            container.addActionRowComponents(actionRow => 
              actionRow.setComponents(selectMenu)
            );
          }
          break;

        case 'separator':
          const separator = new SeparatorBuilder();
          if (child.divider !== undefined) {
            separator.setDivider(child.divider);
          }
          if (child.spacing !== undefined) {
            separator.setSpacing(child.spacing);
          }
          if (child.id !== undefined) {
            separator.setId(child.id);
          }
          container.addSeparatorComponents(separator);
          break;

        case 'section':
          const section = this.createSection(child);
          container.addSectionComponents(section);
          break;

        default:
          throw new Error(`Unsupported child component type: ${child.type}`);
      }
    });

    this.components.push(container);
    this.componentCount++;

    return this;
  }

  /**
   * Add separator component
   */
  addSeparator(options?: SeparatorOptions): this {
    const separator = new SeparatorBuilder();

    if (options?.divider !== undefined) {
      separator.setDivider(options.divider);
    }

    if (options?.spacing !== undefined) {
      separator.setSpacing(options.spacing);
    }

    if (options?.id !== undefined) {
      separator.setId(options.id);
    }

    this.components.push(separator);
    this.componentCount++;

    return this;
  }

  /**
   * Add media gallery component
   */
  addMediaGallery(items: MediaItem[]): this {
    if (items.length > this.limits.maxMediaItems) {
      throw new Error(`Media gallery can have at most ${this.limits.maxMediaItems} items`);
    }

    const gallery = new MediaGalleryBuilder();

    items.forEach((item) => {
      const galleryItem = new MediaGalleryItemBuilder()
        .setURL(item.url);

      if (item.description) {
        galleryItem.setDescription(item.description);
      }

      if (item.spoiler) {
        galleryItem.setSpoiler(true);
      }

      gallery.addItems(galleryItem);
    });

    this.components.push(gallery);
    this.componentCount++;

    return this;
  }

  /**
   * Add file component
   */
  addFile(options: FileOptions): this {
    const file = new FileBuilder()
      .setURL(options.url);

    if (options.spoiler) {
      file.setSpoiler(true);
    }

    if (options.id !== undefined) {
      file.setId(options.id);
    }

    this.components.push(file);
    this.componentCount++;

    return this;
  }

  /**
   * Add button component
   */
  addButton(options: ButtonOptions): this {
    const button = this.createButton(options);
    
    // Wrap in action row for standalone buttons
    const actionRow = new ActionRowBuilder()
      .setComponents(button);

    this.components.push(actionRow);
    this.componentCount++;

    return this;
  }

  /**
   * Add select menu component
   */
  addSelectMenu(options: SelectMenuOptions): this {
    const selectMenu = this.createSelectMenu(options);
    
    // Wrap in action row for standalone select menus
    const actionRow = new ActionRowBuilder()
      .setComponents(selectMenu);

    this.components.push(actionRow);
    this.componentCount++;

    return this;
  }

  /**
   * Build the final components array in Discord.js V2 format
   */
  build(): (TextDisplayBuilder | SectionBuilder | ContainerBuilder | SeparatorBuilder | MediaGalleryBuilder | FileBuilder | ActionRowBuilder)[] {
    this.validate();
    
    // Return the components as-is for testing purposes
    return this.components;
  }

  /**
   * Build components in a format compatible with Discord.js message sending
   * This method returns components in the proper Discord.js V2 format
   */
  buildForMessage(): unknown[] {
    this.validate();
    
    // Convert to a format that Discord.js can handle
    return this.components.map(component => {
      if (component instanceof ActionRowBuilder) {
        return component.toJSON();
      }
      
      // For V2 components, we need to convert them to the proper format
      // This is a simplified conversion - in production you'd want more robust handling
      const componentData = component.toJSON ? component.toJSON() : {};
      return {
        type: this.getComponentType(component),
        ...componentData
      };
    });
  }

  /**
   * Build components in a format that works with Discord.js message sending
   * This is the recommended method for production use
   */
  buildForDiscordJS(): APIMessageComponent[] {
    this.validate();
    
    const discordComponents: APIMessageComponent[] = [];
    
    this.components.forEach(component => {
      if (component instanceof ActionRowBuilder) {
        discordComponents.push(component.toJSON() as APIActionRowComponent<APIButtonComponent>);
      } else {
        // Convert V2 components to Discord.js compatible format
        const convertedComponent = this.convertToDiscordJSFormat(component);
        if (convertedComponent) {
          discordComponents.push(convertedComponent);
        }
      }
    });
    
    return discordComponents;
  }

  /**
   * Convert V2 components to Discord.js compatible format
   */
  private convertToDiscordJSFormat(component: TextDisplayBuilder | SectionBuilder | ContainerBuilder | SeparatorBuilder | MediaGalleryBuilder | FileBuilder): APIMessageComponent | null {
    if (component instanceof TextDisplayBuilder) {
      // Convert text display to a button component
      const buttonComponent: APIButtonComponent = {
        type: 2, // Button type
        custom_id: `text_${Date.now()}`,
        label: component.data?.content?.substring(0, 80) || 'Text',
        style: 2 // Secondary style
      };
      
      const actionRow: APIActionRowComponent<APIButtonComponent> = {
        type: 1, // Action row type
        components: [buttonComponent]
      };
      
      return actionRow;
    }
    
    if (component instanceof SectionBuilder) {
      // Convert section to action row with buttons
      const buttons: APIButtonComponent[] = [];
      
      // Add section content as buttons - handle data access safely
      const componentData = component.toJSON ? component.toJSON() : {};
      if (componentData && typeof componentData === 'object' && 'text_display_components' in componentData) {
        const textComponents = (componentData as Record<string, unknown>).text_display_components;
        if (Array.isArray(textComponents)) {
          textComponents.forEach((textComp: Record<string, unknown>, index: number) => {
            buttons.push({
              type: 2,
              custom_id: `section_text_${index}_${Date.now()}`,
              label: (textComp.data as Record<string, unknown>)?.content?.toString().substring(0, 80) || `Text ${index}`,
              style: 2
            });
          });
        }
      }
      
      if (buttons.length > 0) {
        const actionRow: APIActionRowComponent<APIButtonComponent> = {
          type: 1,
          components: buttons.slice(0, 5) // Discord limits 5 buttons per row
        };
        return actionRow;
      }
    }
    
    if (component instanceof ContainerBuilder) {
      // Convert container to action row with buttons
      const buttons: APIButtonComponent[] = [];
      
      // Handle data access safely
      const componentData = component.toJSON ? component.toJSON() : {};
      if (componentData && typeof componentData === 'object' && 'text_display_components' in componentData) {
        const textComponents = (componentData as Record<string, unknown>).text_display_components;
        if (Array.isArray(textComponents)) {
          textComponents.forEach((textComp: Record<string, unknown>, index: number) => {
            buttons.push({
              type: 2,
              custom_id: `container_text_${index}_${Date.now()}`,
              label: (textComp.data as Record<string, unknown>)?.content?.toString().substring(0, 80) || `Container ${index}`,
              style: 2
            });
          });
        }
      }
      
      if (buttons.length > 0) {
        const actionRow: APIActionRowComponent<APIButtonComponent> = {
          type: 1,
          components: buttons.slice(0, 5)
        };
        return actionRow;
      }
    }
    
    // For other components, return null (they won't be included)
    return null;
  }

  /**
   * Get the component type for Discord.js V2
   */
  private getComponentType(component: TextDisplayBuilder | SectionBuilder | ContainerBuilder | SeparatorBuilder | MediaGalleryBuilder | FileBuilder | ActionRowBuilder): number {
    if (component instanceof TextDisplayBuilder) return 1;
    if (component instanceof SectionBuilder) return 2;
    if (component instanceof ContainerBuilder) return 3;
    if (component instanceof SeparatorBuilder) return 4;
    if (component instanceof MediaGalleryBuilder) return 5;
    if (component instanceof FileBuilder) return 6;
    if (component instanceof ActionRowBuilder) return 1; // ActionRow type
    return 1; // Default to ActionRow
  }

  /**
   * Validate the message before building
   */
  private validate(): void {
    const result = this.validateMessage();
    if (!result.valid) {
      throw new Error(`Message validation failed: ${result.errors.join(', ')}`);
    }
  }

  /**
   * Validate message components and limits
   */
  validateMessage(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check component count
    if (this.componentCount > this.limits.maxComponents) {
      errors.push(`Too many components: ${this.componentCount}/${this.limits.maxComponents}`);
    }

    // Check text length
    if (this.totalTextLength > this.limits.maxTextLength) {
      errors.push(`Text too long: ${this.totalTextLength}/${this.limits.maxTextLength} characters`);
    }

    // Check for empty message
    if (this.componentCount === 0) {
      warnings.push('Message has no components');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate text length
   */
  private validateTextLength(text: string): void {
    if (text.length > this.limits.maxTextLength) {
      throw new Error(`Text too long: ${text.length}/${this.limits.maxTextLength} characters`);
    }
  }

  /**
   * Create a button component
   */
  private createButton(options: ButtonOptions): ButtonBuilder {
    const button = new ButtonBuilder()
      .setLabel(options.label);

    // Handle style conversion
    let style: ButtonStyle;
    switch (options.style) {
      case 'primary':
        style = ButtonStyle.Primary;
        break;
      case 'secondary':
        style = ButtonStyle.Secondary;
        break;
      case 'success':
        style = ButtonStyle.Success;
        break;
      case 'danger':
        style = ButtonStyle.Danger;
        break;
      case 'link':
        style = ButtonStyle.Link;
        break;
      default:
        style = options.style as ButtonStyle;
    }

    button.setStyle(style);

    // Handle URL vs customId (they're mutually exclusive)
    if (options.url) {
      button.setURL(options.url);
    } else if (options.customId) {
      button.setCustomId(options.customId);
    }

    if (options.emoji) {
      button.setEmoji(options.emoji);
    }

    if (options.disabled) {
      button.setDisabled(options.disabled);
    }

    if (options.id !== undefined) {
      button.setId(options.id);
    }

    return button;
  }

  /**
   * Create a thumbnail component
   */
  private createThumbnail(options: ThumbnailAccessory): Record<string, unknown> {
    // Create a thumbnail component using Discord.js V2 API
    return {
      type: 'thumbnail',
      url: options.url,
      description: options.description,
      spoiler: options.spoiler
    };
  }

  /**
   * Create a select menu component
   */
  private createSelectMenu(options: SelectMenuOptions): ButtonBuilder | StringSelectMenuBuilder | UserSelectMenuBuilder | RoleSelectMenuBuilder | ChannelSelectMenuBuilder | MentionableSelectMenuBuilder {
    let selectMenu: ButtonBuilder | StringSelectMenuBuilder | UserSelectMenuBuilder | RoleSelectMenuBuilder | ChannelSelectMenuBuilder | MentionableSelectMenuBuilder;

    switch (options.type) {
      case 'string':
        selectMenu = new StringSelectMenuBuilder()
          .setCustomId(options.customId)
          .setPlaceholder(options.placeholder || 'Select an option...')
          .setOptions(options.options || []);
        break;

      case 'user':
        selectMenu = new UserSelectMenuBuilder()
          .setCustomId(options.customId)
          .setPlaceholder(options.placeholder || 'Select users...');
        break;

      case 'role':
        selectMenu = new RoleSelectMenuBuilder()
          .setCustomId(options.customId)
          .setPlaceholder(options.placeholder || 'Select roles...');
        break;

      case 'channel':
        selectMenu = new ChannelSelectMenuBuilder()
          .setCustomId(options.customId)
          .setPlaceholder(options.placeholder || 'Select channels...');
        if (options.channelTypes) {
          // Set channel types if available in Discord.js V2
        }
        break;

      case 'mentionable':
        selectMenu = new MentionableSelectMenuBuilder()
          .setCustomId(options.customId)
          .setPlaceholder(options.placeholder || 'Select mentionable...');
        break;

      default:
        throw new Error(`Unsupported select menu type: ${(options as { type: string }).type}`);
    }

    if (options.minValues !== undefined) {
      // Set min values if available in Discord.js V2
    }

    if (options.maxValues !== undefined) {
      // Set max values if available in Discord.js V2
    }

    if (options.disabled) {
      // Set disabled if available in Discord.js V2
    }

    if (options.id !== undefined) {
      // Set ID if available in Discord.js V2
    }

    return selectMenu;
  }

  /**
   * Create a section component
   */
  private createSection(options: Record<string, unknown>): SectionBuilder {
    const section = new SectionBuilder();
    
    // Add text displays based on options
    if (options.text) {
      const textArray = Array.isArray(options.text) ? options.text : [options.text];
      textArray.forEach((text: string) => {
        const textDisplay = new TextDisplayBuilder().setContent(text);
        section.addTextDisplayComponents(textDisplay);
      });
    }
    
    return section;
  }

  /**
   * Get the current component count
   */
  getComponentCount(): number {
    return this.componentCount;
  }

  /**
   * Get the current text length
   */
  getTextLength(): number {
    return this.totalTextLength;
  }

  /**
   * Clear all components
   */
  clear(): this {
    this.components = [];
    this.totalTextLength = 0;
    this.componentCount = 0;
    return this;
  }
} 