import type { EmbedMigrationOptions } from '../types';
import { MessageBuilder } from '../builders/MessageBuilder';
import { ColorUtils } from './ColorUtils';

/**
 * Utility class for migrating from Discord.js V1 components to V2
 */
export class MigrationUtils {
  /**
   * Convert a V1 embed to V2 container components
   */
  static embedToContainer(options: EmbedMigrationOptions): MessageBuilder {
    const message = new MessageBuilder();

    // Convert color
    let accentColor: number | undefined;
    if (options.color) {
      if (typeof options.color === 'string') {
        accentColor = ColorUtils.hexToInt(options.color);
      } else {
        accentColor = options.color;
      }
    }

    // Build container children
    const children: any[] = [];

    // Add title
    if (options.title) {
      children.push({
        type: 'text',
        content: `**${options.title}**`
      });
    }

    // Add description
    if (options.description) {
      children.push({
        type: 'text',
        content: options.description
      });
    }

    // Add fields
    if (options.fields) {
      options.fields.forEach(field => {
        const fieldText = field.inline 
          ? `**${field.name}** ${field.value}`
          : `**${field.name}**\n${field.value}`;
        
        children.push({
          type: 'text',
          content: fieldText
        });
      });
    }

    // Add footer
    if (options.footer) {
      const footerText = options.footer.iconURL 
        ? `${options.footer.iconURL} ${options.footer.text}`
        : options.footer.text;
      
      children.push({
        type: 'text',
        content: `*${footerText}*`
      });
    }

    // Add timestamp
    if (options.timestamp) {
      const timestamp = typeof options.timestamp === 'string' 
        ? new Date(options.timestamp)
        : options.timestamp;
      
      children.push({
        type: 'text',
        content: `*${timestamp.toISOString()}*`
      });
    }

    // Create container
    message.addContainer({
      accentColor,
      children
    });

    return message;
  }

  /**
   * Convert V1 action row with buttons to V2 inline buttons
   */
  static actionRowToInlineButtons(actionRow: any): MessageBuilder {
    const message = new MessageBuilder();

    actionRow.components.forEach((component: any) => {
      if (component.type === 'BUTTON') {
        message.addButton({
          customId: component.customId,
          label: component.label,
          style: this.convertButtonStyle(component.style),
          url: component.url,
          emoji: component.emoji?.name,
          disabled: component.disabled
        });
      }
    });

    return message;
  }

  /**
   * Convert V1 action row with select menu to V2 inline select menu
   */
  static actionRowToInlineSelectMenu(actionRow: any): MessageBuilder {
    const message = new MessageBuilder();

    actionRow.components.forEach((component: any) => {
      switch (component.type) {
        case 'STRING_SELECT':
          message.addSelectMenu({
            type: 'string',
            customId: component.customId,
            placeholder: component.placeholder,
            minValues: component.minValues,
            maxValues: component.maxValues,
            disabled: component.disabled,
            options: component.options
          });
          break;

        case 'USER_SELECT':
          message.addSelectMenu({
            type: 'user',
            customId: component.customId,
            placeholder: component.placeholder,
            minValues: component.minValues,
            maxValues: component.maxValues,
            disabled: component.disabled
          });
          break;

        case 'ROLE_SELECT':
          message.addSelectMenu({
            type: 'role',
            customId: component.customId,
            placeholder: component.placeholder,
            minValues: component.minValues,
            maxValues: component.maxValues,
            disabled: component.disabled
          });
          break;

        case 'CHANNEL_SELECT':
          message.addSelectMenu({
            type: 'channel',
            customId: component.customId,
            placeholder: component.placeholder,
            minValues: component.minValues,
            maxValues: component.maxValues,
            disabled: component.disabled,
            channelTypes: component.channelTypes
          });
          break;

        case 'MENTIONABLE_SELECT':
          message.addSelectMenu({
            type: 'mentionable',
            customId: component.customId,
            placeholder: component.placeholder,
            minValues: component.minValues,
            maxValues: component.maxValues,
            disabled: component.disabled
          });
          break;
      }
    });

    return message;
  }

  /**
   * Convert V1 button style to V2 style
   */
  private static convertButtonStyle(v1Style: number): 'primary' | 'secondary' | 'success' | 'danger' | 'link' {
    switch (v1Style) {
      case 1: return 'primary';
      case 2: return 'secondary';
      case 3: return 'success';
      case 4: return 'danger';
      case 5: return 'link';
      default: return 'secondary';
    }
  }

  /**
   * Convert V1 message with embeds to V2 message
   */
  static messageV1ToV2(v1Message: any): MessageBuilder {
    const message = new MessageBuilder();

    // Add text content if present
    if (v1Message.content) {
      message.addText(v1Message.content);
    }

    // Convert embeds
    if (v1Message.embeds) {
      v1Message.embeds.forEach((embed: any) => {
        // Add the container component to the message
        // Note: embed conversion logic would be implemented here
        message.addContainer({
          children: [
            { type: 'text', content: embed.title ? `**${embed.title}**` : '' },
            { type: 'text', content: embed.description || '' }
          ]
        });
      });
    }

    // Convert action rows
    if (v1Message.components) {
      v1Message.components.forEach((actionRow: any) => {
        if (actionRow.type === 'ACTION_ROW') {
          const hasButtons = actionRow.components.some((comp: any) => comp.type === 'BUTTON');
          const hasSelectMenus = actionRow.components.some((comp: any) => 
            ['STRING_SELECT', 'USER_SELECT', 'ROLE_SELECT', 'CHANNEL_SELECT', 'MENTIONABLE_SELECT'].includes(comp.type)
          );

          if (hasButtons) {
            // Note: button conversion logic would be implemented here
            // The actual implementation would depend on the specific component structure
          } else if (hasSelectMenus) {
            // Note: select menu conversion logic would be implemented here
            // The actual implementation would depend on the specific component structure
          }
        }
      });
    }

    return message;
  }

  /**
   * Create a simple welcome message from V1 embed style
   */
  static createWelcomeMessage(options: {
    title?: string;
    description?: string;
    color?: string;
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
    footer?: { text: string; iconURL?: string };
  }): MessageBuilder {
    return this.embedToContainer({
      title: options.title || 'Welcome!',
      description: options.description || 'Welcome to our server!',
      color: options.color || '#0099FF',
      fields: options.fields,
      footer: options.footer
    });
  }

  /**
   * Create a simple info card from V1 embed style
   */
  static createInfoCard(options: {
    title: string;
    description: string;
    color?: string;
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
  }): MessageBuilder {
    return this.embedToContainer({
      title: options.title,
      description: options.description,
      color: options.color || '#57F287',
      fields: options.fields
    });
  }

  /**
   * Create an error card from V1 embed style
   */
  static createErrorCard(options: {
    title?: string;
    description: string;
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
  }): MessageBuilder {
    return this.embedToContainer({
      title: options.title || 'Error',
      description: options.description,
      color: '#ED4245',
      fields: options.fields
    });
  }

  /**
   * Create a success card from V1 embed style
   */
  static createSuccessCard(options: {
    title?: string;
    description: string;
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
  }): MessageBuilder {
    return this.embedToContainer({
      title: options.title || 'Success',
      description: options.description,
      color: '#57F287',
      fields: options.fields
    });
  }

  /**
   * Create a warning card from V1 embed style
   */
  static createWarningCard(options: {
    title?: string;
    description: string;
    fields?: Array<{ name: string; value: string; inline?: boolean }>;
  }): MessageBuilder {
    return this.embedToContainer({
      title: options.title || 'Warning',
      description: options.description,
      color: '#F1C40F',
      fields: options.fields
    });
  }
} 